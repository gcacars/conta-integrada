export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession()

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  const $route = useRoute()

  // if the user is already logged in, redirect away from the login page
  if ($route.path === '/login') {
    return navigateTo('/')
  }

  const appStore = useAppStore()
  appStore.setLastInputDate(null)
  appStore.setLastInputCategoryId(null)
  appStore.setLastInputSourceId(null)

  await callOnce('categories', () => appStore.getCategories())
})
