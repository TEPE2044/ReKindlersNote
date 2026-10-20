# 第五章 · Node.js 01：文件与路径

测试平台会把运行结果写进 JSON、日志或临时文件。Node.js 的 `node:fs` 负责读写文件，`node:path` 负责拼接和解析路径。本节分别处理文件位置和文件内容。

Windows 和 Linux 的路径分隔符不同。拼路径不要手写 `/` 或 `\`，用 `path.join()`；读写文件时用异步 API，避免文件操作卡住事件循环。

## 用临时目录写入并读取结果

下面代码使用 ES Module，可在本项目根目录保存为 `.js` 文件后运行。ES Module 默认是严格模式；给未声明的变量赋值会抛出 `ReferenceError`，不需要额外添加 `"use strict"`：

```js
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directory = await mkdtemp(join(tmpdir(), "test-run-"));
const file = join(directory, "result.json");

try {
  const result = { runId: "r-07", failed: 2 };
  await writeFile(file, JSON.stringify(result), "utf8");
  console.log(await readFile(file, "utf8"));
} finally {
  await rm(directory, { recursive: true, force: true });
}
```

输出：

```text
{"runId":"r-07","failed":2}
```

`process.cwd()` 是启动 Node 时的当前工作目录，不保证等于脚本文件所在目录。`path.resolve()` 从当前工作目录解析路径；`path.join()` 把路径片段按当前操作系统的规则组合起来。

## 这节的坑

- `readFile()` 不传编码时返回 `Buffer`；读文本时传 `"utf8"`。
- `writeFile()` 不会自动创建缺失的父目录。
- `fs/promises` 的操作要 `await`。忘了 `await`，后续代码可能在文件写完前就继续执行。
- 临时文件用完要清理；正式报告则不要放进临时目录。

## 练习

**Q1.** 创建一个唯一的临时目录，在其中准备 `reports/2026/run-result.json`。`reports/2026` 起初不存在。把 `{ runId: "r-07", failed: 2 }` 写入文件，读回并解析 JSON，输出 `failed`，最后清理临时目录。验收输出：

```text
2
```

**Q2.** 对路径 `reports/2026/run-result.json`，分别取得文件名和扩展名。验收输出：

```text
run-result.json
.json
```

## 答案（先做完再看）

<details>
<summary>验收要点</summary>

- Q1：先创建不存在的嵌套目录，再写入并解析 JSON；完成后清理临时目录。
- Q2：文件名是 `run-result.json`，扩展名是 `.json`。可以用 `path.basename()` 和 `path.extname()`。
- 如果输出是 `Buffer`，读取文本时漏了 `"utf8"`。
- 不要用字符串拼接路径；路径分隔符由 `node:path` 处理。

</details>

写完整份放进 `作答/05/node-01.md`。

下一节：[HTTP 服务](./node-02-HTTP服务.md)。
