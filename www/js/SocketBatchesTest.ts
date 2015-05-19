/// <reference path="socket.d.ts" />
/// <reference path="SocketTest.ts" />

class SocketBatchesTest implements SocketTest {
    private sentData: number[] = [];
    private socket: Socket;

    private static NUMBER_OF_LINES = 10;
    private static NUMBER_OF_CHARS_PER_LINE = 1000;

    public onComplete: (wasSuccess: boolean) => void;

    public start(finished:(error: string) => void) {
        console.log("Starting socket test");

        this.socket = new Socket();
        this.socket.onError = (error) => {
            console.error(error);
            this.onComplete(false);
        };
        this.socket.onData = (data: Uint8Array) => {
            console.log("Data received, number of bytes: " + data.length);
            for (var i = 0; i < data.length; i++) {

                if (this.sentData[0] != data[i]) {
                    this.socket.close();
                    finished("Data doesn't match");
                    return;
                }
                else {
                    this.sentData.shift();
                }
            }
        };
        this.socket.onClose = (hasError) => {
            if (hasError || this.sentData.length != 0) {
                finished("Data not received completely");
            }
            else {
                finished(null);
            }
        };
        this.socket.open(SocketTestConfig.IP_ADDRESS, SocketTestConfig.PORT,
            () => {
                this.sendData();
            },
            (error) => {
                console.error(error);
                finished(error);
            });
    }

    private sendData() {
        var A_CHAR_CODE = "a".charCodeAt(0);
        var endSentence = "Bye.\r\n";

        var data = new Uint8Array(SocketBatchesTest.NUMBER_OF_LINES * SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE + endSentence.length);
        var baseMessageLength = data.length - endSentence.length;

        var i = 0;
        while (i < baseMessageLength) {

            if ((i + 2) % SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE == 0) {
                data[i++] = 13;
                data[i++] = 10;
                this.sentData.push(13);
                this.sentData.push(10);

                continue;
            }

            if (i % SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE == 0) {
                data[i] = "0".charCodeAt(0) + (i / SocketBatchesTest.NUMBER_OF_CHARS_PER_LINE);
                this.sentData.push(data[i]);
                i++;
                continue;
            }

            var randomByte = A_CHAR_CODE + Math.floor(Math.random() * 26);
            this.sentData.push(randomByte);
            data[i] = randomByte;

            i++;
        }

        for (var i = data.length - endSentence.length; i < data.length; i++) {
            data[i] = endSentence.charCodeAt(i - baseMessageLength);
            this.sentData.push(data[i]);
        }
        this.socket.write(data);
    }
}
