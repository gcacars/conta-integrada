export interface Money {
  amount: number;
  currency: string;
  percentage?: number;
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
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    },
  },
});
