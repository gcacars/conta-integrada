import type { Currency } from "~~/shared/types/finances";
import type { TransactionCategory, TransactionTypeDisplay } from "~~/shared/types/transactions";
import useSystemStore from "./systemStore";

export interface AppState {
  currencies: Currency[];
  categories: TransactionCategory[];
  transactionTypes: TransactionTypeDisplay[];
  lastInputDate: Date | null;
  lastInputCategoryId: string | null;
  lastInputSourceId: string | null;
}

export const useAppStore = defineStore('appStore', () => {
  const { user } = useUserSession()
  const systemStore = useSystemStore()

  const loading = ref(false);
  const currencies = ref<Currency[]>([]);
  const categories = ref<TransactionCategory[]>([]);
  const transactionTypes = ref<TransactionTypeDisplay[]>([
    { code: 'EXPENSE', label: 'Despesa' },
    { code: 'INCOME', label: 'Receita' },
    { code: 'TRANSFER', label: 'Transferência' },
    { code: 'CONTRIBUTION', label: 'Aporte' },
    { code: 'REDEMPTION', label: 'Resgate' },
  ]);
  const lastInputDate = ref<Date | null>(null);
  const lastInputCategoryId = ref<string | null>(null);
  const lastInputSourceId = ref<string | null>(null);

  function setCurrencyList(currencyList: Currency[]) {
    currencies.value = currencyList;
  }

  function setLastInputDate(date: Date | null) {
    lastInputDate.value = date;
  }

  function setLastInputCategoryId(categoryId: string | null) {
    lastInputCategoryId.value = categoryId;
  }

  function setLastInputSourceId(sourceId: string | null) {
    lastInputSourceId.value = sourceId;
  }

  async function getCategories() {
    if (!user?.value?.id) throw new Error('User not logged in');

    loading.value = true;

    try {
      const { data } = await useFetch<TransactionCategory[]>(`/api/users/${user.value.id}/categories`);

      if (Array.isArray(data.value)) {
        categories.value = data.value;
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      systemStore.addMessage(
        'Erro ao carregar categorias de transações.', 'Falha', 'danger', 'bi-exclamation-diamond', 3,
      );
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    currencies,
    categories,
    transactionTypes,
    lastInputDate,
    lastInputCategoryId,
    lastInputSourceId,
    setCurrencyList,
    setLastInputDate,
    setLastInputCategoryId,
    setLastInputSourceId,
    getCategories,
  };
});
