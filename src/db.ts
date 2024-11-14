import { MongoClient, Db } from "mongodb";

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db!: Db; // Use definite assignment assertion
  private isConnected: boolean = false; // Track connection state

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.client = new MongoClient(process.env.MONGODB_URL!);
    // this.connectDb();
  }

  // Method to get the singleton instance
  public static getInstance(): Database {
    if (!Database.instance) {
      // console.log("New  instance");
      Database.instance = new Database();
    }
    // console.log("previous instance");
    return Database.instance;
  }

  // Async method to establish database connection
  private async connectDb(): Promise<void> {
    try {
      const DbClient = await this.client.connect();
      console.log("Connected to MongoDB");
      this.db = DbClient.db(process.env.MONGODB_DB_NAME!);
      this.isConnected = true; // Mark connection as established
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  }

  // Method to get the database instance, ensure connection is established
  public async getDb(): Promise<Db> {
    if (!this.isConnected) {
      console.log("Waiting for database connection...");
      await this.connectDb(); // Wait for the connection
    }

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return this.db;
  }
}

export default Database;
