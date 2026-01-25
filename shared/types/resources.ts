import type { Money } from "./finances";

export interface Card {
  brand: string;
  title: string;
  number: string;
  current: Money;
  invoiceDate: Date;
}

export interface BankAccount {
  brand: string;
  number: string;
  current: Money;
  income: Money;
  expenses: Money;
}
