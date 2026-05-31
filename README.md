# 斯诺在中国 · 人物时空数据库 项目说明文档

## 项目概述

本项目是一个基于 **埃德加·斯诺** 两部自传《我在旧中国十三年》和《复始之旅》构建的**人文数据库与可视化平台**。通过 **时空足迹地图**、**人物关系网络图**、**大事件时间轴** 和 **AI 智能问答** 四种交互方式，立体呈现一位美国记者在中国（1928–1941 年）的所见所闻及其历史价值。

项目定位为 **图书本体的远读平台**，数据核心来源于书中原文，旨在帮助读者从地理、人际、事件、文本四个维度深入理解斯诺的觉醒历程与对中国革命的见证。

---

## 技术架构

- **前端**：HTML5 + CSS3 + 原生 JavaScript（无框架依赖）
- **可视化库**：Leaflet（地图）、ECharts（关系图）
- **地图底图**：CartoDB 浅色瓦片（`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`）
- **字体图标**：Font Awesome 6
- **AI 接口**：可选接入 DeepSeek API（本地知识库优先）
- **数据存储**：纯 JavaScript 对象数组（`data.js`、`knowledge-base.js`）

---

## 目录结构

```
项目根目录/
├── index.html               # 首页（导航入口 + 简介）
├── map.html                 # 时空足迹页面
├── network.html             # 人物关系网络页面
├── timeline.html            # 大事件年历页面
├── css/
│   └── style.css            # 全局样式（含所有页面的样式定义）
├── js/
│   ├── data.js              # 核心数据：地点、事件、人物、关系
│   ├── map.js               # 地图初始化、标记点、侧边栏交互
│   ├── network.js           # 关系网图表（ECharts）
│   ├── timeline.js          # 时间轴渲染、筛选、原文展示
│   ├── ai-chat.js           # 悬浮球 + 知识库检索 + DeepSeek API 调用
│   └── config.js            # （需自行创建）API 密钥配置文件
├── knowledge-base.js        # AI 问答专用轻量级知识库（与 data.js 独立）
└── README.md                # 本说明文档
```

> 注：`config.js` 和 `config.js.example` 未随源码提供，请参考下方 **API 密钥配置** 章节自行创建。

---

## 数据文件说明

### 1. `data.js` – 核心数据

- **地点 (`locations`)**：每个地点包含名称、经纬度、类型（重大事件/长期居住/途经）、描述，共 16 个关键地点。
- **事件 (`eventsData`)**：每个事件包含名称、类别数组（`categories`）、起止年份、重要性、简述、发生地、原文摘录（`event_text`），共 20 个历史事件。
- **人物 (`persons`)**：每位人物包含姓名、角色类型（center / china_friend / foreign_friend / opponent / other）、简介、原文摘录，共 21 位。
- **关系 (`relations`)**：人物之间的连线，每条包含源、目标、关系描述，共 20 条。

### 2. `knowledge-base.js` – AI 问答知识库

- 独立于 `data.js`，专供 AI 助手快速检索。结构包含 `persons`、`events`、`locations`、`works`、`quotes` 五部分。
- 内容较 `data.js` 更精炼，并额外增加了斯诺著作和经典语录。
- 当用户提问时，优先在此知识库中匹配关键词；若匹配到则直接返回，否则才请求 DeepSeek API。

### 3. `config.js` – API 密钥配置（需用户自行创建）

```javascript
// 示例内容（真实使用时请替换为有效密钥）
window.DEEPSEEK_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxx';
window.API_URL = 'https://api.deepseek.com/v1/chat/completions';
```

> 若未创建此文件，AI 助手仍可回答知识库内的问题，但调用 API 时会提示配置缺失。

---

## 功能模块详解

### 一、首页（index.html）

- **英雄区**：展示斯诺肖像、标题和一句引言。
- **数据库说明卡片**：统计地点、事件、人物数量，说明数据来源。
- **三个入口卡片**：点击跳转到地图、关系网、时间轴页面。
- **悬浮 AI 助手**：全局浮动球，点击后可与斯诺专家问答。

