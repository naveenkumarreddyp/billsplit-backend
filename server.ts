import app from "./app";
import "dotenv-flow/config";

// Start the server
class Server {
  private port: number | string;

  constructor(port: number | string) {
    this.port = port;
  }

  public start(): void {
    app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const port = process.env.PORT!;
const server = new Server(port);
server.start();
