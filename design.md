# Web 系统设计文档 - ElectroBuy 电气自动化产品采买平台

> 创建日期：2026-02-19
> 版本：1.0.0
> 状态：初始化

---

## 1. 项目概述

### 1.1 项目名称
ElectroBuy - 电气自动化产品采买平台

### 1.2 项目简介
一个面向电气自动化行业的 B2B/B2C 电子商务平台，为工程师、采购人员和企业提供电气自动化产品的在线采购服务，包括 PLC、变频器、传感器、电机、低压电器等工业自动化设备。

### 1.3 目标用户
- 电气工程师：需要采购自动化设备进行项目实施
- 采购人员：企业采购部门，需要批量采购设备
- 系统集成商：需要采购多种设备进行系统集成
- 设备维护人员：需要采购备品备件进行设备维护

### 1.4 核心功能
1. **产品目录管理**：产品分类、规格参数、技术文档
2. **智能搜索**：按型号、参数、品牌多维度搜索
3. **购物车与订单**：在线下单、订单跟踪、历史订单
4. **用户管理**：企业认证、权限管理、采购审批流程
5. **报价系统**：批量询价、在线报价、合同管理

### 1.5 项目范围
- **包含**：产品展示、购物车、订单管理、用户认证、基础报价功能
- **不包含**：在线支付、物流跟踪、ERP 集成（后续迭代）

---

## 2. 系统架构

### 2.1 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                              │
│  (React SPA / TypeScript / Tailwind CSS)                    │
├─────────────────────────────────────────────────────────────┤
│                      API 网关层                              │
│  (ASP.NET Core Web API / JWT Authentication)                │
├─────────────────────────────────────────────────────────────┤
│                      业务逻辑层                              │
│  (Services / Domain Logic / Validators)                     │
├─────────────────────────────────────────────────────────────┤
│                      数据访问层                              │
│  (Entity Framework Core / Repository Pattern)               │
├─────────────────────────────────────────────────────────────┤
│                      基础设施层                              │
│  (SQL Server / Redis Cache / File Storage)                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 架构模式
- [x] 分层架构 (Layered Architecture)
- [x] 领域驱动设计 (DDD) 部分实践
- [ ] 清洁架构 (Clean Architecture)

### 2.3 核心模块

| 模块名称 | 职责 | 依赖 |
|----------|------|------|
| 认证模块 | 用户登录、注册、JWT Token 管理 | 无 |
| 用户模块 | 用户信息管理、企业认证 | 认证模块 |
| 产品模块 | 产品目录、分类、规格参数 | 无 |
| 购物车模块 | 购物车管理、数量计算 | 产品模块、用户模块 |
| 订单模块 | 订单创建、状态管理、历史记录 | 购物车模块、用户模块 |
| 报价模块 | 询价单、报价单管理 | 产品模块、用户模块 |

### 2.4 模块交互图

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React SPA  │────→│  ASP.NET API │────→│   服务层     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            ↓                     ↓
                     ┌──────────────┐     ┌──────────────┐
                     │   中间件      │     │   仓库层     │
                     │ (JWT/Logging)│     │  (EF Core)   │
                     └──────────────┘     └──────────────┘
                                                  │
                                                  ↓
                                          ┌──────────────┐
                                          │  SQL Server  │
                                          └──────────────┘
