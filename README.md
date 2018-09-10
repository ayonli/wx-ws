# Wechat/Weixin Apps and Games WebSocket Wrapper

**NOTTICE** This package is still in testing progress and internally used in our
own game project based on [Cocos](http://www.cocos.com/).

Although not mentioned by Wechat/Weixin official, the internal object `WebSocket`
could be used in Wechat/Weixin Games as well, but it can only open two 
connections, and later connections will kick out former ones. But via the 
official recommended way `wx.connectSocket`, users can build at most 5 
connections. This package is a wrapper of `wx.connectSocket` to replace the 
internal `WebSocket` object, and keep the way of usage.

More about `WebSocket`, please check 
[WebSocket - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

## Example

```typescript
import { WebSocket as wxWebSocket } from "wx-ws";

declare global {
    const wx: any;
}

if (typeof wx == "object" && typeof wx.connectSocket == "function") {
    // replace the internal WebSocket object
    WebSocket = wxWebSocket;
}

// ...

var ws = new WebSocket(/* ... */);
```