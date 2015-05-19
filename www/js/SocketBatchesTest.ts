/// <reference path="socket.d.ts" />
/// <reference path="SocketTest.ts" />

class SocketBatchesTest implements SocketTest {
    private sentData: number[] = [];
    private socket: Socket;

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

        var NUMBER_OF_LINES = 10;
        var NUMBER_OF_CHARS_PER_LINE = 10000;
        var A_CHAR_CODE = "a".charCodeAt(0);

        for (var j = 0; j < NUMBER_OF_LINES; j++) {
            var data = new Uint8Array(NUMBER_OF_CHARS_PER_LINE + 2);
            data[0] = "0".charCodeAt(0) + j;
            this.sentData.push(data[0]);
            for (var i = 1; i < NUMBER_OF_CHARS_PER_LINE; i++) {
                var randomByte = A_CHAR_CODE + Math.floor(Math.random() * 26);
                this.sentData.push(randomByte);
                data[i] = randomByte;
            }
            data[NUMBER_OF_CHARS_PER_LINE] = 13;
            data[NUMBER_OF_CHARS_PER_LINE + 1] = 10;
            this.sentData.push(13);
            this.sentData.push(10);

            this.socket.write(data);
        }

        var endSentence = "Bye.\r\n";
        var data = new Uint8Array(endSentence.length);
        for (var i = 0; i < data.length; i++) {
            data[i] = endSentence.charCodeAt(i);
            this.sentData.push(data[i]);
        }
        this.socket.write(data);
    }
}
