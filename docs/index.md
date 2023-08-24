---
home: true
heroText: 编码规范
tagline: 前端编码规范工程化
actionText: 立刻进入 →
actionLink: /coding/html.md

features:
    - title: 完善的规范生态
      details: 支持对全部前端配置实现一键接入、一键扫描、一键修复、一键升级
    - title: 支持 Typescript
      details: 提供完整的类型注释，帮助您从 0~1 掌握完整的前端规范化
    - title: 完整的测试用例
      details: 配套完整的测试用例，帮助您提升项目健壮性
---
## 🛋 配套工具

我们引入了多个业界流行的 `Linter` 作为规约文档的配套工具，并根据规约内容定制了对应的规则包，它们包括：

| 规约                                                       | Lint 工具                                               | NPM包                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| JavaScript 编码规范 ``TypeScript 编码规范 `` Node 编码规范 | [ESLint](https://eslint.org/)                              | [cd-eslint-config](https://www.npmjs.com/package/cd-eslint-config)             |
| CSS 编码规范                                               | [stylelint](https://stylelint.io/)                         | [cd-stylelint-config](https://www.npmjs.com/package/cd-stylelint-config)       |
| Git 规范                                                   | [commitlint](https://commitlint.js.org/#/)                 | [cd-commitlint-config](https://www.npmjs.com/package/cd-commitlint-config)     |
| 文档规范                                                   | [markdownlint](https://github.com/DavidAnson/markdownlint) | [cd-markdownlint-config](https://www.npmjs.com/package/cd-markdownlint-config) |

[cd-spec-cli](https://www.npmjs.com/package/cd-fe-lint) 收敛屏蔽了上述依赖和配置细节，提供简单的 `CLI` 和 `Node.js API`，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规约的成本。

您可以使用[cd-spec-cli](https://www.npmjs.com/package/cd-fe-lint) 方便地为项目接入全部规范。

</br>

## ✉️ 联系

**GitHub**: [https://github.com/chendie-dev/cd-spec](https://github.com/chendie-dev/cd-spec)

</br>
