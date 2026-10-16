# 第三章 · JavaScript 10：JSON 与序列化

> 配置、报告、测试数据，最后都要变成字符串存起来。JSON 不是万能的。

## JSON.stringify 会丢什么

```js
const obj = {
  a: 1,
  b: undefined,
  c: function () {},
  d: Symbol("x"),
  e: new Date(),
  f: /abc/,
};

console.log(JSON.stringify(obj));
// {"a":1,"e":"2026-10-16T...","f":{}}
```

丢掉的有：`undefined`、函数、Symbol。Date 变成 ISO 字符串，RegExp 变成空对象。

## 深拷贝的快捷方式

```js
const clone = JSON.parse(JSON.stringify(obj));
```

适合普通对象和数组，但会丢上面那些东西。平台配置里一般没有函数和 Symbol，够用。但要知道边界。

## 平台报告的例子

```js
const report = {
  passed: 10,
  failed: 2,
  cases: [
    { name: "打开页面", status: "pass" },
    { name: "点击录音", status: "fail", error: new Error("超时") },
  ],
};

console.log(JSON.stringify(report, null, 2));
```

如果 `error` 是 Error 实例，`JSON.stringify` 后变成 `{}`。报告里要看错误信息，得自己处理：

```js
function replacer(key, value) {
  if (value instanceof Error) {
    return { message: value.message, stack: value.stack };
  }
  return value;
}

JSON.stringify(report, replacer, 2);
```

## 反序列化要小心

```js
const data = '{"a":1,"b":"hello"}';
const parsed = JSON.parse(data);

console.log(parsed.a); // 1
console.log(parsed.b); // "hello"
```

数字还是数字，字符串还是字符串。但如果是 `"2026-10-16"`，不会自动得到 Date 对象，它仍然是字符串。

## 坑

- `JSON.stringify(undefined)` 返回 `undefined`，不是字符串 `"undefined"`。
- 循环引用会报错。
- 不要用 `JSON.stringify` 做对象相等比较，键顺序不同结果可能不同。

## 练习

手写。

**Q1.** 写一个 `safeStringify(obj)`，能处理 Error 对象，其他保持默认行为。

验收：

```js
const obj = {
  name: "测试",
  err: new Error("失败"),
};

const str = safeStringify(obj);
console.log(str.includes("失败")); // true
console.log(str.includes("测试")); // true
```

**Q2.** 写一个 `deepClone(obj)`，用 JSON 方法实现。然后写一个测试，证明函数属性会丢失。

验收：

```js
const a = { x: 1, fn() { return 2; } };
const b = deepClone(a);

console.log(b.x); // 1
console.log(typeof b.fn); // undefined
```

**Q3.** 写出下面代码的输出。

```js
console.log(JSON.stringify(undefined));
console.log(JSON.stringify({ a: undefined, b: null }));
console.log(JSON.stringify([1, undefined, 2]));
```

---

## 答案（先做完再看）

<details>
<summary>Q1 验收要点</summary>

- `JSON.stringify` 的第二个参数是 replacer 函数。
- 在 replacer 里判断 `value instanceof Error`，把 Error 转成包含 `message` 和 `stack` 的普通对象再返回。
- 其他值保持原样返回。

</details>

<details>
<summary>Q2 验收要点</summary>

- 用 `JSON.parse(JSON.stringify(obj))` 做深拷贝。
- 普通对象和数组会被完整复制。
- 函数、`undefined`、Symbol 等会被 JSON 丢弃，所以 `typeof b.fn` 是 `undefined`。

</details>

<details>
<summary>Q3 答案</summary>

```js
undefined
{"b":null}
[1,null,2]
```

- 对象里的 `undefined` 被忽略。
- `null` 会保留。
- 数组里的 `undefined` 变成 `null`。

</details>

写完整份放进 `作答/03/js-10.md`。

下一节：[正则基础](./js-11-正则基础.md)。
