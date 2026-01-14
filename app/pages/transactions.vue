<script setup lang="ts">
import rawData from '../transactions.json' with { type: 'json' };

interface Transaction {
  hasMoreItems: boolean;
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amountInCents: number;
  }>;
}

type TxItem = Transaction['transactions'][number];

const transactions = (rawData as Transaction).transactions as TxItem[];

const groupedTransactions = computed(() => {
  const map = transactions.reduce((acc: Record<string, TxItem[]>, tx) => {
    const d = tx.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(tx);
    return acc;
  }, {} as Record<string, TxItem[]>);

  return Object.keys(map)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map(date => ({ date, items: map[date] }));
});
</script>

<template>
  <LayoutPage>
    <div class="d-flex justify-content-between align-items-center">
      <h2>Transações</h2>
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="Second group">
          <button type="button" class="btn btn-secondary">
            <i class="bi bi-funnel-fill" />
          </button>
          <button type="button" class="btn btn-secondary">6</button>
          <button type="button" class="btn btn-secondary" title="Importar transações">
            <i class="bi bi-upload" />
          </button>
        </div>
        <div class="btn-group dropdown" role="group" aria-label="Third group">
          <button type="button" class="btn btn-secondary">
            <i class="bi bi-chevron-left" />
          </button>
          <PeriodPicker />
          <button type="button" class="btn btn-secondary">
            <i class="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </div>

    <div v-for="tx in groupedTransactions" :key="tx.date" class="mt-4">
      <h5 class="mb-3">{{ new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) }}</h5>
      <div class="list-group">
        <div v-for="item in tx.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">{{ item.description }}</h6>
            <small class="text-muted">{{ new Date(item.date).toLocaleDateString() }}</small>
          </div>
          <span :class="item.amountInCents < 0 ? 'text-danger' : 'text-success'">
            {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(item.amountInCents / 100) }}
          </span>
        </div>
      </div>
    </div>
  </LayoutPage>
</template>
