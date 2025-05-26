<template>
  <div class="min-h-screen bg-gray-100 pt-20">
    <!-- Search -->
    <div class="flex justify-center mb-6">
      <el-input
        v-model="search"
        placeholder="Search for an item..."
        size="large"
        class="w-full max-w-2xl"
        :prefix-icon="Search"
        clearable
      />
    </div>

    <!-- Product Grid + Cart -->
    <div class="h-[70vh] px-6 flex gap-4">
      <!-- Product List -->
      <div class="w-2/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Products</h2>
        <Productlist :products="filteredProducts" @add-to-cart="addToCart" />
      </div>

      <!-- Cart -->
      <div class="w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <Cart
          :cart="cart"
          :products="products"
          @increase-qty="increaseQty"
          @decrease-qty="decreaseQty"
          @remove-product="removeProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import Productlist from '@/components/Productlist.vue'
import Cart from '@/components/cart.vue'
import type { CartItem, Product } from '@/type'
import { useCartStore } from '@/stores/useCartStore'
const cartStore = useCartStore()
const search = ref('')
const products = ref<Product[]>([
  { id: 1, name: 'Apple', description: 'Fresh and crisp.', qty: 3 },
  { id: 2, name: 'Banana', description: 'Sweet and soft.', qty: 5 },
  { id: 3, name: 'Cherry', description: 'Juicy and red.', qty: 0 },
  { id: 4, name: 'Mango', description: 'Tropical and delicious.', qty: 2 },
  { id: 5, name: 'Orange', description: 'Zesty and tangy.', qty: 1 },
  { id: 6, name: 'Grapes', description: 'Small and sweet.', qty: 4 },
])

const cart = ref<CartItem[]>([])

const filteredProducts = computed(() =>
  products.value.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase())),
)

function getProduct(id: number): Product | undefined {
  return products.value.find((p) => p.id === id)
}

function addToCart(product: Product) {
  if (product.qty === 0) return

  const item = cart.value.find((i) => i.id === product.id)
  if (item) {
    item.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
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
</script>
