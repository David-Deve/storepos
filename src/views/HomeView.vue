<template>
  <div class="min-h-screen bg-background">
    <!-- Header with Logo and Name -->
    <div class="px-6 pt-6 pb-4">
      <div>
        <div class="flex items-center justify-between">
          <!-- Logo and Name Section -->
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center"
            >
              <img
                src="/images/logo/logo.png"
                alt="MART 2500 Logo"
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 class="text-3xl font-bold font-kantumruy text-gray-800">ម៉ាត ២៥០០</h1>
              <p class="text-sm text-gray-700 font-gagalin">MART 2500 - Point of Sale</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <el-button type="primary" @click="goToMenu" class="font-gagalin">
              📋 View Menu
            </el-button>
            <el-button type="danger" plain @click="openLogoutModal" class="font-gagalin">
              Logout
            </el-button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex justify-center mt-4">
          <el-input
            v-model="search"
            placeholder="Search for an item..."
            size="large"
            class="w-full max-w-2xl h-14 custom-radius"
            :prefix-icon="Search"
            clearable
          />
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="px-6 pb-6 flex gap-4" style="height: calc(100vh - 220px)">
      <div class="w-2/3 bg-white rounded-3xl shadow p-4 overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4 font-gagalin">Products</h2>
        <Productlist :products="filteredProducts" @add-to-cart="addToCart" />
      </div>

      <div class="w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <Cart
          :cart="cart"
          :products="products"
          @increase-qty="increaseQty"
          @decrease-qty="decreaseQty"
          @remove-product="removeProduct"
          @apply-discount="applyDiscount"
          @clear-cart="clearCart"
        />
      </div>
    </div>
    <LogoutModal v-if="logoutVisible" @cancel="logoutVisible = false" @confirm="confirmLogout" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import Productlist from '@/components/Productlist.vue'
import Cart from '@/components/Cart.vue'
import LogoutModal from '@/components/LogoutModal.vue'
import type { CartItem, Product } from '@/type'
import { ElLoading } from 'element-plus'
import { getAllProduct } from '@/services/product'
import VueCookies from 'vue-cookies'
import router from '@/router'
import { showSuccess } from '@/lib/toast'
const search = ref('')
const products = ref<Product[]>([])
const cart = ref<CartItem[]>([])
const logoutVisible = ref(false)

function openLogoutModal() {
  logoutVisible.value = true
}

function confirmLogout() {
  VueCookies.remove('storepos')
  logoutVisible.value = false
  showSuccess('Logged out successfully. Redirecting...', { autoClose: 1200 })
  setTimeout(() => {
    router.replace('/')
  }, 1200)
}

function goToMenu() {
  router.push({ name: 'menu' })
}

async function handleGetProduct() {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    const response = await getAllProduct()
    products.value = response.data.data
    console.log(products.value)
    loading.close()
  } catch (e: any) {
    throw new Error(e)
  }
}
function getProduct(id: number): Product | undefined {
  return products.value.find((p) => p.id === id)
}

function addToCart(product: Product) {
  if (product.qty === 0) return

  const item = cart.value.find((i) => i.id === product.id)
  if (item) {
    item.qty++
  } else {
    cart.value.push({ ...product, qty: 1, price: product.price })
  }

  product.qty--
}

function increaseQty(item: CartItem) {
  const product = getProduct(item.id)
  if (!product || product.qty === 0) return

  item.qty++
  product.qty--
}

function decreaseQty(item: CartItem) {
  const product = getProduct(item.id)
  if (!product) return

  if (item.qty > 1) {
    item.qty--
    product.qty++
  } else {
    removeProduct(item)
  }
}

function removeProduct(item: CartItem) {
  const product = getProduct(item.id)
  if (product) {
    product.qty += item.qty
  }
  cart.value = cart.value.filter((p) => p.id !== item.id)
}

function applyDiscount(item: CartItem, discount: number) {
  const cartItem = cart.value.find((i) => i.id === item.id)
  if (cartItem) {
    cartItem.discount = discount
  }
}

function clearCart() {
  // Return all cart items back to product inventory
  cart.value.forEach((cartItem) => {
    const product = getProduct(cartItem.id)
    if (product) {
      product.qty += cartItem.qty
    }
  })

  // Clear the cart
  cart.value = []
}
onMounted(() => {
  handleGetProduct()
})
const filteredProducts = computed(() =>
  products.value.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>