### 二、时空足迹（map.html）

- **Leaflet 交互地图**：
  - 红色标记 = 重大事件地，蓝色 = 长期居住地，绿色 = 途经/旅行地。
  - 点击标记弹出信息窗，显示地点描述和关联事件列表，并提供“查看时间轴”按钮。
- **右侧边栏**：列出所有重要事件，点击事件可跳转到时间轴并定位到该事件发生地。
- **图例**：位于地图下方，说明颜色代表含义。

### 三、人物关系网（network.html）

- **ECharts 力导向图**：节点大小代表影响力（斯诺节点最大），连线表示采访、友谊、合作、对峙等关系。
- **颜色分组**：
  - 深绿：中心人物（斯诺）
  - 砖红：中共友人 / 革命领袖
  - 灰蓝：外国友人 / 合作者
  - 橙色：政治对手 / 批评对象
  - 米色：其他
- **筛选下拉框**：可按角色类型筛选显示节点，斯诺始终保留。
- **交互**：悬停节点显示简介，点击节点弹出该人物的原文摘录（模态框）。

### 四、大事件年历（timeline.html）

- **竖屏时间轴**：左侧竖线，事件卡片按时间排序。
- **多类别筛选**：顶部按钮可筛选“政治事件”“战争”“社会运动”等类别（基于事件的 `categories` 数组，支持多标签）。
- **原文展示**：每个事件卡片下方直接显示 `event_text` 字段中的原文摘录，超出 180px 高度可滚动阅读。
- **地图跳转**：每个卡片配有“查看地图”按钮，点击后跳转到地图页并高亮该事件对应的地点。

### 五、AI 智能助手（悬浮球）

- **悬浮球**：固定在屏幕右下角，点击展开聊天窗口。
- **优先本地知识库**：首先在 `knowledge-base.js` 中匹配人物、事件、地点、著作、语录的关键词。
- **备选 API**：若知识库无匹配且已配置 DeepSeek 密钥，则发送知识库摘要作为上下文请求 DeepSeek 模型回答。
- **安全提示**：未配置密钥时仅使用本地知识库，并给出配置引导。
- **界面元素**：聊天记录区域、输入框、发送按钮，支持回车发送。

---

## 如何运行项目

### 方式一：本地静态服务器（推荐）

由于项目使用了 ES6 模块和外部库，直接用浏览器打开 HTML 文件可能会出现 CORS 问题（地图瓦片通常不受影响，但部分功能如 `fetch` 请求需在服务器环境运行）。建议使用简单的 HTTP 服务器：

**Node.js**：
```bash
npx serve .
# 或
npx http-server .
```

**Python**：
```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/index.html`。

### 方式二：直接打开（仅浏览基础功能）

用浏览器直接打开 `index.html`，地图和 AI 助手可能受跨域限制，但数据展示和静态关系图仍可工作。

---

## API 密钥配置（DeepSeek）

若希望 AI 助手能够回答知识库之外的问题，请按以下步骤配置：

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号并申请 API Key。
2. 在项目根目录的 `js/` 文件夹下创建 `config.js` 文件。
3. 写入以下内容（替换 `your-key` 为真实密钥）：
   ```javascript
   window.DEEPSEEK_API_KEY = 'sk-your-actual-api-key';
   window.API_URL = 'https://api.deepseek.com/v1/chat/completions';
   ```
4. 确保每个 HTML 页面在 `<script src="js/ai-chat.js"></script>` **之前** 引入了 `js/config.js`。

> **安全提示**：`config.js` 不应提交到公开代码仓库。建议在 `.gitignore` 中添加 `js/config.js`。团队成员可根据 `config.js.example` 模板自行创建。

---

## 自定义与扩展指南

### 添加新地点

1. 在 `data.js` 的 `locations` 数组中追加新对象，格式：
   ```javascript
   { id: "Lxxx", name: "地名", lat: 纬度, lng: 经度, type: "重大事件/长期居住/途经", desc: "简短描述" }
   ```
