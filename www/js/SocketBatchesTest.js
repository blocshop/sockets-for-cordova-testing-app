/// <reference path="socket.d.ts" />
/// <reference path="SocketTest.ts" />
var SocketBatchesTest = (function () {
    function SocketBatchesTest() {
        this.sentData = null;
    }
    SocketBatchesTest.prototype.start = function (finished) {
        var _this = this;
        console.log("Starting socket batches test");
        this.socket = new Socket();
        this.socket.onError = function (error) {
            console.error(error);
            _this.onComplete(false);
        };
        var position = 0;
        this.socket.onData = function (data) {
            console.log("Data received, number of bytes: " + data.length);
            for (var i = 0; i < data.length; i++) {
                if (_this.sentData[position + i] != data[i]) {
                    console.error("not matching: " + _this.sentData[position + 1] + " - " + data[i]);
                    _this.socket.close();
                    finished("Data doesn't match");
                    break;
                }
            }
            position += data.length;
        };
        this.socket.onClose = function (hasError) {
            if (hasError || _this.sentData.length != position) {
                finished("Data not received completely " + position + " : " + _this.sentData.length);
            }
            else {
                finished(null);
            }
        };
        this.socket.open(SocketTestConfig.IP_ADDRESS, SocketTestConfig.PORT, function () {
            _this.sendData();
        }, function (error) {
            console.error(error);
            finished(error);
        });
    };
    SocketBatchesTest.prototype.sendData = function () {
        var _this = this;
        var LENGTH = 1000 * 1000;
        var arr = new Uint8Array(LENGTH);
        console.log("Array allocated");
        for (var i = 0; i < LENGTH; i++) {
            arr[i] = i % 256;
        }
        console.log("Array filled");
        this.socket.write(arr, function () {
            _this.socket.shutdownWrite();
        });
        this.sentData = arr;
        //var A_CHAR_CODE = "a".charCodeAt(0);
        //var endSentence = "Bye.\r\n";
        //
        //var data = new Uint8Array(SocketBatchesTest.NUMBER_OF_LINES * SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE + endSentence.length);
        //var baseMessageLength = data.length - endSentence.length;
        //
        //var i = 0;
        //while (i < baseMessageLength) {
        //
        //    // First character on line
        //    if (i % SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE == 0) {
        //        data[i] = "0".charCodeAt(0) + (i / SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE);
        //        this.sentData.push(data[i]);
        //        i++;
        //        continue;
        //    }
        //
        //    // Last 2 characters on line (\r\n)
        //    if ((i + 2) % SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE == 0) {
        //        data[i++] = 13;
        //        data[i++] = 10;
        //        this.sentData.push(13);
        //        this.sentData.push(10);
        //
        //        continue;
        //    }
        //
        //    var randomByte = A_CHAR_CODE + Math.floor(Math.random() * 26);
        //    this.sentData.push(randomByte);
        //    data[i] = randomByte;
        //
        //    i++;
        //}
        //
        //// Add end sentence.
        //for (var i = data.length - endSentence.length; i < data.length; i++) {
        //    data[i] = endSentence.charCodeAt(i - baseMessageLength);
        //    this.sentData.push(data[i]);
        //}
        //this.socket.write(data);
    };
    SocketBatchesTest.NUMBER_OF_LINES = 10;
    SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE = 1000;
    return SocketBatchesTest;
})();
//# sourceMappingURL=SocketBatchesTest.js.map