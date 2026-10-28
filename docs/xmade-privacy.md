---
title: Xmade 隐私政策
description: Xmade Chrome 扩展的隐私政策。扩展不收集个人信息，没有开发者服务器、统计或登录；设置保存在浏览器本地。Privacy policy for the Xmade Chrome extension.
updated: 2026-10-28
comments: false
---

# Xmade Privacy Policy / Xmade 隐私政策

This page is only about the **Xmade** Chrome extension (Chrome Web Store item `bgopfpaklpnjmjbngflljdnjnblhnbjm`). It does not describe promangofund.com. The website has its own policy at [/privacy](/privacy), which covers site analytics and ads. Those practices do not apply to the extension.

本页只说明 **Xmade** Chrome 扩展（Chrome 应用店 ID `bgopfpaklpnjmjbngflljdnjnblhnbjm`）如何处理数据，不说明 promangofund.com。网站本身的访问统计和广告见 [/privacy](/privacy)，那些做法不适用于本扩展。

**Last updated:** October 28, 2026. **Published on this site:** October 28, 2026. An earlier copy of this policy, dated September 18, 2026, lived in the extension repository and was not reachable by the public. This page is the public text and matches the extension on the store (version 0.3.7).

**最后更新：** 2026 年 10 月 28 日。**本页公开发布：** 2026 年 10 月 28 日。上一版政策日期为 2026 年 9 月 18 日，放在扩展仓库里，公开链接打不开。本页是公开版本，并与应用店当前版本（0.3.7）一致。

## English

### Summary

Xmade is a local-first Chrome extension. It adds a button on x.com and twitter.com so you can save a video, GIF, image, export card, or reply screenshot that you can already see.

Xmade does **not**:

- collect, sell, or transmit personal information to a developer-operated server
- run an Xmade server, account, or login
- use analytics, advertising, or tracking inside the extension
- read or send cookies, tokens, or authentication state
- bypass a login wall or a paywall

There is no Xmade account to create.

### What stays on your device

When you use Xmade, the work happens in your browser:

- Content scripts read tweets, replies, images, and videos that are already visible on `x.com` or `twitter.com`. One script runs in the page so it can read media addresses that X has already loaded. It does not read your cookies, tokens, or login state.
- Media downloads go through Chrome's built-in downloader to your computer.
- Export cards and reply screenshots are drawn locally and saved as PNG files. A copy may also be placed on your clipboard.
- Optional timeline watch and Radar, both off until you turn them on, scan in the browser. Keywords, topics, seen-post ids, and notification history stay in extension storage. They are not uploaded to the developer.

### Settings storage

Xmade stores settings with the Chrome storage API. It does not send those settings to an Xmade server.

| Storage | What is saved | Where it goes |
| --- | --- | --- |
| `chrome.storage.local` | Radar preferences, which settings tab you last opened, ids of posts already notified, and Radar history | Stays in this browser profile until you clear extension data or uninstall |
| `chrome.storage.sync` | Reply-filter settings, the “also save the export image” switch, and timeline-watch settings (on/off, interval, keywords) | Stays in Chrome. If you are signed into Chrome and Chrome Sync is on, Chrome may copy these settings to your other devices. Xmade does not receive that copy |

Clear site data for the extension, or uninstall Xmade, to delete this storage. Files already saved to your Downloads folder are ordinary local files and are not deleted by uninstalling the extension.

### Network requests

Xmade may request media from X-owned hosts so a file you can already see can be saved or drawn onto an export card:

- `x.com` and `twitter.com`
- `cdn.syndication.twimg.com` (public embed fallback for video URLs)
- `pbs.twimg.com` (images and avatars)
- `abs.twimg.com` (default profile images)
- `video.twimg.com` (MP4 files)
- `ton.twitter.com` (legacy X media host)

These requests are the browser fetching media. Xmade does not add its own authenticated API calls, and it does not attach your cookies or tokens. Optional watch may open or focus an `x.com` tab so the scan can read the timeline you can already see. That page load is X's own website.

Xmade does not contact any other host for analytics, crash reports, or remote code.

### Permissions

| Permission | Why Xmade asks for it |
| --- | --- |
| `downloads` | Save media through Chrome's downloader, and report or cancel that download |
| `clipboardWrite` | Copy an export PNG, or media after a long capture, to the clipboard |
| `storage` | Remember the settings in the table above |
| `alarms` | Run optional timeline watch and Radar on a timer you set. Both are off by default |
| `notifications` | Show a local Chrome notification when optional watch or Radar has something to show. Nothing is sent to a server |
| `tabs` | Find, focus, or open an `x.com` / `twitter.com` tab for optional watch and Radar, and open a post when you click a notification. Xmade does not read tabs on other sites |
| Host access to the domains above | Run on X and fetch media that is already visible to you |

### Children

