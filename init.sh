#!/bin/bash

# =============================================================================
# init.sh - ElectroBuy 项目初始化脚本
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "========================================"
echo "  ElectroBuy 项目初始化"
echo "========================================"
echo ""

# 检查 Node.js
echo -e "${BLUE}[1/6] 检查 Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js 已安装: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js 未安装，请安装 Node.js 18.x 或更高版本${NC}"
    exit 1
fi

# 检查 .NET SDK
echo -e "${BLUE}[2/6] 检查 .NET SDK...${NC}"
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo -e "${GREEN}✓ .NET SDK 已安装: $DOTNET_VERSION${NC}"
else
    echo -e "${RED}✗ .NET SDK 未安装，请安装 .NET 8.x SDK${NC}"
    exit 1
fi

# 安装前端依赖
echo -e "${BLUE}[3/6] 安装前端依赖...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    if [ -f "package.json" ]; then
        npm install
        echo -e "${GREEN}✓ 前端依赖安装完成${NC}"
    else
        echo -e "${YELLOW}⚠ frontend/package.json 不存在，跳过${NC}"
    fi
    cd ..
else
    echo -e "${YELLOW}⚠ frontend 目录不存在，跳过${NC}"
fi

# 还原后端依赖
echo -e "${BLUE}[4/6] 还原后端依赖...${NC}"
if [ -f "backend/ElectroBuy.sln" ]; then
    cd backend
    dotnet restore
    echo -e "${GREEN}✓ 后端依赖还原完成${NC}"
    cd ..
elif [ -f "ElectroBuy.sln" ]; then
    dotnet restore
    echo -e "${GREEN}✓ 后端依赖还原完成${NC}"
else
    echo -e "${YELLOW}⚠ 解决方案文件不存在，跳过${NC}"
fi

# 检查数据库连接
echo -e "${BLUE}[5/6] 检查数据库连接...${NC}"
echo -e "${YELLOW}⚠ 请确保 SQL Server 已启动并配置正确的连接字符串${NC}"
echo -e "${YELLOW}  连接字符串配置位置: backend/src/ElectroBuy.Api/appsettings.json${NC}"

# 应用数据库迁移
echo -e "${BLUE}[6/6] 应用数据库迁移...${NC}"
if [ -d "backend/src/ElectroBuy.Infrastructure/Migrations" ] || [ -d "src/ElectroBuy.Infrastructure/Migrations" ]; then
    echo -e "${YELLOW}⚠ 发现迁移文件，请手动运行: dotnet ef database update${NC}"
else
    echo -e "${YELLOW}⚠ 暂无迁移文件，将在创建实体后生成${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}  初始化完成！${NC}"
echo "========================================"
echo ""
echo "下一步操作："
echo "  1. 配置数据库连接字符串 (appsettings.json)"
echo "  2. 运行后端: cd backend && dotnet run --project src/ElectroBuy.Api"
echo "  3. 运行前端: cd frontend && npm run dev"
echo ""
