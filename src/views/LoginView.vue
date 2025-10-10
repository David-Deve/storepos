<template>
  <div class="login-page">
    <div class="container">
      <div class="col left">
        <div class="brand">
          <div class="logo" aria-hidden="true">POS</div>
          <h1 class="title">Welcome back</h1>
          <p class="subtitle">Sign in to continue to your point of sale</p>
        </div>

        <div class="card">
          <form class="form" @submit.prevent="onSubmit">
            <label class="field">
              <span class="label">Name</span>
              <input
                v-model="name"
                type="text"
                placeholder="Enter your name"
                autocomplete="username"
                class="input"
                @blur="nameTouched = true"
              />
              <p v-if="nameError()" class="text-xs text-red-600 mt-1">{{ nameError() }}</p>
            </label>

            <label class="field">
              <span class="label">Password</span>
              <div class="password">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  class="input"
                  @blur="passwordTouched = true"
                />
                <button type="button" class="toggle" @click="showPassword = !showPassword">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <p v-if="passwordError()" class="text-xs text-red-600 mt-1">{{ passwordError() }}</p>
            </label>

            <button type="submit" class="submit" :disabled="!!nameError() || !!passwordError()">
              Sign in
            </button>

            <div class="hint">Cashier login.</div>
          </form>
        </div>
      </div>

      <div class="col right">
        <img src="/images/login.png" alt="Login illustration" class="illustration" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth'
import VueCookies from 'vue-cookies'
import { showSuccess, showError } from '@/lib/toast'

const router = useRouter()

const name = ref('')
const password = ref('')
const showPassword = ref(false)
const nameTouched = ref(false)
const passwordTouched = ref(false)

const nameError = () => {
  if (!nameTouched.value && name.value === '') return ''
  if (!name.value) return 'Name is required.'
  return ''
}

const passwordError = () => {
  if (!passwordTouched.value && password.value === '') return ''
  if (!password.value) return 'Password is required.'
  if (password.value.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

async function onSubmit() {
  try {
    nameTouched.value = true
    passwordTouched.value = true
    if (nameError() || passwordError()) {
      return
    }
    const res = await login(name.value, password.value)
    const token = res.token
    if (token) {
      ;(VueCookies as any).set('storepos', token, '1d', '', '', true)
      showSuccess('Login successful! Redirecting...', { autoClose: 1200 })
      setTimeout(() => {
        router.replace({ name: 'home' })
      }, 1200)
    }
  } catch (e) {
    showError('Login failed. Please check your credentials.')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #ffffff;
  display: grid;
  place-items: center;
  padding: 24px;
}

.container {
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.col.left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.col.right {
  display: grid;
  place-items: center;
}

.card {
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 24px;
  color: #0f172a;
}

.brand {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 70px;
  height: 70px;
  margin: 0 auto 8px;
  display: grid;
  place-items: center;
  font-size: 23px;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 1px;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0 2px;
}

.subtitle {
  color: #aab0c0;
  font-size: 13px;
}

.form {
  display: grid;
  gap: 14px;
  margin-top: 10px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #475569;
}

.input {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: #0f172a;
  padding: 0 12px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.input::placeholder {
  color: #94a3b8;
}
.input:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  background: #ffffff;
}

.password {
  position: relative;
}

.toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: rgba(15, 23, 42, 0.04);
  color: #0f172a;
  cursor: pointer;
}

.toggle:hover {
  background: rgba(15, 23, 42, 0.08);
}

.submit {
  margin-top: 6px;
  height: 46px;
  border-radius: 10px;
  border: 0;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.2px;
  cursor: pointer;
  box-shadow:
    0 8px 24px rgba(34, 197, 94, 0.22),
    0 8px 24px rgba(59, 130, 246, 0.18);
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.submit:hover {
  filter: brightness(1.05);
}

.submit:active {
  transform: translateY(1px);
}

.hint {
  text-align: center;
  margin-top: 10px;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
  .col.right {
    order: -1;
    margin-bottom: 16px;
  }
}

.illustration {
  width: 100%;
  max-width: 460px;
  height: auto;
  object-fit: contain;
}
</style>
