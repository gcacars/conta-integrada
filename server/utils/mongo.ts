// server/utils/mongo.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'site'

let client: MongoClient

if (!uri) throw new Error('Sem URL do MongoDB');

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db(dbName)
}