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

只需修改 `site/data/story.json`，然后提交到 GitHub。页面从数据自动生成条目、问题清单及统计。网站供团队共同查看；支持当前浏览器的本地问题草稿编辑，不提供多人实时同步或评论。

Edit `site/data/story.json`, then commit to GitHub. Entries, open questions, and statistics derive from this data. The board supports shared viewing and browser-local question drafts, without realtime collaborative synchronization or comments.

- `project`：标题、核心设定、关键问题和方向总结。 / Title, core premise, key question, and story direction.
- `entries`：时间节点、场景、概念、社会设想、待定义条目。 / Timeline stages, scenes, concepts, social possibilities, and undefined records.
- `claims`：条目内的具体设定陈述与各自状态。 / Claims within each entry, with independent statuses.
- `blocks`：段落、强调、列表、逻辑链。 / Paragraph, emphasis, list, and flow blocks.
- `questions`：统一问题库，支持多个类别和关联条目。 / Centralized questions with multiple categories and source entries.
- `categories`、`statusDefinitions`：双语分类与状态标签。 / Bilingual categories and status labels.

新增条目必须有唯一 `id`；所有 `questionIds` 与 `relatedEntryIds` 必须指向现有记录。`status` 仅使用 `confirmed`、`tentative`、`open`。`sourceStatus` 保留“已确定方向”等原文细分；`definitionState: "undefined"` 独立表示待定义。仅时间线条目使用 `order`。

Every entry needs a unique `id`; question and entry references must resolve. Status values are `confirmed`, `tentative`, and `open`. `sourceStatus` preserves nuances such as confirmed direction; `definitionState: "undefined"` independently marks undefined concepts. Only timeline entries have an `order`.

条目“暂定”和“待讨论”不代表已确定剧情。狗和骨头场景原文未指定状态，统计归入待讨论并明确显示状态未指定；最优解原文未指定条目状态，界面归为暂定哲学讨论。问题清单仅保留“故事线讨论chat”实际讨论过的 10 个核心问题，相近提问合并；已删除打包提示词扩展的问题、额外逻辑张力和待定义部分的全部 15 个问题。每个问题的 source 字段记录聊天来源。

Tentative and open records are not confirmed plot. The original Dog & Bone scene has no specified status; it is counted as open and visibly marked unassigned. The optimal-solution record has no original entry status and is presented as tentative philosophical discussion. The list contains only 10 core questions actually discussed in 故事线讨论chat, merging related prompts. Expanded brief questions, additional tensions, and all 15 undefined-concept questions have been removed. Each question records its discussion source.

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

## 时间线 06 / Timeline stage 06

用户新增“06 云端故土”，全部待确定；不添加设定陈述或问题清单。网站标题仍为《以后呢》。

The user added “06 云端故土 / Cloud Homeland”, entirely undefined, with no claims or question list. The website remains titled 《以后呢》.

## 网页编辑问题 / Edit questions in the website

1. 打开网站的问题清单，点击“编辑问题清单”。
2. 使用“新增问题”或每个问题旁的“修改”“删除”，选择分类及关联设定，然后保存到本地草稿。
3. 草稿保存在当前浏览器的当前网站地址下。刷新仍会保留；换设备、换浏览器、换网址或清除网站数据后不会自动带过去。隐私模式也可能无法长期保存。
4. 点击“导出更新文件”，下载 `story-update.json`。将文件交给 Codex，由 Codex核对后替换 `site/data/story.json` 并重新发布；团队随后刷新原网址查看公开更新。
5. “退出编辑”只隐藏编辑按钮，仍显示你的草稿；“恢复公开版”会清除本地草稿并恢复已发布内容，需要先确认。

1. Open the question list and select Edit questions.
2. Add, modify, or delete a question; choose categories and optional linked records, then save the local draft.
3. Drafts are stored for this website address in the current browser. Refresh preserves them; another device, browser, URL, or cleared website data does not. Private browsing may not retain drafts.
4. Export `story-update.json` and give it to Codex. Codex reviews it, replaces `site/data/story.json`, and republishes; the team then refreshes the original URL.
5. Exiting edit mode hides editing controls but keeps the draft visible. Restoring the public version clears the local draft after confirmation.

不需要登录或新增后端。任何访问者都只能编辑自己浏览器里的草稿，不能通过页面修改其他人看到的公开版。导出文件包含完整故事数据和更新后的问题关联，不包含浏览器凭据。修改问题不会改写世界观或场景；云端故土与待定义部分不提供问题关联入口。若公开版的问题已更新，页面会提醒你核对旧草稿；导出不是发布。

No login or new backend is required. Each visitor can edit only their browser-local draft, never the public version through this page. Export includes the complete story and updated question links, without browser credentials. Question editing does not rewrite worldbuilding or scenes. Undefined sections are excluded from question linking. If the published questions changed, the page flags the older draft for review. Exporting is not publishing.
