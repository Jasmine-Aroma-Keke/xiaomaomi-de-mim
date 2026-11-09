# API、数据来源与模式

## 运行模式

默认 `npm run dev` 使用真实 API（5173）。`npm run dev:demo` 启动独立演示模式（5174），由 `.env.demo` 的 `VITE_USE_MOCK=true` 控制，不需要后端。也可复制 `.env.example` 为 `.env.local` 后设置；Vite 环境变量更改需要重启。

`npm run build` 构建真实模式，输出 dist；`npm run build:demo` 构建演示模式，输出 dist-demo，两者分离。若设置过 `.env.local`，它可能覆盖模式配置，运行前核对页面模式提示。构建期变量决定实际模式，不能通过浏览器参数临时改变。

真实页面经 Axios 使用 `VITE_API_BASE_URL`，默认 /api，30 秒超时。所有模式走统一 `legacyRequest` 入口。Mock 动态导入 src/mocks/lab.ts，不发网络请求；固定绘图与 SHA256 输入摘要决定演示 PNG，图片有水印；只将本次会话的图片与消息关联到内存，输入密钥匹配时取回原文，刷新后失效。这不是嵌入、加密或认证算法。未知/修改过的图片返回 unknown，检测返回 unavailable。

所有页面有持续演示标记，演示报告/CSV/文本/图片下载带演示来源。演示图像的像素差可以计算，但不能当成隐写算法的质量指标。

## 当前已实现的 Python 基线

| 方法 | 路径 | 请求 | 响应 |
|---|---|---|---|
| POST | /api/generate | public, secret, key | png（原始 Base64）, capacity_bytes, scan_status |
| POST | /api/extract | png, key | status: passed/failed/unknown, secret: string/null, detail |
| POST | /api/detect | png | status: unavailable, detail |

核心请求和响应类型在 src/types/stego.ts。生成/提取服务在 src/services/stego.ts；全局请求在 src/services/api.ts。公开文本 1–1200 UTF-8 字节；秘密最大 11960 字节；上传 PNG 最大 5.5 MB、400 万像素。

图像处理、RGB 差异、PSNR 与图表在浏览器运行；当前耗时包含网络及后端排队。校验只覆盖 CAT1 消息。统计接口未输出统计量，RS、自适应 LSB、SSIM、整图认证、自动扫码均待接入。

## 用户初步约定、尚未实现

- POST /api/qr/generate
- POST /api/stego/extract
- POST /api/qr/verify

这些路由不能直接切换后调用；需要 FastAPI 实现、字段与异常协议核对后，在服务适配器中替换。现有 Python 标准库服务未被本阶段更改。

## 前端拟议，未获后端约定

- POST /api/stego/embed：自定义图像嵌入，需约定区域、算法与载体元数据。
- POST /api/analysis/detect：需约定方法、统计量、阈值来源、风险解释。
- POST /api/integrity/verify：需约定认证范围、可信参考及分块机制。
- POST /api/experiments/robustness 与 /api/experiments/compare：需约定批量执行、种子、执行时长和原始记录。

以上仅为讨论草案，当前前端不发送这些请求。

## 异常与来源

输入错误优先在界面提示；真实接口 400 使用后端错误，404 显示未提供接口，超时、网络断开和其他 HTTP 错误分别给出原因。格式不符合约定的成功响应也拒绝。路由代码加载或渲染失败由 ErrorBoundary 提供中文刷新入口。

演示数据不能混入真实评估集；unknown 不当作 0；未测不填 0。CSV 导出保留模式和不可用状态，正式实验仍需多样本、多次重复及固定运行环境。
