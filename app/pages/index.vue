<script setup lang="ts">
import { useFinanceStore, type Money } from '~/stores/finance';

const financeStore = useFinanceStore();

const essentialExpenses = computed(
  () => financeStore.balances.filter(balance => balance.essentialExpenses?.amount)).value
  .map(balance => balance.essentialExpenses as Money);

const otherExpenses = computed(
  () => financeStore.balances.filter(balance => balance.otherExpenses?.amount)).value
  .map(balance => balance.otherExpenses as Money);

const investments = computed(
  () => financeStore.balances.filter(balance => balance.investments?.amount)).value
  .map(balance => balance.investments as Money);

const analyticalData = ref([
  { id: 'essential-expenses', label: 'Gastos essenciais', pct: 0.26, data: essentialExpenses },
  { id: 'other-expenses', label: 'Gastos outros', pct: 0.3, data: otherExpenses },
  { id: 'investments', label: 'Investimentos', pct: 0.4, data: investments },
]);
</script>

<template>
  <div class="container-flex p-3">
    <h1>Conta Integrada</h1>
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="card-title text-muted">Boa tarde <b>Gabriel!</b></h5>
      <div class="dropdown">
        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Janeiro de 2026
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </div>
    </div>

    <h3 class="mt-3">Saldos</h3>
    <div class="row row-cols-1 row-cols-md-4 g-3">
      <div v-for="balance in financeStore.balances" :key="balance.currency" class="col">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-2" />
              <div>
                <h4 class="mb-1">{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.currentBalance) }}</h4>
                <small class="d-flex justify-content-between align-items-center gap-2 mb-1">
                  <span>{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.income) }}</span>
                  <span>{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.expenses) }}</span>
                </small>
                <div>
                  <i class="bi bi-graph-up-arrow me-1" />{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.projectedBalance) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mt-3">Analítico</h3>
    <div class="row row-cols-1 row-cols-md-3 g-3">
      <div v-for="data in analyticalData" :key="data.id" class="col">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
              <h6 class="m-0">{{ data.label }}</h6>
              <small>{{ data.pct * 100 }}%</small>
            </div>
            <div class="d-flex align-items-top justify-content-between gap-2">
              <div v-if="data.id === 'investments'"><i class="bi bi-graph-up-arrow me-1" /><br>R$ +5,00<br> +3,09%</div>
              <small class="d-flex gap-1 flex-column">
                <span v-for="expense in data.data" :key="expense?.currency">
                  {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: expense.currency }).format(expense.amount) }}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
