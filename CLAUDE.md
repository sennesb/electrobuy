# ElectroBuy - AI 工作指令

> **重要**：如果是首次接触本项目，请先阅读 `SYSTEM.md` 了解系统架构和运行机制。

---

## 项目上下文

ElectroBuy 是一个电气自动化产品采买平台，为工程师、采购人员和企业提供电气自动化产品的在线采购服务。

**项目类型**：全栈 Web 应用 (React + ASP.NET Core)

**技术栈**：
- 前端：React 18 + TypeScript + Vite + Tailwind CSS + Zustand + TanStack Query
- 后端：ASP.NET Core 8 + C# + Entity Framework Core + SQL Server + Redis

> 详细设计见 `design.md`，任务清单见 `task.json`

---

## 强制执行：AI 工作流程

每次会话必须遵循以下流程：

### Step 1: 初始化环境

```bash
./init.sh
```

**初始化内容**：
1. 检查 Node.js 和 .NET SDK 版本
2. 安装前端依赖 (npm install)
3. 还原后端依赖 (dotnet restore)
4. 检查数据库连接
5. 应用数据库迁移

**不要跳过此步骤**。确保环境就绪后再继续。

---

### Step 2: 选择下一个任务

读取 `task.json`，选择一个任务执行。

**选择优先级**：
1. 选择 `passes: false` 的任务
2. 考虑依赖关系 - 基础功能优先
3. 选择优先级最高的未完成任务

---

### Step 3: 实现任务

- 仔细阅读任务描述和步骤
- 按步骤实现功能
- 遵循现有代码模式和规范

---

### Step 4: 测试验证

实现后，验证任务的所有步骤：

**测试要求**：

**后端测试**：
- [ ] `dotnet build` 编译成功
- [ ] `dotnet test` 单元测试通过
- [ ] API 端点可访问 (Swagger)

**前端测试**：
- [ ] `npm run lint` 检查通过
- [ ] `npm run build` 构建成功
- [ ] 页面功能正常运行

**通用测试清单**：
- [ ] 代码无类型错误
- [ ] 遵循项目代码规范
- [ ] 功能正常运行

---

### Step 5: 更新进度

在 `progress.txt` 中记录工作：

```
## [日期] - 任务: [任务描述]

### 完成内容:
- [具体修改]

### 测试:
- [测试方法]

### 备注:
- [相关说明]
```

---

### Step 6: 提交更改

**重要：所有更改必须在同一个 commit 中提交！**

流程：
1. 更新 `task.json`，将 `passes` 从 `false` 改为 `true`
2. 更新 `progress.txt` 记录工作内容
3. 更新 `SESSION.md` 记录项目状态
4. 一次性提交所有更改：

```bash
git add .
git commit -m "[任务描述] - 完成"
```

**规则**：
- 只有所有步骤验证通过后才标记 `passes: true`
- 永远不要删除或修改任务描述
- 永远不要从列表中移除任务
- 一个任务的所有内容（代码、progress.txt、task.json、SESSION.md）必须在同一个 commit 中提交

---

## ⚠️ 阻塞处理

**如果任务无法完成或需要人工介入，必须遵循以下规则：**

### 需要停止任务的情况：

1. **缺少环境配置**：
   - 需要配置数据库连接字符串
   - 需要填写 JWT 密钥
   - 需要配置 Redis 连接

2. **外部依赖不可用**：
   - SQL Server 未安装或无法连接
   - Redis 未安装（可选功能）

3. **测试无法进行**：
   - 需要真实用户账号
   - 需要特定硬件环境

### 阻塞时的操作：

**禁止**：
- ❌ 提交 git commit
- ❌ 将 task.json 的 passes 设为 true
- ❌ 假装任务已完成

**必须**：
- ✅ 在 SESSION.md 中记录当前进度和阻塞原因
- ✅ 在 progress.txt 中记录已完成的工作
- ✅ 输出清晰的阻塞信息，说明需要人工做什么
- ✅ 停止任务，等待人工介入

### 阻塞信息格式：

```
🚫 任务阻塞 - 需要人工介入

**当前任务**: [任务名称]

**已完成的工作**:
- [已完成的代码/配置]

**阻塞原因**:
- [具体说明为什么无法继续]

**需要人工帮助**:
1. [具体步骤 1]
2. [具体步骤 2]

**解除阻塞后**:
- 运行 [命令] 继续任务
```

---

## 项目结构

```
electrobuy/
├── backend/                          # 后端项目
│   ├── src/
│   │   ├── ElectroBuy.Api/           # API 层
│   │   ├── ElectroBuy.Application/   # 应用层
│   │   ├── ElectroBuy.Domain/        # 领域层
│   │   └── ElectroBuy.Infrastructure/# 基础设施层
│   ├── tests/
│   └── ElectroBuy.sln
├── frontend/                         # 前端项目
│   ├── src/
│   │   ├── components/               # 组件
│   │   ├── hooks/                    # 自定义 Hooks
│   │   ├── stores/                   # 状态管理
│   │   ├── lib/                      # 工具库
│   │   ├── types/                    # 类型定义
│   │   └── pages/                    # 页面
│   ├── package.json
│   └── vite.config.ts
├── CLAUDE.md                         # 本文件
├── design.md                         # 设计文档
├── task.json                         # 任务清单
├── SESSION.md                        # 会话状态
├── progress.txt                      # 进度日志
├── init.sh                           # 初始化脚本
└── run-automation.sh                 # 自动化脚本
```

---

## 常用命令

### 后端命令
```bash
# 还原依赖
dotnet restore

# 构建项目
dotnet build

# 运行项目
dotnet run --project src/ElectroBuy.Api

# 运行测试
dotnet test

# 数据库迁移
dotnet ef migrations add [MigrationName] --project src/ElectroBuy.Infrastructure --startup-project src/ElectroBuy.Api
dotnet ef database update --project src/ElectroBuy.Infrastructure --startup-project src/ElectroBuy.Api

# 代码格式化
dotnet format
```

### 前端命令
```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

---

## 代码规范

### 后端代码规范 (C#)
- 使用 PascalCase 命名类、方法、属性
- 使用 camelCase 命名局部变量和参数
- 使用 _camelCase 命名私有字段
- 接口以 I 开头
- 异步方法以 Async 结尾
- 使用 LINQ 替代循环操作集合

### 前端代码规范 (TypeScript/React)
- 组件使用 PascalCase 命名
- 文件名使用 PascalCase (组件) 或 camelCase (工具函数)
- 使用函数式组件和 Hooks
- 使用 TypeScript 类型定义
- 使用 Tailwind CSS 类名

**通用规范**：
- 使用有意义的变量和函数命名
- 保持代码简洁，避免过度复杂
- 必要时添加注释说明复杂逻辑
- 遵循项目已有代码风格

---

## 关键规则

1. **一次一个任务** - 专注完成一个任务
2. **测试后标记完成** - 所有步骤必须通过
3. **记录进度** - 在 progress.txt 和 SESSION.md 中记录工作
4. **一个任务一个 commit** - 所有更改在同一 commit 中提交
5. **不删除任务** - 只将 `passes: false` 改为 `true`
6. **不能修改task.json里的任务内容** - 需要修改任务内容是请求人工介入
7. **阻塞时停止** - 需要人工介入时，不提交，输出阻塞信息并停止
8. **会话结束时更新 SESSION.md** - 为下一个 AI 留下准确上下文
