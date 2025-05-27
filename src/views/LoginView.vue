<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p class="text-gray-600 mt-2">Please sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            autocomplete="username"
            type="text"
            v-model="username"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            autocomplete="current-password"
            type="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your password"
            value=""
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
          </div>
          <a href="#" class="text-sm text-primary hover:text-primary/80">Forgot password?</a>
        </div>

        <button
          class="m-auto w-3/4 flex justify-center border border-transparent rounded-md shadow-sm text-sm font-medium hover:text-blue-500 text-red-400 bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Sign in
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <a href="#" class="font-medium hover:text-blue-500 text-red-400">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/services/auth'
import VueCookies from 'vue-cookies'
import router from '@/router'

const username = ref<string>('')
const password = ref<string>('')
const token = ref<string>('')
async function handleLogin() {
  try {
    const response = await login(username.value, password.value)
    token.value = response.token
    VueCookies.set('storepos', token.value, '1d', '', '', true)
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (e: any) {
    throw new Error(e)
  }
}
</script>
