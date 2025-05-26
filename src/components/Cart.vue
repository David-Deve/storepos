<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Selected Products</h2>
    <div v-if="cart.length">
      <ul>
        <li
          v-for="item in cart"
          :key="item.id"
          class="mb-3 flex justify-between items-center text-sm"
        >
          <div class="flex-1">
            <div class="font-medium">{{ item.name }}</div>
            <div class="flex items-center gap-2 mt-1">
              <el-button size="small" @click="$emit('decrease-qty', item)">-</el-button>
              <span class="w-6 text-center">{{ item.qty }}</span>
              <el-button
                size="small"
                :disabled="getProduct(item.id)?.qty === 0"
                @click="$emit('increase-qty', item)"
              >
                +
              </el-button>
            </div>
          </div>
          <el-button type="danger" size="small" plain @click="$emit('remove-product', item)">
            Remove
          </el-button>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-400 text-center mt-10 text-sm">No products selected</div>
    <el-button type="success" class="mt-4 w-full" @click="logCart"> Submit Order </el-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

import type { Product, CartItem } from '@/type.ts'

const props = defineProps<{ cart: CartItem[]; products: Product[] }>()
const emit = defineEmits(['increase-qty', 'decrease-qty', 'remove-product'])

function getProduct(id: number) {
  return props.products.find((p) => p.id === id)
}
function logCart() {
  console.log('Cart:', props.cart)
}
</script>
