export interface Money {
  amount: number;
  currency: string;
  percentage?: number;
}

export interface Card {
  brand: string;
  number: string;
  current: Money;
  expireDate: Date; 
}

export interface BankAccount {
  brand: string;
  number: string;
  current: Money;
  income: number;
  expenses: number;
}

export interface Balance {
  income: number;
  expenses: number;
  currentBalance: number;
  projectedBalance: number;
  currency: string;
  essentialExpenses?: Money | null;
  otherExpenses?: Money | null;
  investments?: Money | null;
}

export const useFinanceStore = defineStore('financeStore', {
  state: () => ({
    balances: [] as Balance[],
    cards: [] as Card[],
    accounts: [] as BankAccount[],
    lastUpdated: null as Date | null,
  }),

  actions: {
    async fetchBalances() {
      try {
        // Simulate an API call to fetch balance data
        this.lastUpdated = new Date();
        this.balances = [
          {
            income: 5000,
            expenses: 10,
            currentBalance: 4990,
            projectedBalance: 5108,
            currency: 'USD',
            essentialExpenses: null,
            otherExpenses: null,
            investments: {
              amount: -3.09, currency: 'USD', percentage: -0.05,
            },
          },
          {
            income: 0,
            expenses: 0,
            currentBalance: 100,
            projectedBalance: 104,
            currency: 'EUR',
            essentialExpenses: null,
            otherExpenses: null,
            investments: {
              amount: 4, currency: 'EUR', percentage: 0.4,
            },
          },
          {
            income: 18000,
            expenses: 12000,
            currentBalance: 2500,
            projectedBalance: 17128,
            currency: 'BRL',
            essentialExpenses: {
              amount: 8500, currency: 'BRL', percentage: 0.26,
            },
            otherExpenses: {
              amount: 1000, currency: 'BRL', percentage: 0.3,
            },
            investments: {
              amount: 500, currency: 'BRL', percentage: 0.3,
            },
          },
        ];

        this.cards = [
          {
            brand: 'visa',
            number: '1234',
            current: {
              amount: 99000,
              currency: 'COP',
              percentage: 0.01,
            },
            expireDate: new Date(2026, 0, 25),
          },
          {
            brand: 'mastercard',
            number: '9070',
            current: {
              amount: 8370,
              currency: 'BRL',
              percentage: 0.3,
            },
            expireDate: new Date(2026, 0, 30),
          },
        ];

        this.accounts = [
          {
            brand: 'santander',
            number: '5678',
            current: {
              amount: 15000,
              currency: 'BRL',
              percentage: 0.9,
            },
            income: 3000,
            expenses: 1200,
          },
        ];
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    },
  },
});
