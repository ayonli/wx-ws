"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
require("./wx");
const url = Symbol("url");
const readyState = Symbol("readyState");
const onopen = Symbol("onopen");
const onmessage = Symbol("onmessage");
const onerror = Symbol("onerror");
const onclose = Symbol("onclose");
class WebSocketConstructor extends events_1.EventEmitter {
    constructor(url, protocols = []) {
        super();
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
        this.responseHeaders = {};
        this[url] = url;
        this[readyState] = this.CONNECTING;
        this.socket = wx.connectSocket({
            url,
            header: {},
            protocols: Array.isArray(protocols) ? protocols : [protocols]
        });
        this.onopen = () => { };
    }
    get binaryType() {
        return this.socket["binaryType"] || "arraybuffer";
    }
    get bufferedAmount() {
        return this.socket["bufferedAmount"] || void 0;
    }
    get extensions() {
        return this.socket["extensions"]
            || this.responseHeaders["sec-websocket-extensions"]
            || "";
    }
    get protocol() {
        return this.socket["protocol"]
            || this.responseHeaders["sec-websocket-protocol"]
            || "";
    }
    get readyState() {
        return this.socket["readyState"] || this[readyState];
    }
    get url() {
        return this.socket["url"] || this[url];
    }
    get onopen() {
        return this[onopen];
    }
    set onopen(callback) {
        this[onopen] = callback;
        this.socket.onOpen((res) => {
            this[readyState] = this.OPEN;
            for (let i in res.header) {
                this.responseHeaders[i.toLowerCase()] = res.header[i];
            }
            callback.call(this, Object.assign(new Event("open"), {
                target: this
            }));
        });
    }
    get onmessage() {
        return this[onmessage];
    }
    set onmessage(callback) {
        this[onmessage] = callback;
        this.socket.onMessage((res) => {
            callback.call(this, Object.assign(new MessageEvent("message"), {
                target: this,
                data: res.data
            }));
        });
    }
    get onerror() {
        return this[onerror];
    }
    set onerror(callback) {
        this[onerror] = callback;
        this.socket.onError(() => {
            callback.call(this, Object.assign(new Event("error"), {
                target: this
            }));
        });
    }
    get onclose() {
        return this[onclose];
    }
    set onclose(callback) {
        this[onclose] = callback;
        this.socket.onClose((res) => {
            callback.call(this, Object.assign(new CloseEvent("close"), {
                target: this,
                code: res.code,
                reason: res.reason,
                wasClean: res.wasClean
            }));
        });
    }
    close() {
        this[readyState] = this.CLOSING;
        this.socket.close({
            code: 1000,
            reason: "normal closure",
            success: () => {
                this[readyState] = this.CLOSED;
            }
        });
    }
    send(data) {
        this.socket.send({ data });
    }
    addEventListener(type, listener) {
        this.addListener(type, listener);
    }
    removeEventListener(type, listener) {
        this.removeListener(type, listener);
    }
    dispatchEvent(ev) {
        return this.emit(ev.type);
    }
}
exports.WebSocket = WebSocketConstructor;
//# sourceMappingURL=index.js.map