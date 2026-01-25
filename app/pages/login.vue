<script setup lang="ts">
const { register, authenticate } = useWebAuthn({
  registerEndpoint: '/api/webauthn/register', // Default
  authenticateEndpoint: '/api/webauthn/authenticate', // Default
})
const { fetch: fetchUserSession } = useUserSession()

const userName = ref('')
async function signUp() {
  await register({ userName: userName.value })
    .then(fetchUserSession) // refetch the user session
}

async function signIn() {
  await authenticate(userName.value)
    .then(fetchUserSession) // refetch the user session
}
</script>

<template>
  <div>
    <form @submit.prevent="signUp">
      <input v-model="userName" placeholder="Email or username" />
      <button type="submit">Sign up</button>
    </form>
    <form @submit.prevent="signIn">
      <input v-model="userName" placeholder="Email or username" />
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>
