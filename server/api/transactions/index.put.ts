import { ObjectId } from 'mongodb';
import { z } from 'zod';
import TransactionsRepo from '~~/server/repositories/TransactionsRepo';
import type { Transaction } from "~~/shared/types/transactions";

const postSchema = z.strictObject({
  _id: z.nullish(z.string().length(24)),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format' }).transform((date) => new Date(date)),
  description: z.string().min(1),
  amount: z.strictObject({
    amountInCents: z.int().positive(),
    currency: z.string().length(3),
  }),
  type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER', 'INVESTMENT', 'DIVIDEND', 'INTEREST', 'TAX', 'REFUND', 'ADJUSTMENT']),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED']),
  categoryId: z.nullish(z.string().length(24)),
  sourceId: z.string().length(24),
  sourceType: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'WALLET', 'OTHER']),
  destinationId: z.nullish(z.string().length(24)),
  destinationType: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'WALLET', 'OTHER']).optional(),
  tags: z.array(z.string()).optional(),
  attachmentsCount: z.number().min(0).optional(),
  recurrence: z.strictObject({
    id: z.string(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: z.number().min(1),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format' }).transform((date) => new Date(date)).optional(),
    occurrences: z.number().min(1).optional(),
    totalOccurrences: z.number().min(1).optional(),
  }).optional(),
});

const repository = new TransactionsRepo();

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, postSchema.parse) as z.output<typeof postSchema> as Partial<Transaction>;

  try {
    body.userId = ObjectId.createFromHexString(user.id);

    const id = await repository.insertTransaction(body);

    if (!id) {
      createError({ statusCode: 500, statusMessage: 'Failed to insert transaction' });
      return;
    }

    return repository.getTransactionById(body.userId, id);
  } catch (error) {
    event.node.res.statusCode = 500;
    return { error: 'Internal Server Error', details: String(error) };
  }
});
