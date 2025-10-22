<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-gagalin text-gray-800 mb-4">Our Menu</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Discover our delicious selection of products</p>
      </div>
      
      <!-- Search Bar -->
      <div class="max-w-xl mx-auto mt-6">
        <el-input
          v-model="search"
          placeholder="Search for an item..."
          size="large"
          class="w-full h-14 custom-radius"
          :prefix-icon="Search"
          clearable
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Products Grid -->
    <div v-else class="max-w-7xl mx-auto">
      <transition-group 
        name="product-list" 
        tag="div" 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <!-- Product Image -->
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img 
              :src="product.image || 'https://via.placeholder.com/300x200?text=Product+Image'" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          
          <!-- Product Info -->
          <div class="p-5">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-gagalin text-xl text-gray-800 truncate">{{ product.name }}</h3>
              <div 
                v-if="product.discount && isDiscountValid(product)" 
                class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                -{{ product.discount }}%
              </div>
            </div>
            
            <!-- Price Section -->
            <div class="mb-3">
              <div class="flex items-center gap-2">
                <p 
                  v-if="product.discount && isDiscountValid(product)" 
                  class="text-sm line-through text-gray-400"
                >
                  ${{ product.price }}
                </p>
                <p class="font-gagalin text-2xl text-secondary">
                  ${{ getDiscountedPrice(product) }}
                </p>
              </div>
              <p v-if="product.discount && isDiscountValid(product)" class="text-xs text-green-600">
                Sale ends: {{ formatExpiryDate(product.discount_expired_at) }}
              </p>
            </div>
            
            <!-- Stock Status -->
            <div class="flex items-center justify-between">
              <span 
                class="px-2 py-1 text-xs rounded-full font-medium"
                :class="product.qty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ product.qty > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
              <span class="text-sm text-gray-600">
                {{ product.qty }} available
              </span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">😕</div>
        <h3 class="text-2xl font-gagalin text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500">Try adjusting your search criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { Product } from '@/type'
import { getAllProduct } from '@/services/product'
import { ElLoading } from 'element-plus'

const search = ref('')
const products = ref<Product[]>([])
const loading = ref(true)

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
.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.5s ease;
}
.product-list-enter-from,
.product-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.product-card {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card:nth-child(odd) {
  animation-delay: 0.1s;
}

.product-card:nth-child(even) {
  animation-delay: 0.2s;
}
</style>