
if (!window.cordova) {
    var Socket = (function () {

        Socket.State = {};
        Socket.State[Socket.State.CLOSED = 0] = "CLOSED";
        Socket.State[Socket.State.OPENING = 1] = "OPENING";
        Socket.State[Socket.State.OPENED = 2] = "OPENED";
        Socket.State[Socket.State.CLOSING = 3] = "CLOSING";

        function Socket() {
            this._state = Socket.State.CLOSED;
            this.onData = null;
            this.onClose = null;
            this.onError = null;
        }

        Socket.create = function(callback) {
            setTimeout(function() {
                callback(new Socket());
            }, 100);
        };

        Socket.prototype.open = function (host, port, success, error) {
            var that = this;

            that.websocket = new WebSocket("ws://localhost:81"); //new WebSocket("ws://" + host + ":" + port);

            that.websocket.onopen = function() {
                that._state = Socket.State.OPENED;
                setTimeout(success, 500);
                //success();
                console.log("Websocket connected");
            };
            that.websocket.onerror = function() {
                that.onError();
            };
            that.websocket.onclose = function() {
                that._state = Socket.State.CLOSED;
                that.onClose();
            };
            that.websocket.onmessage = function (evt) {
                that.onData(toDataArray(evt.data));
            };

            this._state = Socket.State.OPENING;
        };

        Socket.prototype.write = function (data, successCallback, errorCallback) {

            var chars = [];
            for (var i = 0; i < data.length; i++) {
                chars.push(String.fromCharCode(data[i]));
            }

            // HAck for screenshots
            if (!this.websocket) {
                return;
            }

            this.websocket.send(chars.join(""));

            if (successCallback)
                successCallback();
        };

        Socket.prototype.shutdownWrite = function () {
            // HAck for screenshots
            if (!this.websocket) {
                return;
            }

            this.websocket.close();
        };

        Socket.prototype.close = function (successCallback, errorCallback) {
            // HAck for screenshots
            if (!this.websocket) {
                return;
            }

            this.websocket.close();
        };

        Object.defineProperty(Socket.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });

        function bin2String(array) {
            var result = "";
            for (var i = 0; i < array.length; i++) {
                result += String.fromCharCode(parseInt(array[i], 2));
            }
            return result;
        }

        function toDataArray(str) {
            var data = new Int8Array(str.length);
            for (var i=0; i < str.length; i++) {
                var charcode = str.charCodeAt(i);
                if (charcode < 0x80) data[i] = charcode;
                else if (charcode < 0x800) {
                    data[i] = 0xc0 | (charcode >> 6),
                            0x80 | (charcode & 0x3f);
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    data[i] = 0xe0 | (charcode >> 12),
                            0x80 | ((charcode>>6) & 0x3f),
                            0x80 | (charcode & 0x3f);
                }
                // surrogate pair
                else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                        | (str.charCodeAt(i) & 0x3ff))
                    data[i] = 0xf0 | (charcode >>18),
                            0x80 | ((charcode>>12) & 0x3f),
                            0x80 | ((charcode>>6) & 0x3f),
                            0x80 | (charcode & 0x3f);
                }
            }
            return data;
        }


        return Socket;
    })();
}