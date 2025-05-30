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
    <el-button v-if="cart.length" type="success" class="mt-4 w-full" @click="createCart()">
      <p class="font-gagalin font-black">Submit order</p>
    </el-button>
  </div>

  <el-dialog
    v-model="outerVisible"
    :title="`Confirm Order ID ${cartorder}`"
    width="800"
    class="dialog"
  >
    <span>{{ cartorder }}</span>
    <ul v-for="item in cart" :key="item.id">
      <div class="flex justify-center items-center gap-2 text-xl">
        <p>{{ item.name }}:</p>
        <p>{{ item.qty }}</p>
        <p>{{ item.price }}</p>
      </div>
    </ul>
    <p class="text-2xl">
      Total: <span class="text-green-700">{{ totalPrice }}$</span>
    </p>
    <el-button type="success" class="mt-4 w-24" @click="confirmOrder(cartorder, cart)">
      <p class="font-black">Pay</p>
    </el-button>
  </el-dialog>

  <div
    ref="invoiceRef"
    id="invoice"
    class="p-6 bg-white text-black w-[600px] absolute -left-[9999px]"
  >
    <h2 class="text-xl font-bold mb-2">Invoice</h2>
    <p>Order ID: {{ cartorder }}</p>
    <p>Date: {{ new Date().toLocaleString() }}</p>

    <ul class="my-4">
      <li v-for="item in cart" :key="item.id" class="flex justify-between text-base">
        <span>{{ item.name }} x{{ item.qty }}</span>
        <span>${{ parseFloat(item.price) * item.qty }}</span>
      </li>
    </ul>

    <div class="text-right font-bold mt-2">Total: ${{ totalPrice }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/type.ts'
import { defineProps, defineEmits, ref, computed } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { createOrder } from '@/services/cart'
import { createOrderProduct } from '@/services/order'
const outerVisible = ref(false)
const invoiceRef = ref<HTMLElement | null>(null)
const cartorder = ref<number | any>()
const props = defineProps<{ cart: Product[]; products: Product[] }>()
const emit = defineEmits(['increase-qty', 'decrease-qty', 'remove-product'])

function getProduct(id: number) {
  return props.products.find((p) => p.id === id)
}
async function generateInvoicePDF() {
  if (!invoiceRef.value) return

  const canvas = await html2canvas(invoiceRef.value)
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF()
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save('invoice.pdf')
}

async function createCart() {
  try {
    const response = await createOrder('general_customer')
    cartorder.value = response.order.id
  } catch (e: any) {
    throw new Error(e)
  }
  outerVisible.value = true
  console.log('Cart:', props.cart)
}
async function confirmOrder(id: number, products: any[]) {
  try {
    const payload = {
      products: products.map((p) => ({
        product_id: p.id,
        qty: p.qty,
        price: parseFloat(p.price),
      })),
    }
    const response = await createOrderProduct(id, payload)
    console.log('Order submitted successfully:', response)
    await generateInvoicePDF()
    setTimeout(() => {
      window.location.reload()
    }, 1500) // wait for PDF to generate before reload
  } catch (e: any) {
    console.error('Order submission failed:', e)
    throw new Error(e)
  }
}

const totalPrice = computed(() => {
  console.log(props.cart, props.products)
  return props.cart.reduce((acc, item) => {
    const product = getProduct(item.id)
    return acc + (product ? product.price * item.qty : 0)
  }, 0)
})
</script>
