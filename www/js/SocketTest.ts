interface SocketTest {
    start(finished:(error: string) => void): void;
}

class SocketTestConfig {
    public static IP_ADDRESS = "192.168.0.4";
    public static PORT = 5000;
}