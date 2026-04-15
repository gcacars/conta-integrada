import { load as loadUsers } from './load-users.ts';
import { load as loadCategories } from './load-categories.ts';
import { load as loadTransactions } from './load-transactions.ts';

async function main() {
  const userId = await loadUsers();

  if (userId) {
    // await loadCategories(userId);
    await loadTransactions(userId);
  }
}

main();
