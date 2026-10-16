# 第三章 · JavaScript 05：this 与原型链

> 方法被拆出去之后，`this` 不会自动跟着走。

## 为什么先学这个

Vue 组件里写 `methods: { fn() { this.x } }`，点击时框架帮你把 `this` 绑回组件。现在写原生事件回调或 Playwright 脚本，没人帮你绑。方法当参数一传，`this` 就丢了。

## 方法被拆出去，this 就丢了

```js
const o = {
  n: 1,
  m() {
    return this.n;
  },
};

console.log(o.m()); // 1

const f = o.m;
console.log(f()); // 非严格模式返回 undefined；严格模式抛 TypeError
```

`o.m()` 是对象调用，`this` 是 `o`。`const f = o.m` 只是把函数赋值给 `f`，再调用 `f()` 时，`this` 没人指定。

本书例子默认非严格模式，所以返回 `undefined`。严格模式下，`this` 是 `undefined`，再取 `.n` 会抛 `TypeError`。

这是测试脚本里最常见的 bug：把组件方法当回调传出去，结果 `this` 没了。

## 箭头函数继承外层 this

```js
const o = {
  n: 1,
  m() {
    const fn = () => this.n;
    return fn();
  },
};

console.log(o.m()); // 1
```

箭头函数没有自己的 `this`，它继承定义时的外层 `this`。所以在 `o.m()` 里定义的箭头函数，`this` 就是 `o`。

但注意：箭头函数不能当构造函数，也不能用 `call` / `apply` / `bind` 改变它的 `this`。

## bind / call / apply

```js
function f() {
  return this.n;
}

const obj = { n: 9 };

console.log(f.call(obj));  // 9，临时调用
console.log(f.apply(obj)); // 9，临时调用

const bound = f.bind(obj);
console.log(bound()); // 9，永久绑定
```

- `call` 和 `apply`：临时指定 `this`，立即执行。
- `bind`：返回一个新函数，`this` 永久绑死。

## class 继承

```js
class A {
  hello() {
    return "A";
  }
}

class B extends A {}

const b = new B();
console.log(b.hello());       // A
console.log(b instanceof A);  // true
```

`extends` 建立的原型链是 `B -> A`。`instanceof` 沿这条链查。测试里判断一个对象是不是某类实例，就靠这个。

## 坑

- 方法当回调传之前，要么用箭头函数，要么用 `bind`，否则 `this` 会丢。
- `setTimeout(obj.m, 0)` 也会丢 `this`，因为它只拿到了函数引用。
- `bind` 过的函数再 `call` 也改不了 `this`。

## 练习

手写。

**Q1.** 写一个 `safeBind(obj, methodName)`，返回一个新函数，调用时 `this` 固定是 `obj`。

验收：

```js
const o = {
  n: 5,
  getN() { return this.n; },
};

const f = safeBind(o, "getN");
console.log(f()); // 5
```

**Q2.** 用箭头函数改写下面的 `Counter`，让 `inc` 当回调传出去时 `this` 不丢。

```js
class Counter {
  constructor() {
    this.n = 0;
  }
  inc() {
    this.n++;
  }
  get() {
    return this.n;
  }
}

const c = new Counter();
setTimeout(c.inc, 0); // 这里的 this 会丢
setTimeout(() => console.log(c.get()), 10);
```

**Q3.** 写出下面代码的输出。

```js
const obj = {
  n: 1,
  fn() {
    return (() => this.n)();
  },
};

console.log(obj.fn());

const f = obj.fn;
console.log(f());
```

---

## 答案（先做完再看）

<details>
<summary>Q1 验收要点</summary>

- 返回一个新函数。
- 新函数内部通过 `obj[methodName].apply(obj, args)` 或 `.bind(obj)` 调用原方法，确保 `this` 指向 `obj`。
- 调用时传入的参数要透传给原方法。

</details>

<details>
<summary>Q2 验收要点</summary>

- 把 `inc` 改成 class field 形式的箭头函数属性：`inc = () => { this.n++; }`。
- 箭头函数没有自己的 `this`，会继承定义时所在实例的 `this`。
- 这样即使 `setTimeout(c.inc, 0)` 只拿到函数引用，`this` 仍然指向实例。

</details>

<details>
<summary>Q3 答案</summary>

```js
console.log(obj.fn()); // 1
console.log(f());      // 非严格模式返回 undefined；严格模式抛 TypeError
```

`obj.fn()` 返回的箭头函数在 `fn()` 执行时定义，外层 `this` 是 `obj`，所以返回 1。

`const f = obj.fn` 只是拿到了 `fn` 函数本身。调用 `f()` 时，非严格模式下 `this` 失去 `obj`，箭头函数继承到的 `this` 也指向全局或 `undefined`，所以返回 `undefined`；严格模式下会抛 `TypeError`。

</details>

写完整份放进 `作答/03/js-05.md`。

下一节：[ES6 只补三处](./js-06-ES6只补三处.md)。
