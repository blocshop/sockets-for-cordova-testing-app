/// <reference path="socket.d.ts" />
/// <reference path="SocketTest.ts" />
var SocketConnectionsTest = (function () {
    function SocketConnectionsTest() {
    }
    SocketConnectionsTest.prototype.start = function (finished) {
        console.log("Starting socket connections test");
        this.startOpeningSockets(SocketConnectionsTest.NUMBER_OF_CONNECTIONS, finished);
    };
    SocketConnectionsTest.prototype.startOpeningSockets = function (numberOfSockets, finished) {
        var _this = this;
        this.openSocket(function () {
            if (numberOfSockets == 0) {
                _this.startOpeningSockets(numberOfSockets - 1, finished);
            }
            else {
                finished(null);
            }
        });
    };
    SocketConnectionsTest.prototype.openSocket = function (onClose) {
        var socket = new Socket();
        socket.onError = function (error) {
            console.error(error);
        };
        socket.onData = function (data) {
            console.debug("Bytes received: " + data.length);
        };
        socket.onClose = function (hasError) {
            onClose();
        };
        socket.open(SocketTestConfig.IP_ADDRESS, SocketTestConfig.PORT, function () {
            var dataString = "Bye.\r\n";
            var data = new Uint8Array(dataString.length);
            for (var i = 0; i < data.length; i++) {
                data[i] = dataString.charCodeAt(i);
            }
            socket.write(data);
        }, function (error) {
            console.error(error);
            onClose();
        });
    };
    SocketConnectionsTest.NUMBER_OF_CONNECTIONS = 10000;
    return SocketConnectionsTest;
})();
//# sourceMappingURL=SocketConnectionsTest.js.map