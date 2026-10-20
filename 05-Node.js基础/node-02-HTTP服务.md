# 第五章 · Node.js 02：HTTP 服务

自动化平台的前端页面通常要请求服务端，获取任务状态或测试结果。Node.js 内置的 `node:http` 可以创建最小 HTTP 服务，不必先安装框架。

测试时让服务监听随机端口，可以避免固定端口被其他程序占用。响应结束要调用 `res.end()`；否则客户端会一直等。

## 创建一个可直接运行的服务

下面代码创建 `/health` 接口，用随机端口启动服务，再用 Node 自带的 `fetch` 请求它，最后关闭服务：

```js
import { createServer } from "node:http";

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "not found" }));
});

server.listen(0, "127.0.0.1", async () => {
  const address = server.address();

  try {
    if (!address || typeof address === "string") {
      throw new Error("无法读取服务端口");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    console.log(response.status);
    console.log(await response.text());
  } finally {
    server.close();
  }
});
```

输出：

```text
200
{"ok":true}
```

`listen(0)` 让系统分配可用端口；服务启动后再从 `server.address()` 读取端口。路由判断应同时看 HTTP 方法和路径，不要只看路径。

## 这节的坑

- `request.url` 是客户端发送的路径和查询字符串，不是完整网址；用 `new URL()` 解析。
- 状态码和响应头要在 `response.end()` 前设置。
- 服务监听成功后要关闭它。忘记 `server.close()`，Node 进程可能一直不退出。
- 请求体是流；这节只处理 GET，不把请求体当作已经读完的字符串。

## 练习

**Q1.** 在服务里增加 `GET /runs?status=failed`，从给定的运行记录中筛选失败项并返回 JSON。记录为：

```js
[
  { id: "r-1", status: "passed" },
  { id: "r-2", status: "failed" },
  { id: "r-3", status: "failed" },
]
```

验收：状态码 `200`，响应体为：

```json
[{"id":"r-2","status":"failed"},{"id":"r-3","status":"failed"}]
```

**Q2.** 请求一个不存在的路径。验收：状态码 `404`，响应体为 `{"error":"not found"}`。

## 答案（先做完再看）

<details>
<summary>验收要点</summary>

- Q1：从 `url.searchParams` 读取 `status`，只返回匹配记录；响应必须结束。
- Q2：未知路径走统一的 404 分支，不能默认返回 200。
- 请求路径要从 `request.url` 解析；不能把查询字符串当成路径的一部分比较。
- 服务监听随机端口后，从 `server.address()` 获取实际端口再发请求。

</details>

写完整份放进 `作答/05/node-02.md`。

下一节：[事件与 EventEmitter](./node-03-EventEmitter.md)。
