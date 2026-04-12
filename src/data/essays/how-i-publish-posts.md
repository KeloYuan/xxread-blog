---
title: 我现在怎么发这类博客文章
description: 这篇文章记录这个博客当前的发文方式：直接写 Markdown，提交后生成静态网页。
pubDatetime: 2026-04-12T14:35:00Z
tags:
  - Markdown
  - 博客
  - 工作流
---

这个博客的文章是直接用 Markdown 管理的。

每篇文章都放在 `src/data/essays/` 目录下，一个文件就是一篇文章。

最小可用格式大概是这样：

```md
---
title: 文章标题
description: 一句话摘要
pubDatetime: 2026-04-12T14:35:00Z
tags:
  - 标签一
  - 标签二
---

这里开始写正文。
```

## 为什么用这种方式

因为它足够简单：

- 可以直接在本地写
- 用 Obsidian、VS Code、Typora 都行
- 内容和样式分开
- 发布后就是静态页面，打开很快

## 后面怎么继续

接下来只要继续往这个目录里加新的 Markdown 文件，这个博客就能持续更新下去。
