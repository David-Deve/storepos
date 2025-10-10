<template>
  <div class="min-h-screen bg-background pt-20">
    <div class="flex justify-between items-center mb-6 px-6">
      <div class="flex-1 flex justify-center">
        <el-input
          v-model="search"
          placeholder="Search for an item..."
          size="large"
          class="w-full max-w-2xl h-14 custom-radius"
          :prefix-icon="Search"
          clearable
        />
      </div>
      <el-button type="danger" plain @click="openLogoutModal">Logout</el-button>
    </div>

    <div class="h-[70vh] px-6 flex gap-4">
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
