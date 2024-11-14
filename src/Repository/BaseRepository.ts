import { Db } from "mongodb";
import Database from "../db";

export interface IRepository {
  getOne(Obj: any): Promise<any>;
  findMany(matchObj: any, projectObj?: any, sortObj?: any, limitCount?: number): Promise<any[]>;
  insert(Obj: any): Promise<any>;
  insertList(Obj: any): Promise<any>;
  update(query: any, update: any): Promise<any>;
  updateList(query: any, update: any): Promise<any>;
  aggregate(query: any): Promise<any>;
  upsert(query: any, update: any): Promise<any>;
  upsertMany(query: any, update: any): Promise<any>;
}

class Repository implements IRepository {
  private dbconn: Database;
  private db!: Db;
  private Collection: any; // Replace with your actual collection name
  private dbCOllection: string;
  // constructor(collectionName: string) {
  //   this.dbconn = Database.getInstance();
  //   this.initializeDb(collectionName);
  // }

  // private async initializeDb(collectionName: string) {
  //   this.db = await this.dbconn.getDb(); // Await the db instance
  //   this.Collection = this.db.collection(collectionName);
  // }

  constructor(collectionName: string) {
    this.dbconn = Database.getInstance();
    // this.initializeDb(collectionName);
    this.dbCOllection = collectionName;
  }

  private async initializeDb() {
    // console.log("this is from repository");
    this.db = await this.dbconn.getDb(); // Await the db instance
    this.Collection = this.db.collection(this.dbCOllection);
  }

  public async getOne(matchObj: any): Promise<any> {
    await this.initializeDb();
    let result = await this.Collection.findOne(matchObj);
    return result;
  }

  public async findMany(matchObj: any, projectObj: any = {}, sortObj: any = {}, skipCount: number = 0, limitCount: number = 0): Promise<any[]> {
    await this.initializeDb();
    return await this.Collection.find(matchObj).project(projectObj).sort(sortObj).skip(skipCount).limit(limitCount).toArray();
  }

  public async insert(Obj: any): Promise<any> {
    await this.initializeDb();
    return await this.Collection.insertOne(Obj);
  }
  public async insertList(Obj: any): Promise<any> {
    await this.initializeDb();
    return await this.Collection.insertMany(Obj);
  }

  public async update(query: any, update: any): Promise<any> {
    await this.initializeDb();
    await this.Collection.updateOne(query, { $set: update });
  }

  public async updateList(query: any, update: any): Promise<any> {
    await this.initializeDb();
    await this.Collection.updateMany(query, { $set: update });
  }

  public async aggregate(pipeline: any[]): Promise<any[]> {
    await this.initializeDb();
    return await this.Collection.aggregate(pipeline).toArray();
  }

  public async upsert(query: any, update: any): Promise<any> {
    await this.initializeDb();
    await this.Collection.updateOne(query, { $set: update }, { upsert: true });
  }
  public async upsertMany(query: any, update: any): Promise<any> {
    await this.initializeDb();
    await this.Collection.updateMany(query, { $set: update }, { upsert: true });
  }
}

export default Repository;
