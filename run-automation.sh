#!/bin/bash

# =============================================================================
# run-automation.sh - ElectroBuy 自动化任务运行脚本
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Default settings
MAX_TASKS=999
AI_COMMAND="claude"
CONTEXT_RESET_ENABLED=true
PROJECT_DIR="."

# Log file
LOG_DIR="./automation-logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/automation-$(date +%Y%m%d_%H%M%S).log"

# Session counter
SESSION_COUNTER_FILE="./.session-counter"

# Helper Functions

log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" >> "$LOG_FILE"

    case $level in
        INFO)    echo -e "${BLUE}[INFO]${NC} ${message}" ;;
        SUCCESS) echo -e "${GREEN}[SUCCESS]${NC} ${message}" ;;
        WARNING) echo -e "${YELLOW}[WARNING]${NC} ${message}" ;;
        ERROR)   echo -e "${RED}[ERROR]${NC} ${message}" ;;
        PROGRESS) echo -e "${CYAN}[PROGRESS]${NC} ${message}" ;;
        CYCLE)   echo -e "${MAGENTA}[CYCLE]${NC} ${message}" ;;
    esac
}

show_help() {
    echo "
Usage: $0 [options]

Options:
  --max-tasks N     Maximum number of tasks to complete (default: all)
  --ai-command CMD  AI command to run (default: claude)
  --no-reset        Disable context reset between tasks
  --help            Show this help message

Examples:
  $0                                    # Run all tasks with context reset
  $0 --max-tasks 5                      # Run max 5 tasks
  $0 --ai-command \"claude -p --dangerously-skip-permissions\"
  $0 --no-reset                         # Run without context reset

Context Cycle:
  Each task.json task is treated as one 'context cycle':
  1. AI reads SYSTEM.md, PROJECTS.md, SESSION.md, task.json
  2. AI completes one task
  3. AI updates SESSION.md and task.json
  4. Context is reset (new AI session starts)
  5. Repeat until all tasks complete
"
    exit 0
}

count_remaining_tasks() {
    if [ -f "${PROJECT_DIR}/task.json" ]; then
        local count=$(grep -c '"passes": false' "${PROJECT_DIR}/task.json" 2>/dev/null || echo "0")
        echo "$count"
    else
        echo "0"
    fi
}

get_session_count() {
    if [ -f "$SESSION_COUNTER_FILE" ]; then
        cat "$SESSION_COUNTER_FILE"
    else
        echo "0"
    fi
}

increment_session_count() {
    local count=$(get_session_count)
    echo $((count + 1)) > "$SESSION_COUNTER_FILE"
    echo $((count + 1))
}

# Parse Arguments

while [[ $# -gt 0 ]]; do
    case $1 in
        --max-tasks)
            MAX_TASKS="$2"
            shift 2
            ;;
        --ai-command)
            AI_COMMAND="$2"
            shift 2
            ;;
        --no-reset)
            CONTEXT_RESET_ENABLED=false
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

# Main Script

echo ""
echo "========================================"
echo "  ElectroBuy - AI Agent Automation"
echo "========================================"
echo ""

log "INFO" "Starting automation"
log "INFO" "Log file: $LOG_FILE"
log "INFO" "Max tasks: $MAX_TASKS"
log "INFO" "AI command: $AI_COMMAND"
log "INFO" "Context reset: $CONTEXT_RESET_ENABLED"

# Check if task.json exists
if [ ! -f "${PROJECT_DIR}/task.json" ]; then
    log "ERROR" "task.json not found in ${PROJECT_DIR}"
    log "ERROR" "Please run this script from the project root."
    exit 1
fi

# Check if SESSION.md exists
if [ ! -f "${PROJECT_DIR}/SESSION.md" ]; then
    log "WARNING" "SESSION.md not found. Creating from template..."
    if [ -f "../session.template.md" ]; then
        cp ../session.template.md "${PROJECT_DIR}/SESSION.md"
        log "INFO" "SESSION.md created from template"
    else
        log "ERROR" "session.template.md not found. Please create SESSION.md manually."
        exit 1
    fi
fi

# Initial task count
INITIAL_TASKS=$(count_remaining_tasks)
log "INFO" "Tasks remaining at start: $INITIAL_TASKS"

# Task completion counter
TASKS_COMPLETED=0

# Main Loop - Context Cycle

while true; do
    # Check if we've reached max tasks
    if [ $TASKS_COMPLETED -ge $MAX_TASKS ]; then
        log "INFO" "Reached max tasks limit ($MAX_TASKS). Stopping."
        break
    fi

    # Check remaining tasks
    REMAINING=$(count_remaining_tasks)
    if [ $REMAINING -eq 0 ]; then
        log "SUCCESS" "All tasks completed!"
        break
    fi

    # Get session number
    SESSION_NUM=$(increment_session_count)

    # Start new context cycle
    log "CYCLE" "=========================================="
    log "CYCLE" "Starting Context Cycle #${SESSION_NUM}"
    log "CYCLE" "Tasks remaining: ${REMAINING}"
    log "CYCLE" "=========================================="

    # Record start time
    START_TIME=$(date +%s)

    # Run AI Agent
    log "INFO" "Starting AI session..."

    # Build the prompt for the AI
    PROMPT="Please read CLAUDE.md to understand the project, then continue development. Read SESSION.md to restore context from the previous session, then complete the next task in task.json."

    # Run the AI command
    if $CONTEXT_RESET_ENABLED; then
        log "INFO" "Context reset enabled - starting fresh AI session"
        cd "$PROJECT_DIR"
        $AI_COMMAND "$PROMPT" 2>&1 | tee -a "$LOG_FILE" || {
            log "ERROR" "AI session failed or was interrupted"
            log "INFO" "Check SESSION.md for the current state"
            exit 1
        }
        cd - > /dev/null
    else
        log "INFO" "Context reset disabled - using same context"
        cd "$PROJECT_DIR"
        $AI_COMMAND "$PROMPT" 2>&1 | tee -a "$LOG_FILE" || {
            log "ERROR" "AI session failed or was interrupted"
            exit 1
        }
        cd - > /dev/null
    fi

    # Record end time
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))

    # Check if a task was completed
    NEW_REMAINING=$(count_remaining_tasks)
    if [ $NEW_REMAINING -lt $REMAINING ]; then
        TASKS_COMPLETED=$((TASKS_COMPLETED + 1))
        log "SUCCESS" "Task completed! Duration: ${DURATION}s"
        log "PROGRESS" "Total tasks completed this run: ${TASKS_COMPLETED}"
    else
        log "WARNING" "No task was completed in this cycle"
        log "WARNING" "Check SESSION.md for details"
    fi

    log "CYCLE" "Context Cycle #${SESSION_NUM} completed"
    log "CYCLE" "Tasks remaining: ${NEW_REMAINING}"
    echo ""

    # Small delay between cycles
    sleep 2
done

# Summary

echo ""
echo "========================================"
echo "  Automation Complete"
echo "========================================"
echo ""

log "INFO" "Total tasks completed: ${TASKS_COMPLETED}"
log "INFO" "Tasks remaining: $(count_remaining_tasks)"
log "INFO" "Total sessions: $(get_session_count)"
log "INFO" "Log file: $LOG_FILE"

if [ $(count_remaining_tasks) -eq 0 ]; then
    log "SUCCESS" "All tasks completed! 🎉"
else
    log "INFO" "Some tasks remain. Run again to continue."
fi
