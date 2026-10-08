# 《以后呢》 / After What

团队共享查看的科幻短片世界观与故事线开发面板。纯静态 HTML、CSS 和 JavaScript；故事内容集中在 JSON 中；没有后端、登录或外部运行时 API。

A shared science-fiction story and worldbuilding development board. Plain static HTML, CSS, and JavaScript; centralized JSON story data; no backend, login, or external runtime APIs.

## 本地运行 / Run locally

需要 Node.js 22 或更新版本。网站运行本身不需要安装任何依赖。

Requires Node.js 22 or newer. The website itself needs no dependency installation.

```sh
npm start
```

打开 / Open: http://127.0.0.1:4173

也可以将 `site/` 交给任意静态 HTTP 服务器。不要直接双击 HTML 文件：浏览器通常禁止 `file://` 页面读取 JSON。

You may serve `site/` using any static HTTP server. Do not double-click the HTML file: browsers normally block JSON fetching from `file://` pages.

## 修改内容 / Edit content

只需修改 `site/data/story.json`，然后提交到 GitHub。页面从数据自动生成条目、问题清单及统计。网站供团队共同查看；没有多人实时编辑、评论或自动保存讨论。

Edit `site/data/story.json`, then commit to GitHub. Entries, open questions, and statistics derive from this data. The board supports shared viewing, without realtime collaborative editing, comments, or automatic discussion storage.

- `project`：标题、核心设定、关键问题和方向总结。 / Title, core premise, key question, and story direction.
- `entries`：时间节点、场景、概念、社会设想、待定义条目。 / Timeline stages, scenes, concepts, social possibilities, and undefined records.
- `claims`：条目内的具体设定陈述与各自状态。 / Claims within each entry, with independent statuses.
- `blocks`：段落、强调、列表、逻辑链。 / Paragraph, emphasis, list, and flow blocks.
- `questions`：统一问题库，支持多个类别和关联条目。 / Centralized questions with multiple categories and source entries.
- `categories`、`statusDefinitions`：双语分类与状态标签。 / Bilingual categories and status labels.

新增条目必须有唯一 `id`；所有 `questionIds` 与 `relatedEntryIds` 必须指向现有记录。`status` 仅使用 `confirmed`、`tentative`、`open`。`sourceStatus` 保留“已确定方向”等原文细分；`definitionState: "undefined"` 独立表示待定义。仅时间线条目使用 `order`。

Every entry needs a unique `id`; question and entry references must resolve. Status values are `confirmed`, `tentative`, and `open`. `sourceStatus` preserves nuances such as confirmed direction; `definitionState: "undefined"` independently marks undefined concepts. Only timeline entries have an `order`.

条目“暂定”和“待讨论”不代表已确定剧情。狗和骨头场景原文未指定状态，统计归入待讨论并明确显示状态未指定；最优解原文未指定条目状态，界面归为暂定哲学讨论。问题清单保留原文的问题，即使附近已给出方向；逻辑张力仅新增问题，不修正设定。

Tentative and open records are not confirmed plot. The original Dog & Bone scene has no specified status; it is counted as open and visibly marked unassigned. The optimal-solution record has no original entry status and is presented as tentative philosophical discussion. Questions remain open even when surrounding notes offer a direction. Tensions are questions, not changes to the story.

项目标题与原先待定义部分均已更名《以后呢》。这个名字不附带任何自行补充的世界观解释。数据没有主角、结局、战争或高维文明动机的新增答案。

Both the project and the formerly named undefined concept are now 《以后呢》. The name carries no invented worldbuilding definition. No protagonist, ending, war, or civilization motive has been added.

## GitHub Pages 部署 / Deploy to GitHub Pages

1. 将整个项目推送到仓库的 `main` 分支。 / Push this project to a repository's `main` branch.
2. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。 / Select **GitHub Actions** as the publishing source in repository Settings → Pages.
3. `.github/workflows/pages.yml` 检查代码后，只发布 `site/`。后续推送到 `main` 自动更新。 / The workflow checks code and publishes only `site/`. Later pushes to `main` redeploy automatically.

所有资源使用相对路径，兼容 `https://用户名.github.io/仓库名/`。公开 Pages 可凭链接访问，无登录；不是访问受限的团队空间。

Relative asset paths support `https://username.github.io/repository/`. Public Pages can be accessed without login; it is not an access-controlled team workspace.

## Vercel / Netlify

连接仓库，选择静态项目：构建命令留空，输出/发布目录填 `site`。Netlify 可直接上传 `site/`。不需要框架或服务器端函数。

Connect the repository as a static project: leave the build command empty and set the output/publish directory to `site`. Netlify also supports uploading `site/` directly. No framework or server functions are required.

## 验证 / Verification

```sh
npm run check
```

先运行 `npm ci` 安装仅供验证使用的依赖，再执行检查。检查 JavaScript 语法、动态统计、全文搜索、组合问题筛选、实际数据引用，以及离线 DOM 中所有条目按钮的弹窗与关闭、焦点返回、空结果和定位链接。无构建或编译步骤，浏览器直接运行静态源文件。

First run `npm ci` to install development-only verification dependencies. Checks syntax, computed statistics, full-text search, combined question filters, valid references, and offline DOM record dialogs, closing, focus restoration, empty states, and anchors. No build or compilation step is needed; browsers run the static source directly.

## 项目结构 / Project structure

```text
site/
  index.html
  data/story.json
  assets/app.js
  assets/model.js
  assets/style.css
  assets/favicon.svg
tests/                 # automated checks / 自动检查
docs/                  # design and plan / 设计与实施说明
.github/workflows/     # Pages deployment / Pages 发布
server.mjs             # local server / 本地服务器
```

实际浏览器预览在本次环境中被安全检查阻止，因此真实浏览器桌面、手机尺寸与视觉表现尚未验证；离线 DOM 测试不能替代这些检查。响应式样式包含桌面五列横向时间线和手机单列纵向时间线。

Real-browser preview was blocked by an unavailable security check in this environment; desktop/mobile visual rendering remains unverified. Offline DOM tests do not replace those checks. Responsive styles define five-column horizontal desktop and single-column vertical mobile timelines.
