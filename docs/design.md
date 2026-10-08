# 《以后呢》网站设计 / After What website design

团队共享查看的静态故事开发面板。以用户提供的故事需求及聊天中已确认的信息架构为依据，不增补故事。项目名为《以后呢》，“以后呢”仍是待定义概念。

A static story-development board for shared team review, based exclusively on the supplied story brief and accepted information architecture. The project is titled 《以后呢》; “以后呢” remains an undefined story concept.

## 信息架构 / Information architecture

概览、五节点时间线、狗和骨头场景、智能人/欲望/最优解概念、后续社会设想、以后呢待定义区、问题清单。桌面横向时间线；手机纵向。详情使用原生 dialog；支持键盘关闭、返回来源、URL 定位。

Overview, five-stage timeline, Dog & Bone scene, smart-human/desire/optimal-solution concepts, later social possibilities, undefined After What concept, and open questions. Horizontal desktop timeline, vertical mobile timeline. Native dialog details with keyboard dismissal, source links, and URL anchors.

## 内容边界 / Content boundaries

所有故事文字集中在 site/data/story.json。整体状态与设定陈述状态分开；保留“已确定方向”“可能存在”和待定义标签。场景、后续社会设想不补年份或强制时间位置。逻辑张力仅列问题。页面没有多人实时编辑；修改源数据后重新部署。

All story copy lives in site/data/story.json. Entry and claim statuses are separate; preserve confirmed-direction, possible, and undefined qualifiers. Do not assign dates or narrative positions to scenes or later possibilities. List tensions as questions only. No realtime shared editing; edit source data and redeploy.

## 视觉 / Visual direction

科研档案式工作面板：#101419 背景、#171d24 面板、#293440 细线、#e6edf3 主文字、#9aa9b8 次文字、#93bddc 冷蓝、#d7ad77 暖橙。中文使用系统现代无衬线，标题使用宋体强调提问气质。真实时间顺序才用数字。让五节点认知链成为主要视觉结构，无装饰图像及自动动画。

Research-archive working surface with dark graphite, cold white, restrained blue and amber. System sans-serif body and serif Chinese title. Numbers denote actual timeline order only. The five-stage cognitive chain anchors the composition; no decorative imagery or autoplay animation.

## 数据及交互 / Data and interactions

project、entries、questions、categories、statusDefinitions。entries 包含 type、status、sourceStatus、definitionState、blocks、claims、questionIds、tags。questions 可多分类及多来源。搜索包含正文、陈述和关联问题。统计条目状态、陈述状态、开放问题，绝不计算完成百分比。使用相对 URL 以适配 GitHub Pages 仓库路径。

Project, entries, questions, categories, status definitions. Entries separate presentation blocks, claims, and question references. Multi-category/source questions. Search all text and linked questions. Count entry states, claim states, and open questions without inventing completion percentages. Relative URLs support repository-based GitHub Pages hosting.

## 2026-10-08 内容精简 / Content reduction

按用户要求，《以后呢》待定义部分的 15 个问题全部删除。全站只保留实际聊天中讨论过的 10 个核心问题，合并重复主题，删除提示词扩展和额外逻辑张力；每个问题记录来源聊天与原句。待定义区仅显示名称和待定义标签。

At the user’s request, remove all 15 undefined-concept questions. Retain only 10 core questions from the actual discussion, merging repeated themes and removing expanded-brief questions and extra tensions. Store discussion provenance per question. The undefined section shows only its name and undefined status.

## 本地问题编辑 / Local question editing

用户确认网页内新增、修改、删除问题，浏览器草稿持久保存，导出完整 story-update.json 后由 Codex 发布。公开网站不接受共享写入。编辑仅更新问题与条目反向关联；云端故土和待定义区不关联问题。支持取消删除、确认恢复公开版、存储失败提示与公开版更新后的旧草稿提醒。

The user approved browser-local question CRUD, persistent drafts, and full story-update.json export for later publication by Codex. No public shared writes. Only questions and backlinks change; undefined records are excluded. Include deletion cancellation, confirmed reset, storage failure messages, and stale-draft warnings.
