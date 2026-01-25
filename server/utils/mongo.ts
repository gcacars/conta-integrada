// server/utils/mongo.ts
import { MongoClient, ServerApiVersion } from 'mongodb'

let client: MongoClient

export async function useDatabase() {
  const { mongoDb } = useRuntimeConfig();

  if (!mongoDb?.uri) throw new Error('Sem URL do MongoDB');

  if (!client) {
    try {
      client = new MongoClient(mongoDb.uri, {
        tlsCertificateKeyFile: mongoDb.certPath,
        serverApi: ServerApiVersion.v1,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 10000,
      })
  
      await client.connect()
      console.log('✅ Connected to MongoDB')
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error)
    }
  }

  return client.db(mongoDb.dbName)
}
