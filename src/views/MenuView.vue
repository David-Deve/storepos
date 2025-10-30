<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header Section with Back Button -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <el-button type="primary" plain @click="goBack" class="font-gagalin" size="large">
              ← Back to POS
            </el-button>
            <div class="border-l border-gray-300 h-8"></div>
            <div>
              <h1 class="text-2xl md:text-3xl font-gagalin text-gray-800">📋 Our Menu</h1>
              <p class="text-sm text-gray-500 mt-0.5">Browse our complete product catalog</p>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="w-full max-w-md">
            <el-input
              v-model="search"
              placeholder="Search products..."
              size="large"
              class="custom-radius"
              :prefix-icon="Search"
              clearable
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📦</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Products</p>
              <p class="text-2xl font-gagalin text-gray-800">{{ products.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">✅</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">In Stock</p>
              <p class="text-2xl font-gagalin text-gray-800">{{ inStockCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🏷️</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">On Sale</p>
              <p class="text-2xl font-gagalin text-gray-800">{{ onSaleCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Products Grid -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <transition-group
        name="product-list"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200"
        >
          <!-- Product Image -->
          <div class="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              :src="product.image || 'https://via.placeholder.com/400x300?text=Product'"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <!-- Discount Badge -->
            <div
              v-if="product.discount && isDiscountValid(product)"
              class="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse"
            >
              -{{ product.discount }}%
            </div>
            <!-- Stock Badge -->
            <div
              class="absolute top-3 left-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow-md backdrop-blur-sm"
              :class="product.qty > 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'"
            >
              {{ product.qty > 0 ? '✓ In Stock' : '✗ Out of Stock' }}
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-5">
            <!-- Product Name -->
            <h3
              class="font-gagalin text-lg text-gray-800 mb-3 truncate group-hover:text-blue-600 transition-colors"
            >
              {{ product.name }}
            </h3>

            <!-- Price Section -->
            <div class="mb-4">
              <div class="flex items-baseline gap-2 mb-1">
                <p class="font-gagalin text-3xl text-blue-600 font-bold">
                  ${{ getDiscountedPrice(product) }}
                </p>
                <p
                  v-if="product.discount && isDiscountValid(product)"
                  class="text-sm line-through text-gray-400"
                >
                  ${{ product.price }}
                </p>
              </div>
              <p
                v-if="product.discount && isDiscountValid(product)"
                class="text-xs text-green-600 font-medium"
              >
                💰 Save ${{
                  (parseFloat(product.price) - parseFloat(getDiscountedPrice(product))).toFixed(2)
                }}
                • Ends {{ formatExpiryDate(product.discount_expired_at) }}
              </p>
            </div>

            <!-- Stock Count -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-sm text-gray-500 font-medium"> Available: </span>
              <span
                class="text-lg font-gagalin"
                :class="product.qty > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ product.qty }} units
              </span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-20">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
          <div class="text-7xl mb-6">🔍</div>
          <h3 class="text-2xl font-gagalin text-gray-800 mb-3">No products found</h3>
          <p class="text-gray-500 mb-6">We couldn't find any products matching "{{ search }}"</p>
          <el-button type="primary" @click="search = ''" class="font-gagalin">
            Clear Search
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { Product } from '@/type'
import { getAllProduct } from '@/services/product'
import { ElLoading } from 'element-plus'

const router = useRouter()
const search = ref('')
const products = ref<Product[]>([])
const loading = ref(true)

function goBack() {
  router.push({ name: 'home' })
}

const inStockCount = computed(() => products.value.filter((p) => p.qty > 0).length)
const onSaleCount = computed(
  () => products.value.filter((p) => p.discount && isDiscountValid(p)).length,
)

async function fetchProducts() {
  try {
    loading.value = true
    const response = await getAllProduct()
    products.value = response.data.data
    loading.value = false
  } catch (e: any) {
    console.error('Error fetching products:', e)
    loading.value = false
  }
}

function isDiscountValid(product: Product): boolean {
  if (!product.discount || !product.discount_expired_at) return false
  return new Date(product.discount_expired_at) > new Date()
}

function getDiscountedPrice(product: Product): string {
  if (!product.discount || !isDiscountValid(product)) {
    return product.price
  }
  const price = parseFloat(product.price)
  const discountedPrice = price * (1 - product.discount / 100)
  return discountedPrice.toFixed(2)
}

function formatExpiryDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const filteredProducts = computed(() =>
  products.value.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase())),
)

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* List transitions */
.product-list-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-list-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
}

.product-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.product-list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* Product card animations */
.product-card {
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation delays */
.product-card:nth-child(1) {
  animation-delay: 0.05s;
}
.product-card:nth-child(2) {
  animation-delay: 0.1s;
}
.product-card:nth-child(3) {
  animation-delay: 0.15s;
}
.product-card:nth-child(4) {
  animation-delay: 0.2s;
}
.product-card:nth-child(5) {
  animation-delay: 0.25s;
}
.product-card:nth-child(6) {
  animation-delay: 0.3s;
}
.product-card:nth-child(7) {
  animation-delay: 0.35s;
}
.product-card:nth-child(8) {
  animation-delay: 0.4s;
}

/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
