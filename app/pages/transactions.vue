<script setup lang="ts">
import rawData from '../transactions.json'; // with { type: 'json' };

definePageMeta({
  middleware: ['authenticated'],
});

const selectedTx = ref<string | null>(null);

interface OrganizzeTransaction {
  hasMoreItems: boolean;
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amountInCents: number;
    done: boolean;
  }>;
}

type TxItem = OrganizzeTransaction['transactions'][number];

const transactions = (rawData as OrganizzeTransaction).transactions as TxItem[];

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
    <div class="d-flex align-items-center">
      <h4 class="text-uppercase font-monospace text-muted">Transações</h4>
      <span class="text-muted ms-auto me-4">{{ transactions.length }} transações</span>
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="Second group">
          <button type="button" class="btn btn-outline-alternative" @click="selectedTx = 'new'">
            <i class="bi bi-dash-lg" />
          </button>
          <button type="button" class="btn btn-outline-alternative">
            <i class="bi bi-plus-lg" />
          </button>
          <button type="button" class="btn btn-outline-alternative">
            <i class="bi bi-shuffle" />
          </button>
          <button type="button" class="btn btn-outline-alternative">
            <i class="bi bi-funnel-fill" />
          </button>
          <button type="button" class="btn btn-outline-alternative" title="Importar transações">
            <i class="bi bi-upload" />
          </button>
        </div>
        <div class="btn-group dropdown" role="group" aria-label="Third group">
          <button type="button" class="btn btn-outline-alternative">
            <i class="bi bi-chevron-left" />
          </button>
          <PeriodPicker />
          <button type="button" class="btn btn-outline-alternative">
            <i class="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </div>

    <div v-for="tx in groupedTransactions" :key="tx.date" class="mt-4">
      <h5 class="mb-3">
        {{ new Date(`${tx.date}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'long' }) }}</h5>
      <div class="list-group bg-white shadow-sm">
        <div v-for="item in tx.items" :key="item.id"
             class="list-group-item d-flex justify-content-between align-items-center bg-transparent border border-2 border-top-0 border-end-0 border-bottom-0"
             :class="{
               'border-danger': !item.done && new Date(`${item.date}T00:00:00`).getTime() < Date.now() && item.amountInCents < 0,
               'border-warning': !item.done && new Date(`${item.date}T00:00:00`).getTime() < Date.now() && item.amountInCents > 0,
               'border-success': item.done,
             }">
          <div>
            <h6 class="mb-1">{{ item.description }}</h6>
            <small class="text-muted">{{ relativeTimeHelper(new Date(`${item.date}T00:00:00`)) }}</small>
          </div>
          <span :class="item.amountInCents < 0 ? 'text-danger' : 'text-success'">
            {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(item.amountInCents / 100) }}
          </span>
        </div>
      </div>
    </div>
    <CanvasTransaction v-if="selectedTx" :id="selectedTx" @close="selectedTx = null" />
  </LayoutPage>
</template>