```

---

## 3. 技术选型

### 3.1 前端技术栈

| 类别 | 技术选择 | 版本 | 选型理由 |
|------|----------|------|----------|
| 框架 | React | 18.x | 组件化开发、生态丰富 |
| 构建工具 | Vite | 5.x | 快速开发、HMR 性能好 |
| 语言 | TypeScript | 5.x | 类型安全、开发体验好 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS、快速开发 |
| 状态管理 | Zustand | 4.x | 轻量、简洁、TypeScript 友好 |
| 数据请求 | TanStack Query | 5.x | 缓存、自动刷新、乐观更新 |
| 路由 | React Router | 6.x | 标准路由解决方案 |
| 表单处理 | React Hook Form | 7.x | 性能好、验证集成 |
| 表单验证 | Zod | 3.x | TypeScript 优先、类型推导 |
| UI 组件 | shadcn/ui | latest | 可定制、基于 Radix UI |

### 3.2 后端技术栈

| 类别 | 技术选择 | 版本 | 选型理由 |
|------|----------|------|----------|
| 框架 | ASP.NET Core | 8.x | 高性能、跨平台、企业级 |
| 语言 | C# | 12.x | 强类型、现代语言特性 |
| 数据库 | SQL Server | 2022 | 企业级、与 .NET 生态集成好 |
| ORM | Entity Framework Core | 8.x | 成熟、Code First 支持 |
| 认证 | JWT + ASP.NET Identity | - | 标准认证方案 |
| 缓存 | Redis | 7.x | 高性能、分布式缓存 |
| API 文档 | Swagger/OpenAPI | - | 自动生成 API 文档 |
| 日志 | Serilog | - | 结构化日志 |

### 3.3 外部服务

| 服务名称 | 用途 | 配置位置 | 备选方案 |
|----------|------|----------|----------|
| Redis | 缓存、Session | `appsettings.json` | 内存缓存 |
| 文件存储 | 产品图片、文档 | Azure Blob / 本地 | MinIO |

### 3.4 开发工具

| 工具 | 用途 |
|------|------|
| ESLint | 前端代码检查 |
| Prettier | 代码格式化 |
| dotnet format | C# 代码格式化 |
| xUnit | 后端单元测试 |
| Vitest | 前端单元测试 |
| Playwright | E2E 测试 |

---

## 4. 数据设计

### 4.1 数据模型

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   User      │       │   Product   │       │  Category   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ Id          │       │ Id          │       │ Id          │
│ Email       │       │ Name        │       │ Name        │
│ Name        │       │ ModelNumber │       │ ParentId    │
│ Company     │       │ CategoryId  │───┐   │ Description │
│ Role        │       │ Brand       │   └──→│ CreatedAt   │
│ CreatedAt   │       │ Price       │       └─────────────┘
└─────────────┘       │ Stock       │
      │               │ Specs (JSON)│
      │               │ CreatedAt   │
      │               └─────────────┘
      │                     │
      ↓                     ↓
┌─────────────┐       ┌─────────────┐
│   Order     │       │  CartItem   │
├─────────────┤       ├─────────────┤
│ Id          │       │ Id          │
│ UserId      │───┐   │ UserId      │───┐
│ Status      │   │   │ ProductId   │   │
│ TotalAmount │   │   │ Quantity    │   │
│ CreatedAt   │   │   │ CreatedAt   │   │
└─────────────┘   │   └─────────────┘   │
      │           │                     │
      ↓           │                     │
┌─────────────┐   │                     │
│ OrderItem   │   │                     │
├─────────────┤   │                     │
│ Id          │   │                     │
│ OrderId     │←──┘                     │
│ ProductId   │←────────────────────────┘
│ Quantity    │
│ UnitPrice   │
└─────────────┘
```

### 4.2 数据表设计

#### 表名：Users

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | GUID | PK | NEWID() | 用户唯一标识 |
| Email | NVARCHAR(255) | UNIQUE, NOT NULL | - | 邮箱地址 |
| PasswordHash | NVARCHAR(255) | NOT NULL | - | 密码哈希 |
| Name | NVARCHAR(100) | | - | 用户名称 |
| Company | NVARCHAR(200) | | - | 公司名称 |
| Phone | NVARCHAR(50) | | - | 联系电话 |
| Role | INT | NOT NULL | 0 | 角色 (0=普通用户, 1=企业用户, 2=管理员) |
| IsActive | BIT | NOT NULL | 1 | 是否激活 |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |
| UpdatedAt | DATETIME2 | | | 更新时间 |

#### 表名：Categories

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | INT | PK, IDENTITY | - | 分类 ID |
| Name | NVARCHAR(100) | NOT NULL | - | 分类名称 |
| ParentId | INT | FK | NULL | 父分类 ID |
| Description | NVARCHAR(500) | | - | 分类描述 |
| SortOrder | INT | NOT NULL | 0 | 排序顺序 |
| IsActive | BIT | NOT NULL | 1 | 是否启用 |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |

