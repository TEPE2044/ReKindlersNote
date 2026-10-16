# 第四章 · 平台实战 01：Playwright 基础

> 第四章开始。你的主武器不是 JS 语法，是 Playwright。

## 为什么现在学

第一章到第三章补的是读懂代码的底子。第四章开始，所有练习都挂在 `xinhuo_test_platform` 的真实场景上。很多人用 Playwright 只到"能跑起来"，这里补的是改 AI 代码时要看懂的点。

## 最小可跑结构

```js
// example.spec.js
import { test, expect } from "@playwright/test";

test("打开首页", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page.locator("h1")).toHaveText("Example Domain");
});
```

- `test` 和 `expect` 从 `@playwright/test` 导入。
- 测试函数是 `async`，因为所有页面操作都返回 Promise。
- `page.locator("h1")` 不立即查 DOM，只有 `expect` 或 `click` 时才真正执行。

## locator 优先用角色和文本

不要优先用 CSS 选择器，特别是自动生成的 class。

```js
// 不好
await page.locator(".btn-primary").click();

// 好
await page.getByRole("button", { name: "录音" }).click();
await page.getByText("开始录制").click();
```

角色和文本更接近用户怎么理解界面。class 一变测试就挂。

## expect 自动重试

```js
await expect(page.getByText("保存成功")).toBeVisible();
```

Playwright 的 `expect` 默认会重试到超时（默认 5 秒）。不是睡 5 秒，是轮询。所以不要自己写 `setTimeout` 等。

## 截图和 trace

```js
// playwright.config.js
module.exports = {
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
};
```

失败时自动截图和录 trace。trace 是 Playwright 最强调试工具，失败后在浏览器里看每一步的 DOM 和请求。

## 基本动作链

```js
await page.goto("/record");
await page.getByRole("button", { name: "开始录音" }).click();
await page.getByRole("textbox").fill("测试音频");
await page.getByRole("button", { name: "保存" }).click();

await expect(page.getByText("已保存")).toBeVisible();
```

每一步都要 `await`。漏一个 `await`，动作不会按顺序执行。

## 坑

- `page.locator` 返回的 locator 是**惰性**的，每次使用都会重新查找元素。可以复用，但要知道它不是在创建那一刻就绑定到某个 DOM 节点上。
- `await page.click("...")` 是老写法，建议用 `locator.click()`。
- 弹窗、上传文件、拖拽有专门 API，不要自己模拟鼠标事件。
- 测试文件默认并行执行，不要假设用例之间的顺序。

## 练习

手写。

**Q1.** 写一段 Playwright 测试，打开 `https://example.com`，点击 "More information..." 链接，断言新页面 URL 包含 `iana.org`。

验收：运行 `npx playwright test` 后，输出中出现 `1 passed`。

提示：点击用 `getByText`，URL 断言用 `toHaveURL`，它支持正则。

**Q2.** 解释下面两行区别。

```js
await page.locator("button").click();
await page.locator("button").first().click();
```

**Q3.** 在 `playwright.config.js` 里打开 trace 和截图，然后故意让一个测试失败，运行 `npx playwright show-report` 看结果。

---

## 答案（先做完再看）

<details>
<summary>Q1 验收要点</summary>

- 导入 `test` 和 `expect`。
- 用 `page.goto` 打开页面。
- 用 `getByText` 定位链接并点击。
- 用 `expect(page).toHaveURL(/iana\.org/)` 断言 URL，`toHaveURL` 支持正则。
- 点击后页面导航是异步的，`expect` 会自动等待。

</details>

<details>
<summary>Q2 答案</summary>

- `page.locator("button").click()`：如果页面上有多个 button，会抛错 "strict mode violation"。
- `.first()`：只取第一个，能过，但可能点错按钮。

正确做法是 `getByRole("button", { name: "录音" })`。

</details>

<details>
<summary>Q3 验收要点</summary>

- 在 `playwright.config.js` 的 `use` 里打开两项：`screenshot: "only-on-failure"` 和 `trace: "retain-on-failure"`。
- 失败后在 `playwright-report/` 或 `test-results/` 里能看到截图和 trace。
- `npx playwright show-report` 用浏览器打开报告。

</details>

写完整份放进 `作答/04/pf-01.md`。

下一节：[用例组织是树](./pf-02-用例组织是树.md)。
