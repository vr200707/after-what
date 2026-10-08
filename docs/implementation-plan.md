# 《以后呢》Implementation Plan / 实施计划

执行方式 / Execution: native, in this session. User authorized implementation and GitHub deployment.

Goal: Deliver a complete, maintainable static team story board on GitHub Pages.
Architecture: plain HTML/CSS/JS; one JSON content source; native dialog; no runtime third-party dependencies.
Spec: docs/design.md

## Constraints / 约束
- Preserve story content and uncertainty; no invented protagonist, ending, war, or civilization motives.
- Chinese story text with bilingual interface labels; supplied English terms preserved.
- Sources directory and supplied attachment remain read-only.
- Deploy only site/; no attachments or local paths in public output.

## Tasks / 任务
1. Write meaningful failing tests for computed statistics, full-text search, combined question filters, and data integrity. Implement data and pure model functions; run tests.
2. Implement responsive board, five-stage timeline, detailed dialog, scene/concepts/social/undefined views, searchable content and categorized question list. Include no-results, fetch-error, keyboard/focus, and mobile states.
3. Add local server, bilingual README, and GitHub Pages deployment workflow. Verify syntax, data integrity, and full suite. Inspect desktop/mobile and interactions in a real browser.
4. Create dedicated GitHub repository, push verified files, enable Pages, wait for deployment, verify public content and asset paths, and provide website/repository links.

## Review focus / 重点检查
- Whitespace search and unknown keywords: correct all-results and empty states.
- Multi-category questions: combined text/category filters and accurate counts.
- Modal keyboard/focus: Escape, close button, source link, focus return.
- Mobile and 200% text: no clipped content or unintended page overflow.
- Repository-relative assets: live data and JS load under /after-what/.
