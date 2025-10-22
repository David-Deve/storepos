<template>
  <div class="grid grid-cols-3 gap-5">
    <el-card
      v-for="product in products"
      :key="product.id"
      :class="[
        'transition cursor-pointer card-pressable',
        product.qty === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg',
      ]"
      @click="product.qty > 0 && $emit('add-to-cart', product)"
    >
      <div class="grid grid-cols-2 gap-3 mb-5">
        <h3 class="font-gagalin text-2xl text-gray-600">Name:</h3>
        <h3 class="font-gagalin text-2xl text-secondary">{{ product.name }}</h3>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-5">
        <p class="font-gagalin text-2xl text-gray-600">price</p>
        <div>
          <p
            v-if="product.discount && isDiscountValid(product)"
            class="font-gagalin text-lg line-through text-gray-400"
          >
            ${{ product.price }}
          </p>
          <p class="font-gagalin text-2xl text-secondary">
            ${{ getDiscountedPrice(product) }}
            <span
              v-if="product.discount && isDiscountValid(product)"
              class="text-sm text-green-600"
            >
              ({{ product.discount }}% off)
            </span>
          </p>
         
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-5">
        <p class="font-gagalin text-2xl text-gray-600">Stock:</p>
        <p
          class="font-gagalin text-2xl"
          :class="product.qty === 0 ? 'text-red-500' : 'text-green-600'"
        >
          {{ product.qty }}
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Product } from '@/type'

defineProps<{ products: Product[] }>()
const emit = defineEmits(['add-to-cart'])

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
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