#### 表名：Products

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | GUID | PK | NEWID() | 产品唯一标识 |
| Name | NVARCHAR(200) | NOT NULL | - | 产品名称 |
| ModelNumber | NVARCHAR(100) | NOT NULL | - | 型号 |
| CategoryId | INT | FK, NOT NULL | - | 分类 ID |
| Brand | NVARCHAR(100) | NOT NULL | - | 品牌 |
| Price | DECIMAL(18,2) | NOT NULL | 0 | 单价 |
| Unit | NVARCHAR(20) | | '件' | 单位 |
| Stock | INT | NOT NULL | 0 | 库存数量 |
| MinOrderQty | INT | NOT NULL | 1 | 最小起订量 |
| Specs | NVARCHAR(MAX) | | - | 规格参数 (JSON) |
| Description | NVARCHAR(MAX) | | - | 产品描述 |
| Images | NVARCHAR(MAX) | | - | 图片 URL 列表 (JSON) |
| IsActive | BIT | NOT NULL | 1 | 是否上架 |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |
| UpdatedAt | DATETIME2 | | | 更新时间 |

#### 表名：Orders

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | GUID | PK | NEWID() | 订单唯一标识 |
| OrderNumber | NVARCHAR(50) | UNIQUE, NOT NULL | - | 订单编号 |
| UserId | GUID | FK, NOT NULL | - | 用户 ID |
| Status | INT | NOT NULL | 0 | 状态 (0=待确认, 1=已确认, 2=已发货, 3=已完成, 4=已取消) |
| TotalAmount | DECIMAL(18,2) | NOT NULL | 0 | 订单总金额 |
| Remark | NVARCHAR(500) | | - | 备注 |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |
| UpdatedAt | DATETIME2 | | | 更新时间 |

#### 表名：OrderItems

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | GUID | PK | NEWID() | 订单项 ID |
| OrderId | GUID | FK, NOT NULL | - | 订单 ID |
| ProductId | GUID | FK, NOT NULL | - | 产品 ID |
| ProductName | NVARCHAR(200) | NOT NULL | - | 产品名称（快照） |
| ModelNumber | NVARCHAR(100) | NOT NULL | - | 型号（快照） |
| Quantity | INT | NOT NULL | 1 | 数量 |
| UnitPrice | DECIMAL(18,2) | NOT NULL | 0 | 单价（快照） |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |

#### 表名：CartItems

| 字段 | 类型 | 约束 | 默认值 | 描述 |
|------|------|------|--------|------|
| Id | GUID | PK | NEWID() | 购物车项 ID |
| UserId | GUID | FK, NOT NULL | - | 用户 ID |
| ProductId | GUID | FK, NOT NULL | - | 产品 ID |
| Quantity | INT | NOT NULL | 1 | 数量 |
| CreatedAt | DATETIME2 | NOT NULL | GETDATE() | 创建时间 |
| UpdatedAt | DATETIME2 | | | 更新时间 |

### 4.3 索引设计

| 表名 | 索引名 | 字段 | 类型 | 用途 |
|------|--------|------|------|------|
| Users | IX_Users_Email | Email | UNIQUE | 邮箱查询 |
| Products | IX_Products_CategoryId | CategoryId | NONCLUSTERED | 分类查询 |
| Products | IX_Products_ModelNumber | ModelNumber | NONCLUSTERED | 型号搜索 |
| Orders | IX_Orders_UserId | UserId | NONCLUSTERED | 用户订单查询 |
| Orders | IX_Orders_OrderNumber | OrderNumber | UNIQUE | 订单号查询 |

---

## 5. API 设计

### 5.1 API 概览

| 模块 | 基础路径 | 描述 |
|------|----------|------|
| 认证 | `/api/auth` | 用户认证相关 |
| 用户 | `/api/users` | 用户管理 |
| 产品 | `/api/products` | 产品目录 |
| 分类 | `/api/categories` | 产品分类 |
| 购物车 | `/api/cart` | 购物车管理 |
| 订单 | `/api/orders` | 订单管理 |
| 报价 | `/api/quotes` | 询价报价 |

### 5.2 端点详情

#### 认证模块

| 端点 | 方法 | 描述 | 认证 | 请求体 | 响应 |
|------|------|------|------|--------|------|
| `/api/auth/register` | POST | 用户注册 | 否 | `{email, password, name, company, phone}` | `{user, token}` |
| `/api/auth/login` | POST | 用户登录 | 否 | `{email, password}` | `{user, token}` |
| `/api/auth/me` | GET | 获取当前用户 | 是 | - | `{user}` |
| `/api/auth/refresh` | POST | 刷新 Token | 是 | `{refreshToken}` | `{token}` |

#### 产品模块

