# 第三章 · JavaScript 06：ES6 只补三处

> ES6 内容很多，这里只补三处真正会错的。

## 第一处：展开运算符是浅拷贝

```js
const a = { x: 1, y: { z: 2 } };
const b = { ...a };

b.x = 99;
console.log(a.x); // 1，没变

b.y.z = 99;
console.log(a.y.z); // 99，变了
```

`{...obj}` 和 `Object.assign({}, obj)` 一样，只拷第一层。嵌套对象共享引用。

平台里合并配置时，顶层 key 不会串，嵌套的 key 会串。这是真实 bug 来源。

```js
function cloneTop(obj) {
  return { ...obj };
}
```

需要深拷贝时，看 `js-03` 那节的 JSON 方案，或针对具体结构手写。

## 第二处：解构默认值只在 undefined 时生效

```js
const { a = 5 } = {};
console.log(a); // 5

const { b = 5 } = { b: null };
console.log(b); // null，不是 5

const { c = 5 } = { c: undefined };
console.log(c); // 5
```

默认值只对 `undefined` 生效，`null` 不会触发。

函数参数里常用这个兜底：

```js
function f({ x = 1, y = 2 } = {}) {
  return x + y;
}

console.log(f());       // 3
console.log(f({ x: 5 })); // 7
```

`= {}` 是为了防止不传参时解构 `undefined` 报错。

## 第三处：Object.assign 和展开都能拷 Symbol 键

```js
const sym = Symbol("k");
const obj = { [sym]: 1, a: 2 };

const copy1 = { ...obj };
const copy2 = Object.assign({}, obj);

console.log(copy1[sym]); // 1
console.log(copy2[sym]); // 1
```

两者都会拷贝可枚举的 Symbol 键。但真正要记的是：它们都**只浅拷贝**。

## 坑

- 浅拷贝不是 bug 的唯一来源，嵌套对象共享引用才是。
- 解构默认值对 `null` 无效。
- `Object.assign` 会直接修改第一个参数。如果第一个参数是 `{}`，才是复制；如果是原对象，就是原地改。

## 练习

手写。

**Q1.** 写一个 `mergeDefaults(options, defaults)`，把 `defaults` 里用户没给的字段补进去。如果用户给了 `null`，不要覆盖成默认值。

验收：

```js
const defaults = { host: "localhost", port: 3000, debug: false };

console.log(mergeDefaults({}, defaults));
// { host: "localhost", port: 3000, debug: false }

console.log(mergeDefaults({ port: 8080, debug: null }, defaults));
// { host: "localhost", port: 8080, debug: null }
```

**Q2.** 写一个 `safeClone(obj)`，只浅拷贝第一层，但保证不修改原对象。

验收：

```js
const a = { x: 1, y: { z: 2 } };
const b = safeClone(a);

b.x = 99;
console.log(a.x); // 1

b.y.z = 99;
console.log(a.y.z); // 99
```

**Q3.** 写出下面代码的输出。

```js
const { a = 1, b = 2 } = { a: null, b: undefined };
console.log(a, b);
```

---

## 答案（先做完再看）

<details>
<summary>Q1 验收要点</summary>

- 先基于 `defaults` 做一份浅拷贝。
- 遍历 `options` 的每个键：值是 `undefined` 时忽略（让默认值生效）；其他值（包括 `null`）都覆盖到结果上。
- 核心是 `undefined` 触发默认，`null` 不触发默认。

</details>

<details>
<summary>Q2 验收要点</summary>

- 用 `{ ...obj }` 或 `Object.assign({}, obj)` 实现浅拷贝。
- 原对象的顶层字段不应被修改。
- 嵌套对象共享引用是预期行为，所以修改拷贝后的嵌套对象会影响原对象。

</details>

<details>
<summary>Q3 答案</summary>

```js
null 2
```

`a` 是 `null`，默认值不生效。`b` 是 `undefined`，默认值生效为 2。

</details>

写完整份放进 `作答/03/js-06.md`。

下一节：[类型系统只补一处](./js-07-类型系统只补一处.md)。
