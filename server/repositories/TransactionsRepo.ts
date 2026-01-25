import type { Collection } from "mongodb";
import type { Transaction } from "~~/shared/types/transactions";

class TransactionsRepo {
  async insertTransaction(transaction: Transaction) {
    const db = await useDatabase();
    const collection = db.collection('transactions') as Collection<Transaction>;
    const result = await collection.insertOne(transaction);
    return result;
  }
}

export { TransactionsRepo };
export default TransactionsRepo;
