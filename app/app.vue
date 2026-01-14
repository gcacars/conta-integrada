<script setup lang="ts">
import { useFinanceStore } from './stores/finance';

const financeStore = useFinanceStore();

await financeStore.fetchBalances();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
