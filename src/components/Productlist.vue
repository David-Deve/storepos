<template>
  <div class="grid grid-cols-3 gap-5">
    <el-card
      v-for="product in products"
      :key="product.id"
      :class="[
        'transition cursor-pointer',
        product.qty === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg',
      ]"
      @click="product.qty > 0 && $emit('add-to-cart', product)"
    >
      <h3 class="font-bold text-base mb-1">{{ product.name }}</h3>
      <p class="text-sm text-gray-600">{{ product.price }}</p>
      <p class="text-xs mt-2">
        Stock:
        <span :class="product.qty === 0 ? 'text-red-500' : 'text-green-600'">
          {{ product.qty }}
        </span>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Product } from '@/type'

defineProps<{ products: Product[] }>()
const emit = defineEmits(['add-to-cart'])
</script>
