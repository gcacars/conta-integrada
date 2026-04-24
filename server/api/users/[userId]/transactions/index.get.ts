import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { dateStringToDate } from '~~/shared/zod/zodDate';
import TransactionsRepo from '~~/server/repositories/TransactionsRepo';
import { UserTransactionsRequestQuery } from '~~/shared/types/transactions';

const repository = new TransactionsRepo();

const querySchema: z.ZodType<any, UserTransactionsRequestQuery> = z.strictObject({
  dateStart: dateStringToDate,
  dateEnd: dateStringToDate.optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { dateStart, dateEnd } = await getValidatedQuery(event, querySchema.parse) as z.output<typeof querySchema>;

  try {
    const userId = ObjectId.createFromHexString(user.id);

    return repository.getUserTransactions(userId, dateStart, dateEnd);
  } catch (error) {
    event.node.res.statusCode = 500;
    return { error: 'Internal Server Error', details: error };
  }
});
