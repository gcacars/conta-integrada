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
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="card-title text-alternative">Boa tarde <b>Gabriel!</b></h5>
      <PeriodPicker />
    </div>

    <h3 class="mt-4 mb-3">Saldos</h3>
    <div class="row row-cols-1 row-cols-md-4 g-3">
      <div v-for="balance in financeStore.balances" :key="balance.currency" class="col">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-2" />
              <div>
                <h4 class="mb-1">
                  {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.currentBalance) }}
                </h4>
                <small class="d-flex justify-content-between align-items-center gap-2 mb-1">
                  <span>{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.income) }}</span>
                  <span>{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.expenses) }}</span>
                </small>
                <div>
                  <i
                     class="bi bi-graph-up-arrow me-1" />{{ new Intl.NumberFormat(undefined, { style: 'currency', currency: balance.currency }).format(balance.projectedBalance) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="mt-4 mb-3">Analítico</h3>
    <div class="row row-cols-1 row-cols-md-3 g-3">
      <div v-for="data in analyticalData" :key="data.id" class="col">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-stretch justify-content-between gap-2 mb-2">
              <h6 class="m-0">{{ data.label }}</h6>
              <small>{{ data.pct * 100 }}%</small>
            </div>
            <div class="d-flex align-items-top justify-content-between gap-2">
              <div v-if="data.id === 'investments'"><i class="bi bi-graph-up-arrow me-1" /><br>R$
                +5,00<br> +3,09%</div>
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

    <h3 class="mt-4 mb-3">Cartões</h3>
    <div class="d-flex align-items-stretch gap-3">
      <div v-for="card in financeStore.cards" :key="card.number" class="card" style="width: 18rem;">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <LazyNuxtImg :src="`/icons/cards/${card.brand}.svg`" width="50" :alt="card.brand"
                         class="text-capitalize" />
            <h5 class="card-title">{{ card.number }}</h5>
          </div>
          <div class="card-text d-flex justify-content-between align-items-center mb-2">
            <h5 class="m-0">
              {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: card.current.currency }).format(card.current.amount) }}
            </h5>
            <small>{{ new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(card.expireDate) }}</small>
          </div>
          <div v-if="card.current.percentage" class="progress" role="progressbar"
               aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
               style="height: 1px">
            <div class="progress-bar" :style="{ width: `${card.current.percentage * 100}%` }" />
          </div>
        </div>
      </div>
    </div>

    <h3 class="mt-4 mb-3">Contas</h3>
    <div class="d-flex align-items-stretch gap-3">
      <div v-for="account in financeStore.accounts" :key="account.number" class="card"
           style="width: 14rem;">
        <div class="card-body">
          <div class="d-flex align-items-center mb-2">
            <LazyNuxtImg :src="`/icons/banks/${account.brand}.svg`" height="20" :alt="account.brand"
                         class="text-capitalize me-2" />
            <small class="text-capitalize">{{ account.brand }}</small>
            <h5 class="card-title ms-auto">{{ account.number }}</h5>
          </div>
          <h5 class="m-0">
            {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: account.current.currency }).format(account.current.amount) }}
          </h5>
          <small class="d-block text-success">
            +
            {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: account.current.currency }).format(account.income) }}
          </small>
          <small class="d-block text-danger">
            -
            {{ new Intl.NumberFormat(undefined, { style: 'currency', currency: account.current.currency }).format(account.expenses) }}
          </small>
        </div>
      </div>
    </div>

    <h3 class="mt-4 mb-3">Orçamentos</h3>
    <div class="d-flex align-items-stretch gap-3">
      <div class="card bg-danger-subtle">
        <div class="card-body text-center">
          <h5 class="m-0">
            <i class="bi bi-exclamation-triangle-fill" />
          </h5>
          <small style="font-size: 70%;">108%</small>
        </div>
      </div>
    </div>
  </div>
</template>
