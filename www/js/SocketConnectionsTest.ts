/// <reference path="socket.d.ts" />
/// <reference path="SocketTest.ts" />

class SocketConnectionsTest implements SocketTest {

    private static NUMBER_OF_CONNECTIONS = 10000;


    public start(finished:(error: string) => void) {
        console.log("Starting socket connections test");

        this.startOpeningSockets(SocketConnectionsTest.NUMBER_OF_CONNECTIONS, finished);
    }

    private startOpeningSockets(numberOfSockets: number, finished:(error: string) => void) {
        this.openSocket(() => {
            if (numberOfSockets == 0) {
                this.startOpeningSockets(numberOfSockets - 1, finished);
            }
            else {
                finished(null);
            }
        });
    }

    private openSocket(onClose: () => void) {
        var socket = new Socket();
        socket.onError = (error) => {
            console.error(error);
        };
        socket.onData = (data: Uint8Array) => {
            console.debug("Bytes received: " + data.length);
        };
        socket.onClose = (hasError) => {
            onClose();
        };
        socket.open(SocketTestConfig.IP_ADDRESS, SocketTestConfig.PORT,
            () => {
                var dataString = "Bye.\r\n";
                var data = new Uint8Array(dataString.length);
                for (var i = 0; i < data.length; i++) {
                    data[i] = dataString.charCodeAt(i);
                }
                socket.write(data);
            },
            (error) => {
                console.error(error);
                onClose();
            });
    }

}