| 端点 | 方法 | 描述 | 认证 | 请求体 | 响应 |
|------|------|------|------|--------|------|
| `/api/products` | GET | 获取产品列表 | 否 | Query: `page, pageSize, categoryId, keyword, brand` | `{data, total, page, pageSize}` |
| `/api/products/{id}` | GET | 获取产品详情 | 否 | - | `{product}` |
| `/api/products` | POST | 创建产品 | 是(Admin) | `{name, modelNumber, categoryId, brand, price, ...}` | `{product}` |
| `/api/products/{id}` | PUT | 更新产品 | 是(Admin) | `{...}` | `{product}` |
| `/api/products/{id}` | DELETE | 删除产品 | 是(Admin) | - | `{success}` |

#### 购物车模块

| 端点 | 方法 | 描述 | 认证 | 请求体 | 响应 |
|------|------|------|------|--------|------|
| `/api/cart` | GET | 获取购物车 | 是 | - | `{items, total}` |
| `/api/cart` | POST | 添加到购物车 | 是 | `{productId, quantity}` | `{item}` |
| `/api/cart/{id}` | PUT | 更新数量 | 是 | `{quantity}` | `{item}` |
| `/api/cart/{id}` | DELETE | 移除商品 | 是 | - | `{success}` |
| `/api/cart/clear` | DELETE | 清空购物车 | 是 | - | `{success}` |

#### 订单模块

| 端点 | 方法 | 描述 | 认证 | 请求体 | 响应 |
|------|------|------|------|--------|------|
| `/api/orders` | GET | 获取订单列表 | 是 | Query: `page, pageSize, status` | `{data, total}` |
| `/api/orders/{id}` | GET | 获取订单详情 | 是 | - | `{order}` |
| `/api/orders` | POST | 创建订单 | 是 | `{remark}` | `{order}` |
| `/api/orders/{id}/cancel` | POST | 取消订单 | 是 | - | `{order}` |

### 5.3 请求/响应格式

#### 标准响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-02-19T00:00:00Z"
}
```

#### 分页响应格式
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2026-02-19T00:00:00Z"
}
```

#### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  },
  "timestamp": "2026-02-19T00:00:00Z"
}
```

### 5.4 认证方案

- **认证方式**：JWT (JSON Web Token)
- **Token 存储**：前端 LocalStorage + HttpOnly Cookie (可选)
- **Access Token 过期时间**：2 小时
- **Refresh Token 过期时间**：7 天
- **刷新策略**：Access Token 过期前自动刷新

---

## 6. 页面设计

### 6.1 页面路由

| 路由 | 页面名称 | 描述 | 认证 |
|------|----------|------|------|
| `/` | 首页 | 产品推荐、分类导航 | 否 |
| `/products` | 产品列表 | 产品搜索、筛选 | 否 |
| `/products/:id` | 产品详情 | 产品信息、加入购物车 | 否 |
| `/cart` | 购物车 | 购物车管理 | 是 |
| `/orders` | 订单列表 | 历史订单 | 是 |
| `/orders/:id` | 订单详情 | 订单信息 | 是 |
| `/login` | 登录页 | 用户登录 | 否 |
| `/register` | 注册页 | 用户注册 | 否 |
| `/profile` | 个人中心 | 用户信息管理 | 是 |
| `/admin/*` | 管理后台 | 产品、订单管理 | 是(Admin) |

### 6.2 页面布局

```
┌─────────────────────────────────────────────────────────────┐
│                         Header                               │
│  ┌──────┐  ┌─────────────────────────┐  ┌────────────────┐  │
│  │ Logo │  │      Search Bar         │  │ Cart │ Profile │  │
│  └──────┘  └─────────────────────────┘  └────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Category Nav                                               │
├─────────────────────────────────────────────────────────────┤
│         │                                                   │
│  Side   │                   Main Content                   │
│  Bar    │                                                   │
│         │                                                   │
├─────────────────────────────────────────────────────────────┤
│                         Footer                               │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 核心页面

#### 首页 (/)
- **目的**：产品推荐、分类导航、促销信息
- **组件**：HeroBanner、CategoryNav、FeaturedProducts、PromotionSection
- **状态**：无需登录

#### 产品列表 (/products)
- **目的**：产品搜索、筛选、浏览
- **组件**：SearchBar、FilterPanel、ProductGrid、Pagination
- **状态**：筛选条件、分页状态

#### 产品详情 (/products/:id)
- **目的**：查看产品详情、加入购物车
- **组件**：ProductGallery、ProductInfo、SpecTable、AddToCartButton
- **状态**：产品数据、购物车状态

#### 购物车 (/cart)
- **目的**：管理购物车、提交订单
- **组件**：CartItemList、OrderSummary、CheckoutButton
- **状态**：购物车数据、选中状态

---

## 7. 组件设计

### 7.1 组件层次结构

```
src/
├── components/
│   ├── ui/                    # 基础 UI 组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Card/
│   │   ├── Pagination/
│   │   └── ...
│   ├── layout/                # 布局组件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── MainLayout/
│   ├── features/              # 业务组件
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ...
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   └── ...
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── ...
│   │   └── order/
│   │       ├── OrderCard.tsx
│   │       ├── OrderStatus.tsx
│   │       └── ...
│   └── shared/                # 共享组件
│       ├── Loading/
│       ├── ErrorBoundary/
│       ├── EmptyState/
│       └── ...
```

### 7.2 核心组件

| 组件名 | 路径 | 职责 | Props |
|--------|------|------|-------|
| ProductCard | `components/features/product/ProductCard` | 产品卡片 | `product, onAddToCart` |
| ProductFilter | `components/features/product/ProductFilter` | 产品筛选 | `categories, brands, onFilter` |
| CartItem | `components/features/cart/CartItem` | 购物车项 | `item, onUpdate, onRemove` |
| OrderCard | `components/features/order/OrderCard` | 订单卡片 | `order` |
| Header | `components/layout/Header` | 页面头部 | `user, cartCount` |
| MainLayout | `components/layout/MainLayout` | 主布局 | `children` |

### 7.3 状态管理

#### 全局状态
| Store | 职责 | 状态字段 |
|-------|------|----------|
| authStore | 用户认证状态 | `user, isAuthenticated, token` |
| cartStore | 购物车状态 | `items, total, isLoading` |
| uiStore | UI 状态 | `sidebarOpen, theme` |

---

## 8. 安全设计

### 8.1 认证与授权

| 安全措施 | 实现方式 |
|----------|----------|
| 密码存储 | BCrypt 加密 |
| Token 安全 | JWT + 短有效期 |
| 权限控制 | 基于角色的访问控制 (RBAC) |
| 登录保护 | 登录失败次数限制 |

### 8.2 数据安全

| 安全措施 | 实现方式 |
|----------|----------|
| 传输加密 | HTTPS (TLS 1.3) |
| SQL 注入防护 | EF Core 参数化查询 |
| XSS 防护 | React 自动转义 + CSP |
| CSRF 防护 | SameSite Cookie |

### 8.3 API 安全

| 措施 | 配置 |
|------|------|
| 速率限制 | 100 次/分钟/IP |
| 请求大小限制 | 10 MB |
| 超时时间 | 30 秒 |

---

## 9. 性能设计

### 9.1 性能目标

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 首屏加载时间 (FCP) | < 1.8s | Lighthouse |
| 最大内容绘制 (LCP) | < 2.5s | Lighthouse |
| API 响应时间 | < 200ms | APM 监控 |

### 9.2 前端优化策略

| 优化项 | 策略 |
|--------|------|
| 代码分割 | 路由级别分割、动态导入 |
| 懒加载 | 图片懒加载、组件懒加载 |
| 缓存 | 浏览器缓存、CDN |
| 图片优化 | WebP 格式、响应式图片 |

### 9.3 后端优化策略

| 优化项 | 策略 |
|--------|------|
| 数据库 | 索引优化、查询优化 |
| 缓存 | Redis 缓存热点数据 |
| API | 响应压缩、批量请求 |

---

## 10. 前端项目结构

```
frontend/
├── src/
│   ├── components/           # 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── layout/           # 布局组件
│   │   ├── features/         # 业务组件
│   │   └── shared/           # 共享组件
│   ├── hooks/                # 自定义 Hooks
│   ├── stores/               # 状态管理 (Zustand)
│   ├── lib/                  # 工具库
│   │   ├── api/              # API 客户端
│   │   ├── utils/            # 工具函数
│   │   └── constants/        # 常量
│   ├── types/                # 类型定义
│   ├── pages/                # 页面组件
│   ├── App.tsx               # 根组件
│   └── main.tsx              # 入口文件
├── public/                   # 静态资源
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 11. 后端项目结构

```
backend/
├── src/
│   ├── ElectroBuy.Api/              # API 层
│   │   ├── Controllers/             # 控制器
│   │   ├── Middleware/              # 中间件
│   │   ├── Filters/                 # 过滤器
│   │   └── Program.cs               # 入口
│   ├── ElectroBuy.Application/      # 应用层
│   │   ├── Services/                # 服务
│   │   ├── DTOs/                    # 数据传输对象
│   │   ├── Interfaces/              # 接口定义
│   │   └── Mappings/                # 对象映射
│   ├── ElectroBuy.Domain/           # 领域层
│   │   ├── Entities/                # 实体
│   │   ├── Enums/                   # 枚举
│   │   └── Exceptions/              # 领域异常
│   └── ElectroBuy.Infrastructure/   # 基础设施层
│       ├── Data/                    # 数据访问
│       │   ├── Repositories/        # 仓库实现
│       │   └── ElectroBuyDbContext.cs
│       ├── Identity/                # 认证相关
│       └── Cache/                   # 缓存实现
├── tests/
│   ├── ElectroBuy.UnitTests/
│   └── ElectroBuy.IntegrationTests/
├── ElectroBuy.sln                   # 解决方案文件
└── docker-compose.yml               # Docker 配置
```

---

## 12. 环境配置

### 12.1 环境变量

```bash
# 前端 (.env)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ElectroBuy

# 后端 (appsettings.json)
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ElectroBuy;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-at-least-32-characters-long",
    "Issuer": "ElectroBuy",
    "Audience": "ElectroBuy",
    "ExpirationInMinutes": 120
  },
  "Redis": {
    "ConnectionString": "localhost:6379"
  }
}
```

### 12.2 开发环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 18.x | 前端运行时 |
| .NET SDK | >= 8.x | 后端运行时 |
| SQL Server | >= 2019 | 数据库 |
| Redis | >= 7.x | 缓存（可选） |
| Docker | >= 24.x | 容器化（可选） |

---

## 13. 测试策略

### 13.1 测试类型

| 类型 | 工具 | 覆盖率目标 | 范围 |
|------|------|------------|------|
| 单元测试 | xUnit / Vitest | > 80% | 服务、工具函数 |
| 集成测试 | xUnit | > 60% | API 端点 |
| E2E 测试 | Playwright | 核心流程 | 用户流程 |

### 13.2 E2E 测试场景

| 场景 | 步骤 | 预期结果 |
|------|------|----------|
| 用户注册 | 1. 打开注册页 2. 填写表单 3. 提交 | 注册成功 |
| 用户登录 | 1. 打开登录页 2. 输入账号密码 3. 点击登录 | 跳转到首页 |
| 搜索产品 | 1. 输入关键词 2. 点击搜索 | 显示搜索结果 |
| 加入购物车 | 1. 选择产品 2. 点击加入购物车 | 购物车数量增加 |
| 提交订单 | 1. 进入购物车 2. 确认订单 3. 提交 | 订单创建成功 |

---

## 14. 部署方案

### 14.1 环境规划

| 环境 | 用途 | 域名 | 分支 |
|------|------|------|------|
| 开发环境 | 开发调试 | dev.electrobuy.com | develop |
| 测试环境 | 测试验证 | test.electrobuy.com | release |
| 生产环境 | 正式运行 | www.electrobuy.com | main |

### 14.2 部署架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CDN       │────→│   Nginx     │────→│  Frontend   │
│             │     │   Reverse   │     │  (React)    │
└─────────────┘     │   Proxy     │     └─────────────┘
                    └─────────────┘            │
                          │                    │
                          ↓                    │
                    ┌─────────────┐            │
                    │   Backend   │←───────────┘
                    │ (ASP.NET)   │
                    └─────────────┘
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Redis   │    │SQL Server│    │   S3     │
    └──────────┘    └──────────┘    └──────────┘
```

---

## 15. 里程碑

| 阶段 | 功能模块 | 交付物 | 预计完成 |
|------|----------|--------|----------|
| MVP | 用户认证、产品浏览、购物车、基础订单 | 可运行版本 | Phase 1 |
| v1.0 | 完整订单流程、报价系统、管理后台 | 生产版本 | Phase 2 |
| v1.1 | 高级搜索、数据分析、批量操作 | 增强版本 | Phase 3 |

---

## 16. 参考资料

- ASP.NET Core 文档：https://docs.microsoft.com/aspnet/core
- React 文档：https://react.dev
- Entity Framework Core：https://docs.microsoft.com/ef/core
- Tailwind CSS：https://tailwindcss.com
