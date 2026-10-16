# 第二章 · JavaScript 02：事件与 DOM

> UI 测试天天点界面，但事件和 DOM 的底层规则很少单独练。

## 为什么先学这个

测试平台以 UI 测试为主。点击、输入、断言元素出现，底层全是事件和 DOM。`querySelectorAll` 返回的不是数组、`addEventListener` 第三个参数是捕获还是冒泡，这些搞错了，用例会莫名其妙失败。

## `querySelectorAll` 返回 NodeList，不是数组

```js
const divs = document.querySelectorAll("div");
console.log(Array.isArray(divs)); // false
console.log(typeof divs.forEach); // function
console.log(typeof divs.map);     // undefined
```

`NodeList` 有 `forEach`，但没有 `map`、`filter`、`reduce`。要当数组用，先转：

```js
const arr = Array.from(divs);
// 或
const arr2 = [...divs];
```

如果你习惯写 `divs.map(...)`，第一次报错第二次就记得住了。

## 捕获与冒泡

事件触发时，浏览器先从外往里走（捕获），再从里往外走（冒泡）。

```js
el.addEventListener("click", fn, true);  // 捕获阶段执行
el.addEventListener("click", fn, false); // 冒泡阶段执行（默认）
```

第三个参数 `true` 表示捕获。捕获/冒泡的规则在诊断地图的那道题里也用到了。

捕获和冒泡的顺序：

```text
外层捕获 -> 内层捕获 -> 内层冒泡 -> 外层冒泡
```

先捕获，后冒泡。同一个元素上如果同时绑了捕获和冒泡，按注册顺序执行。

## 事件委托

冒泡的实战用途：不在每个子元素上绑事件，而是绑在父元素上，通过 `event.target` 判断是哪个子元素。

```js
list.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log("点了按钮", e.target.textContent);
  }
});
```

动态新增的子元素不需要重新绑事件，这是委托最大的好处。你的测试平台里动态生成的步骤列表，适合这么处理。

## `target` 与 `currentTarget`

- `event.target`：事件真正发生在哪个元素上。
- `event.currentTarget`：事件监听器绑在哪个元素上。

委托场景下，这两个通常不一样。

```js
list.addEventListener("click", (e) => {
  console.log(e.target === e.currentTarget); // 点 list 本身是 true，点 list 里的按钮是 false
});
```

## `preventDefault` 与 `stopPropagation`

- `preventDefault()`：阻止默认行为。比如点击链接不跳转，提交表单不发请求。
- `stopPropagation()`：阻止事件继续冒泡或捕获。

不要混。UI 测试里常见错误：点了按钮页面刷新，是因为没阻止默认提交。

## 坑

- `querySelectorAll` 是静态的。DOM 变了，旧的 `NodeList` 不会自动更新，要重新查询。
- `addEventListener` 第三个参数 `true` 是捕获，不是"更优先"。
- 事件委托里，`e.target` 可能是最深层的那个元素，不一定是你要的那个标签。用 `closest` 更稳：
  ```js
  const btn = e.target.closest("button");
  if (btn) { ... }
  ```

## 练习

手写。

**Q1.** 写一个 `toArray(nodeList)`，把 `NodeList` 转成数组。

验收：

```js
const fake = { 0: "a", 1: "b", length: 2, forEach: Array.prototype.forEach };
console.log(Array.isArray(toArray(fake))); // true
console.log(toArray(fake).length);          // 2
```

提示：不要依赖 DOM，用 `Array.from` 或展开运算符都可以。

**Q2.** 写一个 `delegate(parent, selector, event, callback)`，事件委托函数。当 `parent` 内部的 `selector` 元素触发 `event` 时，执行 `callback`。

验收（在浏览器控制台或 Node 里写个伪 parent 对象测试）：

```js
const parent = /* 你的 DOM 或 mock 对象 */;
delegate(parent, "button", "click", (el, e) => {
  console.log("命中", el);
});
// 模拟点击 parent 内部一个 button，callback 应该被执行
```

提示：绑在 `parent` 上，通过 `e.target.closest(selector)` 判断。

**Q3.** 写出下面这段代码的点击输出顺序。外层 div 叫 `outer`，内层 div 叫 `inner`。

```js
outer.addEventListener("click", () => console.log("outer 冒泡"), false);
outer.addEventListener("click", () => console.log("outer 捕获"), true);
inner.addEventListener("click", () => console.log("inner 冒泡"), false);
inner.addEventListener("click", () => console.log("inner 捕获"), true);
```

提示：先捕获，后冒泡。同一元素上按注册顺序。

---

## 答案（先做完再看）

<details>
<summary>Q1 验收要点</summary>

- 用 `Array.from(nodeList)` 转换。展开运算符 `[...nodeList]` 也可以，但 `Array.from` 对伪数组对象更稳。
- 返回的必须是真数组（`Array.isArray` 为 true）。

</details>

<details>
<summary>Q2 验收要点</summary>

- 事件监听器绑在 `parent` 上，不是每个子元素。
- 在回调里用 `e.target.closest(selector)` 找到真正匹配的元素。
- 不要只判断 `e.target` 本身，因为点击可能落在子元素上。
- 找到匹配元素后再调用 `callback(el, e)`。

</details>

<details>
<summary>Q3 答案</summary>

```text
outer 捕获
inner 捕获
inner 冒泡
outer 冒泡
```

先走捕获链（outer → inner），再走冒泡链（inner → outer）。

</details>

写完整份放进 `作答/02/js-02.md`。

下一节：[手写三件](./js-03-手写三件.md)。
