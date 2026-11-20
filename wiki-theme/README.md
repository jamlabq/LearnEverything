# 本站 Wiki 的展示资源

`overrides/` 为本站页头、署名与静态上游来源链接；`assets/mirror.css` 和 `math-config.js` 为本站样式和公式配置。搜索、导航与代码展示由固定版本的 MkDocs Material 构建，使用系统字体。

- Material for MkDocs 9.6.23：MIT；完整许可见 `assets/material-LICENSE.txt`。构建依赖版本在根 `requirements-wikis.txt` 中。
- MathJax 3.2.2：Apache-2.0；`assets/mathjax/` 保留完整 ES5 分发包（字体、扩展及源映射），许可见其中 `LICENSE`，下载来源及包 SHA-256 见 `SOURCE.json`。
- `external-images/manifest.json` 记录补存图片的原地址、使用页和文件 SHA-256。英文工作流的旧图床图片以同一上游文章中文版对应位置的图片恢复，清单的 `replacement_from` 记录替换来源；图片的原作者权利与原文许可继续适用。

这些文件随仓库保存。正常构建只读取本地资源；页面无原站统计、评论、反馈服务或 GitHub 实时统计 API 请求。
