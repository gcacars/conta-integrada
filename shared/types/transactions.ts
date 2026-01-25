import type { Money } from "./finances";
import type { DocumentOwner } from "./user";

export type TransactionType =
  | 'EXPENSE'      // Gasto
  | 'INCOME'       // Receita
  | 'TRANSFER'     // Transferência
  | 'INVESTMENT'   // Investimento
  | 'DIVIDEND'     // Dividendo
  | 'INTEREST'     // Juros
  | 'TAX'          // Taxa
  | 'REFUND'       // Reembolso
  | 'ADJUSTMENT'   // Ajuste
  | 'CONTRIBUTION' // Aporte
  | 'REDEMPTION'   // Resgate
  ;

export interface TransactionTypeDisplay {
  code: TransactionType;
  label: string;
}

export interface TransactionRecurrence {
  id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  endDate?: Date;
  occurrences?: number;
  totalOccurrences?: number;
}

export interface TransactionCategory {
  _id: string;
  name: string;
  active: boolean;
  color: string;
  parentId?: string;
  kind: TransactionType;
  userId: string;
}

export interface Transaction extends DocumentOwner {
  id: string;
  date: Date;
  description: string;
  amount: Money;
  type: TransactionType;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  categoryId?: string;
  sourceId: string;
  destinationId?: string;
  tags?: string[];
  attachmentsCount: number;
  recurrence?: TransactionRecurrence;
  createdAt: Date;
  updatedAt?: Date;
  conciliationId?: string;
}
// sourceType: 'ACCOUNT' | 'CREDIT_CARD' | 'WALLET';