Xmade is not directed at children under 13. It does not knowingly collect personal information from anyone, including children.

### Changes

If this policy changes, the “Last updated” date at the top of this page will change. The public URL stays `https://promangofund.com/xmade-privacy`.

### Contact

Privacy questions about the extension: [jeffreylsp@gmail.com](mailto:jeffreylsp@gmail.com).

Xmade is not affiliated with X Corp. or Twitter.

## 中文

### 概要

Xmade 是一个本地优先的 Chrome 扩展。它在 x.com 和 twitter.com 的推文上加一个按钮，用来保存你已经能看到的视频、GIF、图片、导出卡片或回复截图。

Xmade **不会**：

- 向开发者运营的服务器收集、出售或传输个人信息
- 提供 Xmade 服务器、账号或登录
- 在扩展里使用统计、广告或追踪
- 读取或发送 Cookie、令牌或登录状态
- 绕过登录墙或付费墙

不需要注册 Xmade 账号。

### 留在你设备上的处理

使用 Xmade 时，处理发生在你的浏览器里：

- 内容脚本只读取 `x.com` 或 `twitter.com` 上已经显示的推文、回复、图片和视频。其中一段脚本跑在页面里，用来读取 X 自己已经加载好的媒体地址。它不读取 Cookie、令牌或登录状态。
- 媒体下载走 Chrome 自带的下载器，保存到你的电脑。
- 导出卡片和回复截图在本地绘制，存成 PNG。需要时也会复制到剪贴板。
- 可选的时间线监控和 Radar 默认关闭。你打开之后，扫描仍在浏览器内完成。关键词、话题、已提醒过的帖子编号和提醒记录只写在扩展存储里，不会上传给开发者。

### 设置存在哪里

Xmade 用 Chrome 的存储接口保存设置，不会把这些设置发给 Xmade 的服务器。

| 存储 | 保存的内容 | 去向 |
| --- | --- | --- |
| `chrome.storage.local` | Radar 偏好、上次打开的设置分页、已经提醒过的帖子编号，以及 Radar 记录 | 留在当前浏览器配置里，直到你清除扩展数据或卸载 |
| `chrome.storage.sync` | 回复过滤设置、「导出时同时保存图片」开关，以及时间线监控设置（开关、间隔、关键词） | 留在 Chrome 里。如果你登录了 Chrome 且打开了 Chrome 同步，Chrome 可能会把这些设置同步到你的其他设备。Xmade 不会收到这份副本 |

清除该扩展的网站数据，或卸载 Xmade，即可删除上述存储。已经保存到「下载」文件夹的文件是普通本地文件，卸载扩展不会删掉它们。

### 网络请求

为了把你已经能看到的媒体保存下来，或画进导出卡片，Xmade 可能会向 X 名下的主机请求文件：

- `x.com` 和 `twitter.com`
- `cdn.syndication.twimg.com`（视频地址的公开嵌入兜底）
- `pbs.twimg.com`（图片和头像）
- `abs.twimg.com`（默认头像）
- `video.twimg.com`（MP4 文件）
- `ton.twitter.com`（旧的 X 媒体主机）

这些请求是浏览器在取媒体文件。Xmade 不会自己发起带登录态的接口请求，也不会附上你的 Cookie 或令牌。可选的时间线监控可能会打开或切到一个 `x.com` 标签页，以便读取你本来就能看到的时间线。那个页面加载的是 X 自己的网站。

Xmade 不会为了统计、崩溃上报或远程代码去连接其他主机。

### 权限

| 权限 | 用途 |
| --- | --- |
| `downloads` | 通过 Chrome 下载器保存媒体，并汇报或取消这次下载 |
| `clipboardWrite` | 把导出的 PNG，或较长捕获之后的媒体，复制到剪贴板 |
| `storage` | 记住上一节表格里的设置 |
| `alarms` | 按你设定的间隔运行可选的时间线监控和 Radar。两者默认关闭 |
| `notifications` | 在可选监控或 Radar 有内容时，显示一条本地 Chrome 通知。通知内容不会发到服务器 |
| `tabs` | 为可选监控和 Radar 查找、激活或打开 `x.com` / `twitter.com` 标签页，并在你点击通知时打开对应帖子。Xmade 不读取其他网站的标签页 |
| 上表所列主机权限 | 在 X 上运行，并获取你已经能看到的媒体 |

### 儿童

Xmade 不面向 13 岁以下儿童。它不会故意向任何人，包括儿童，收集个人信息。

### 政策更新

本政策若有变更，会修改本页顶部的「最后更新」日期。公开地址保持为 `https://promangofund.com/xmade-privacy`。

### 联系

关于本扩展隐私的问题，请发邮件至 [jeffreylsp@gmail.com](mailto:jeffreylsp@gmail.com)。

Xmade 与 X Corp.、Twitter 没有关联。
