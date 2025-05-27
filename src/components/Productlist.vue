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
        <p class="font-gagalin text-2xl text-secondary">{{ product.price }}</p>
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
</script>
