import useSystemStore from "~/stores/systemStore"

export default defineNuxtPlugin((nuxtApp) => {
  const { session } = useUserSession()

  const api = $fetch.create({
    baseURL: 'http://localhost:3000/api',
    onRequest({ request, options, error }) {
      options.headers.set('X-Correlation-ID', crypto.randomUUID())
      options.headers.set('X-User-ID', session.value?.id || '')

      if (error) console.error('API Request Error:', error)
    },
    async onResponseError({ response, error }) {
      const systemStore = useSystemStore()

      if (response.status === 401) {
        await nuxtApp.runWithContext(() => {
          navigateTo('/login')

          systemStore.addMessage(
            'Sua sessão expirou. Por favor, faça login novamente.',
            'Sessão Expirada',
            'warning', 
            'bi-exclamation-triangle-fill', 
            5)
        })
      } else {
        console.warn('API Response Error:', error)
        systemStore.addMessage(
          `Erro ${response.status}: ${error?.message || 'Ocorreu um erro ao processar sua solicitação.'}`,
          error?.name || 'Erro de API',
          'danger',
          'bi-bug-fill',
          5
        )
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
