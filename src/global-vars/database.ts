
import { uniqueId } from "../utils/string";
import { JSON_Primitives } from "../types/JSON";

const ERRORS = {
  DOC_NOT_FOUND: "Document not found",
  ALREADY_EXISTS: "already exists"
}

class Database {
  private paths: { [name: string]: DataPath } = {}
  path(name: string){
    if(name in this.paths) return this.paths[name];
    this.paths[name] = new DataPath();
    return this.paths[name];
  }
}

const SymSchemas = Symbol("schemas");
class DataPath {
  private schemas: { [name: string]: DataSchema<any> } = {}
  schema<T>(name: string){
    if(name in this.schemas) return this.schemas[name];
    this.schemas[name] = new DataSchema<T>(name);
    return this.schemas[name];
  }
}

export class DataSchema<T> {
  private name: string
  private docs: { [id: string]: DataDocument<T>} = {};
  constructor(name: string){
    this.name = name;
    console.log("new schema:", this.name);
  }
  async add(item: T){
    const doc = {
      ...item,
      id: uniqueId(),
      v: 0
    }
    this.docs[doc.id] = doc;
    return this.docs[doc.id];
  }
  async upsert(id: string, item: T){
    const v = (id in this.docs) ? this.docs[id].v + 1 : 0;
    const doc = {
      ...item,
      id: id,
      v: v
    }
    this.docs[id] = doc;
    return this.docs[id];
  }
  async set(id: string, item: T){
    if(id in this.docs){
      throw new Error(ERRORS.ALREADY_EXISTS);
    }
    const doc = {
      ...item,
      id: id,
      v: 0
    }
    this.docs[doc.id] = doc;
    return this.docs[doc.id];
  }
  async has(id: string){
    return id in this.docs;
  }
  async get(id: string){
    console.log(this.docs, id);
    if(!(id in this.docs)) return void 0
    return this.docs[id]
  }
  async getByKey<K extends keyof T>(key: K, value: T[K]){
    const p = {
      [key]: value
    } as unknown as Partial<T>
    console.log(this.docs, key, value);
    const items = await this.query(p)
    if(items.length === 0) return void 0
    return items[0];
  }
  async update(id: string, newValue: T){
    if(!(id in this.docs)) return void 0
    const doc = this.docs[id];
    const v = doc.v + 1;
    this.docs[id] = {
      ...newValue,
      id: id,
      v: v
    }
    return this.docs[id];
  }
  async patch(id: string, newValues: Partial<T>){
    if(!(id in this.docs)) return void 0;
    const doc = this.docs[id];
    const v = doc.v + 1;
    this.docs[id] = {
      ...doc,
      ...newValues,
      id: id,
      v: v
    }
    return doc;
  }
  async delete(id: string){
    if(!(id in this.docs)) return void 0;
    const doc = this.docs[id];
    delete this.docs[id];
    return doc;
  }
  /*

  maybe later i'll do >, < not, naybe regexp

  */
  async query(query: Partial<T>){
    const queryKeys = Object.keys(query);
    if(queryKeys.length === 0) return Object.values(this.docs);
    return Object.values(this.docs).filter((doc)=>{
      for(var k in query){
        if(query[k] !== doc[k]) return false
      }
      return true;
    })
  }
}



export type DataDocument<T> = T & {
  id: string,
  v: number,
  [okkey: string]: JSON_Primitives | Array<JSON_Primitives>,
  [badkey: symbol]: void,
};


export const db = (new Database()).path("cleanup-fun");