2. 如果需要在地图上显示不同类型颜色，请确保 `type` 值与 `map.js` 中的 `getColor` 函数逻辑一致。

### 添加新事件

1. 在 `eventsData` 数组中追加对象，格式：
   ```javascript
   { name: "事件名", categories: ["类别1","类别2"], start: "YYYY-MM-DD", importance: "极高/高/中/低", desc: "简述", location: "地点名", event_text: "原文摘录" }
   ```
2. 若不希望显示原文，可将 `event_text` 留空（`""`）。
3. 新事件会自动出现在时间轴中，并根据 `categories` 出现在对应筛选按钮下。

### 添加新人物与关系

1. 在 `persons` 数组中追加，格式：
   ```javascript
   { name: "姓名", type: "center/china_friend/foreign_friend/opponent/other", bio: "简介", colorGroup: "同上", original_text: "原文" }
   ```
2. 在 `relations` 数组中追加：
   ```javascript
   { source: "人名A", target: "人名B", relation: "关系描述" }
   ```
3. 关系图会自动更新节点和连线。

### 扩充 AI 知识库

- 编辑 `knowledge-base.js`，在对应的 `persons`、`events`、`locations`、`works`、`quotes` 对象中添加条目。
- 知识库中已有的内容会被优先检索，因此建议将与书籍直接相关的核心事实放在知识库中，而非让 AI 每次调用 API。

### 修改样式

所有样式集中在 `css/style.css` 中，采用 BEM 思想。主要颜色变量为：
- 主色调：`#b32d2d`（深红色）
- 背景色：`#f8f8f8`、`#ffffff`
- 字体：Georgia, Times New Roman 系列

修改时请注意移动端响应式适配（`@media (max-width: 900px)`）。

---

## 常见问题

### 1. 地图不显示或报错 “Leaflet 未加载”
- 检查网络是否能够访问 `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css` 和 `leaflet.js`。
- 若处于离线环境，请下载 Leaflet 到本地并修改引用路径。

### 2. 关系网显示空白
- 确认 `echarts` 库已成功加载（控制台无报错）。
- 检查 `data.js` 中的 `persons` 和 `relations` 数组是否非空。

### 3. AI 助手显示 “knowledgeBase is not defined”
- 确保 `knowledge-base.js` 在 `ai-chat.js` 之前加载。
- 检查 `knowledge-base.js` 中是否正确定义了 `const knowledgeBase = {...}`。

### 4. API 调用失败 / 密钥无效
- 请确认 `config.js` 存在且密钥有效。
- 检查 DeepSeek 账户余额是否充足（新用户通常有赠送额度）。
- 可暂时使用仅知识库模式（删除或注释 `config.js` 中的密钥，AI 会自动降级）。

### 5. 时间轴原文字段过长影响排版
- 已通过 CSS 限制最大高度 `max-height: 180px` 和滚动条，可自行调整 `original-content` 样式。

---

## 数据来源与版权声明

- **核心数据**：基于埃德加·斯诺著作《我在旧中国十三年》（三联书店 1973 年版）及《复始之旅》整理。
- **原文摘录**：部分段落系从上述书籍中摘录，仅用于学术展示与研究。
- **地图瓦片**：© CartoDB & OpenStreetMap 贡献者，遵循 ODbL 许可。
- **肖像图片**：来自 Wikimedia Commons，遵循 CC BY-SA 协议。

本项目为课程/研究作品，不用于任何商业目的。

---

## 贡献与联系方式

项目由 **[出版融合课程-埃德加·斯诺名人数据库小组]** 开发维护。如有疑问或建议，欢迎通过 [2501211829@stu.pku.edu.cn] 联系。

**项目主页**：[[GitHub 仓库链接](https://github.com/parLeaf/snow.webdata/tree/main)]

---

**版本**：1.0  
**最后更新**：2026 年 5 月 31 日
