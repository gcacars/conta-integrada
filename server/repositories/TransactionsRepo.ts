import { z } from 'zod';
import type { Document, Collection, ClientEncryption, InsertManyResult } from "mongodb";
import { ObjectId } from "mongodb";
import { useSecureClient } from "../../server/utils/mongo.ts";
import { getKeyAltName } from "../utils/key-alt-name.ts";
import { zodObjectId, zodBsonDatetime, zodBsonEncrypt } from "../../shared/zod/mongodb.ts";
import type { Transaction } from "../../shared/types/transactions.ts";

export const transactionsSchema = z.object({
  userId: zodObjectId,
  _id: zodObjectId,
  date: zodBsonEncrypt,
  description: zodBsonEncrypt,
  amount: zodBsonEncrypt,
  type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER', 'INVESTMENT', 'DIVIDEND', 'INTEREST', 'TAX', 'REFUND', 'ADJUSTMENT', 'CONTRIBUTION', 'REDEMPTION']),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED']),
  categoryId: zodObjectId.nullable(),
  sourceId: zodObjectId,
  sourceType: z.enum(["INVESTMENT", "CHECKING", "SAVINGS", "CREDIT_CARD", "LOAN", "WALLET", "OTHER"]),
  destinationId: zodObjectId.nullable(),
  destinationType: z.nullable(z.enum(["INVESTMENT", "CHECKING", "SAVINGS", "CREDIT_CARD", "LOAN", "WALLET", "OTHER"])),
  tags: z.array(zodObjectId),
  attachmentsCount: z.number().nonnegative(),
  hasRecurrence: z.boolean(),
  recurrence: zodBsonEncrypt,
  createdAt: zodBsonDatetime,
  updatedAt: zodBsonDatetime.nullable(),
  conciliationId: zodObjectId.nullable(),
}).meta({
  title: 'Transaction',
  description: 'Schema for financial transactions',
});

export type TransactionSchema = z.infer<typeof transactionsSchema>;

class TransactionsRepo {
  async insertTransaction(transaction: Omit<Transaction, '_id'>): Promise<string | null> {
    try {
      const { collection } = await this.#getCollection();
      const data = await this.#mapDocument(transaction);
      const result = await collection.insertOne(data);
      
      return result.acknowledged ? result.insertedId : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async insertManyTransactions(transactions: Omit<Transaction, '_id'>[]): Promise<InsertManyResult<TransactionSchema>> {
    try {
      const documents: Omit<TransactionSchema, '_id'>[] = [];
      const { collection } = await this.#getCollection();

      for await (const item of transactions) {
        const data = await this.#mapDocument(item);
        documents.push(data);
      }

      const result = await collection.insertMany(documents);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTransactionById(userId: ObjectId, transactionId: string | ObjectId): Promise<TransactionSchema | null> {
    const { collection } = await this.#getCollection();
    return collection.findOne({
      userId,
      _id: transactionId instanceof ObjectId ? transactionId : ObjectId.createFromHexString(transactionId),
    });
  }

  async getUserTransactions(userId: ObjectId, dateStart: Date, dateEnd?: Date): Promise<TransactionSchema[] | null> {
    const { collection } = await this.#getCollection();
    const filter: Document = { userId, date: { $gte: dateStart } };

    if (dateEnd) {
      filter.date.$lte = dateEnd;
    }

    return collection.find(filter).toArray();
  }

  #getCollection = async (): Promise<{ collection: Collection<TransactionSchema>, clientEncryption: ClientEncryption }> => {
    const { db, clientEncryption } = await useSecureClient();
    const collection = db.collection('transactions2') as Collection<TransactionSchema>;
    return { collection, clientEncryption };
  }

  async #mapDocument(transaction: Omit<Transaction, '_id'> | Transaction): Promise<Omit<TransactionSchema, '_id'> | TransactionSchema> {
    const { collection, clientEncryption } = await this.#getCollection();
    const keyAltName = getKeyAltName(transaction.userId);

    const data: Omit<TransactionSchema, '_id'> = {
      ...transaction,

      tags: transaction.tags || [],
      hasRecurrence: !!transaction.recurrence,
      createdAt: new Date(),

      // Nullable fields
      destinationId: transaction.destinationId || null,
      destinationType: transaction.destinationType || null,
      updatedAt: transaction.updatedAt || null,
      conciliationId: transaction.conciliationId || null,

      // IDs
      categoryId: transaction.categoryId ? ObjectId.createFromHexString(transaction.categoryId) : null,
      sourceId: ObjectId.createFromHexString(transaction.sourceId),
      userId: ObjectId.createFromHexString(transaction.userId),

      // Encrypted fields
      description: await clientEncryption.encrypt(transaction.description, {
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
        keyAltName,
      }),
      amount: await clientEncryption.encrypt(transaction.amount, {
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
        keyAltName,
      }),
      date: await clientEncryption.encrypt(transaction.date || new Date(), {
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
        keyAltName,
      }),
      recurrence: await clientEncryption.encrypt(transaction.recurrence || {}, {
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
        keyAltName,
      }),
    }

    return data;
  }
}

export { TransactionsRepo };
export default TransactionsRepo;
