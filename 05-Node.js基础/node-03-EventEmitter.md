# 第五章 · Node.js 03：事件与 EventEmitter

测试运行器会在步骤开始、步骤结束或整轮完成时通知其他模块。Node.js 的 `EventEmitter` 可以在同一个进程里发布和监听这些事件，让每个步骤不必直接调用界面和日志模块。

事件监听器按注册顺序同步执行。它适合进程内的通知，不是跨进程消息队列；程序退出后，事件不会自动保存。

## 发布和监听测试步骤事件

```js
import { EventEmitter } from "node:events";

const runner = new EventEmitter();

runner.on("step:done", ({ id, passed }) => {
  console.log(`${id}: ${passed ? "passed" : "failed"}`);
});

runner.once("run:done", ({ failed }) => {
  console.log(`run done: ${failed} failure(s)`);
});

runner.emit("step:done", { id: "TC-7", passed: false });
runner.emit("run:done", { failed: 1 });
runner.emit("run:done", { failed: 1 });
```

输出：

```text
TC-7: failed
run done: 1 failure(s)
```

`on()` 持续监听，`once()` 只响应一次。`emit()` 会立即按监听器注册顺序调用回调，所以监听器里的同步耗时操作也会阻塞当前流程。

## 这节的坑

- 事件名是字符串，发布端和监听端必须完全一致。
- `once()` 适合“整轮完成”这类只处理一次的通知；步骤结束通常要用 `on()`。
- `EventEmitter` 的监听回调默认同步执行；不要在其中做长时间同步计算。
- 发布名为 `"error"` 的事件时，如果没有错误监听器，Node.js 会抛出异常。不要把普通业务失败随意命名为 `"error"`。
- 动态注册的监听器在不再需要时用 `off()` 移除，避免重复注册导致回调执行多次。

## 练习

**Q1.** 不使用 `once()`，用 `on()` 监听 `run:done`；在第一次事件处理后移除监听器。连续发布两次该事件。验收：完成信息只输出一次。

**Q2.** 为 `step:done` 注册监听器，接收 `{ id, passed }` 并打印测试编号和结果。再移除该监听器后发布一次事件。验收：移除后不再打印。

## 答案（先做完再看）

<details>
<summary>验收要点</summary>

- Q1：保存同一个监听器函数引用；第一次处理后用 `off()` 移除它，第二次 `emit()` 不再调用。
- Q2：用同一个监听器引用注册和移除；移除之后再 `emit()` 不应产生输出。
- 事件不会排队等待未来的监听器：先 `emit()` 再 `on()`，之前的事件不会补发。
- `EventEmitter` 仅在当前 Node 进程内工作，不提供持久化或跨进程传输。

</details>

写完整份放进 `作答/05/node-03.md`。

第五章到这里结束。出口任务见 [附录/outro.md](../附录/outro.md)。
