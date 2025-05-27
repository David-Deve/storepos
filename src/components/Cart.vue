<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 font-gagalin">Selected Products</h2>
    <div v-if="cart.length">
      <ul>
        <li v-for="item in cart" :key="item.id" class="mb-3 text-sm">
          <div class="flex justify-between items-center">
            <div class="grid grid-cols-3 gap-5 w-full">
              <div class="bg-background w-50 h-10 flex items-center justify-center rounded-xl">
                <p class="text-xl font-gagalin">{{ item.name }}</p>
              </div>

              <div class="flex items-center gap-2">
                <el-button class="buttoninc" size="small" @click="$emit('decrease-qty', item)">
                  <p class="text-xl font-gagalin">-</p>
                </el-button>
                <span class="text-xl text-center font-gagalin">{{ item.qty }}</span>
                <el-button
                  class="buttoninc"
                  size="small"
                  :disabled="getProduct(item.id)?.qty === 0"
                  @click="$emit('increase-qty', item)"
                >
                  <p class="text-xl font-gagalin">+</p>
                </el-button>
              </div>

              <el-button
                class="buttonremove"
                size="small"
                plain
                @click="$emit('remove-product', item)"
              >
                <p class="font-gagalin text-black">Remove</p>
              </el-button>
            </div>
          </div>

          <!-- HR goes here, outside the grid -->
          <hr class="my-3 border-t border-gray-300" />
        </li>
        <div class="flex justify-around items-center font-gagalin">
          <p>total :</p>
          <p>{{ totalPrice }} $</p>
        </div>
      </ul>
    </div>
    <div v-else class="text-gray-400 text-center mt-10 text-sm font-gagalin">
      No products selected
    </div>
    <el-button v-if="cart.length" type="success" class="mt-4 w-full" @click="logCart">
      <p class="font-gagalin font-black">Submit order</p>
    </el-button>
  </div>

  <el-dialog v-model="outerVisible" title="Confirm Order" width="800" class="font-gagalin">
    <span>This is the outer Dialog</span>
    <el-dialog v-model="innerVisible" width="500" title="Inner Dialog" append-to-body>
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="innerVisible = true"> Open the inner Dialog </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Product, CartItem } from '@/type.ts'
import { defineProps, defineEmits, ref, computed } from 'vue'
const outerVisible = ref(false)
const innerVisible = ref(false)

const props = defineProps<{ cart: CartItem[]; products: Product[] }>()
const emit = defineEmits(['increase-qty', 'decrease-qty', 'remove-product'])

function getProduct(id: number) {
  return props.products.find((p) => p.id === id)
}
function logCart() {
  outerVisible.value = true
  console.log('Cart:', props.cart)
}
const totalPrice = computed(() => {
  console.log(props.cart)
  return props.cart.reduce((acc, item) => {
    const product = getProduct(item.id)
    return acc + (product ? product.price * item.qty : 0)
  }, 0)
})
</script>
