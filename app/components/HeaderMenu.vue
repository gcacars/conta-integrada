<script setup lang="ts">
const menuItems = [
  { name: 'Início', link: '/' },
  { name: 'Transações', link: '/transactions' },
  { name: 'Investimentos', link: '/investments' },
  { name: 'Orçamento', link: '/budget' },
];

onMounted(async () => {
  const { Dropdown } = await import('bootstrap');

  await nextTick();

  // Initialize Bootstrap dropdowns
  const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
  [...dropdownElementList].map(el => new Dropdown(el));
});
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-transparent border-bottom border-primary">
    <div class="container-fluid justify-content-center">
      <a class="navbar-brand text-primary" href="#">Conta Integrada</a>
      <div class="mx-auto">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="menu in menuItems" :key="menu.link" class="nav-item">
            <NuxtLink class="nav-link active" aria-current="page" :to="menu.link"
                      exact-active-class="active">
              {{ menu.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <AuthState>
        <template #default="{ loggedIn, clear, user }">
          <div v-if="loggedIn" class="dropdown text-end"> 
            <a href="#"
              class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
              {{ user?.name }}
              </a>
            <ul class="dropdown-menu dropdown-menu-end text-small" style="">
              <li><a class="dropdown-item" href="#">New project...</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <button type="button" class="dropdown-item text-danger fw-bold" @click="clear">
                  <i class="bi bi-box-arrow-right me-1" /> Sair
                </button>
              </li>
            </ul>
          </div>
          <NuxtLink v-else to="/login" class="btn btn-primary">Entrar</NuxtLink>
        </template>
        <template #placeholder>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Verificando sessão...</span>
          </div>
        </template>
      </AuthState>
    </div>
  </nav>
</template>
