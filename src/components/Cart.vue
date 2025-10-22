<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold font-gagalin">Selected Products</h2>
      <el-button
        v-if="cart.length"
        type="danger"
        size="default"
        plain
        @click="$emit('clear-cart')"
        class="font-gagalin"
      >
        Clear All
      </el-button>
    </div>
    <div v-if="cart.length">
      <ul>
        <li v-for="item in cart" :key="item.id" class="mb-3 text-sm">
          <div class="flex justify-between items-center">
            <div class="grid grid-cols-4 gap-3 w-full">
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

              <div class="flex items-center gap-2">
                <el-button
                  class="buttonremove"
                  size="small"
                  plain
                  @click="$emit('remove-product', item)"
                >
                  <p class="font-gagalin text-black">Remove</p>
                </el-button>
              </div>

              <div class="text-right">
                <p class="text-lg font-gagalin">${{ getItemTotal(item).toFixed(2) }}</p>
                <p v-if="item.discount && item.discount > 0" class="text-sm text-green-600">
                  Save: ${{ getItemDiscount(item).toFixed(2) }}
                </p>
              </div>
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

  <el-dialog v-model="outerVisible" width="900" :show-close="false" class="dialog">
    <template #header>
      <div class="flex items-center justify-between w-full pr-4">
        <div>
          <h3 class="text-2xl font-bold text-gray-800 font-gagalin">Order Confirmation</h3>
          <p class="text-sm text-gray-500 mt-1">
            Order #{{ cartorder }} • {{ new Date().toLocaleString() }}
          </p>
        </div>
        <el-button circle @click="outerVisible = false" class="hover:bg-gray-100"> ✕ </el-button>
      </div>
    </template>

    <!-- Order Items -->
    <div class="max-h-96 overflow-y-auto mb-6">
      <div
        v-for="item in cart"
        :key="item.id"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-3 hover:shadow-sm transition-shadow"
      >
        <div class="flex-1">
          <p class="font-semibold text-gray-800 font-gagalin">{{ item.name }}</p>
          <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>Qty: {{ item.qty }}</span>
            <span>•</span>
            <span>${{ getProduct(item.id)?.price }} each</span>
            <span
              v-if="item.discount && item.discount > 0"
              class="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium"
            >
              {{ item.discount }}% OFF
            </span>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold text-gray-900 font-gagalin">
            ${{ getItemTotal(item).toFixed(2) }}
          </p>
          <p v-if="item.discount && item.discount > 0" class="text-xs text-green-600">
            Saved ${{ getItemDiscount(item).toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Total Section -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100"
    >
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-700 font-gagalin">Total Amount</span>
        <span class="text-3xl font-bold text-blue-600 font-gagalin"
          >${{ totalPrice.toFixed(2) }}</span
        >
      </div>
    </div>

    <!-- Payment Section -->
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h4 class="text-lg font-semibold text-gray-800 mb-4 font-gagalin">Payment Details</h4>

      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <label class="text-base font-medium text-gray-700 font-gagalin">Cash Received</label>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-700">$</span>
            <el-input-number
              v-model="cashReceived"
              :min="0"
              :precision="2"
              :step="10"
              size="large"
              class="w-48"
              :controls-position="'right'"
            />
          </div>
        </div>

        <div
          class="flex items-center justify-between p-4 bg-white rounded-lg border-2"
          :class="returnMoney >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
        >
          <span class="text-base font-medium text-gray-700 font-gagalin">Change Due</span>
          <span
            :class="[
              'text-2xl font-bold font-gagalin',
              returnMoney >= 0 ? 'text-green-600' : 'text-red-600',
            ]"
          >
            ${{ Math.abs(returnMoney).toFixed(2) }}
          </span>
        </div>

        <div
          v-if="insufficientCash"
          class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <span class="text-red-600">⚠️</span>
          <span class="text-red-600 text-sm font-medium">
            Insufficient payment. Need ${{ Math.abs(returnMoney).toFixed(2) }} more.
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button size="large" @click="outerVisible = false" class="px-6 font-gagalin">
          Cancel
        </el-button>
        <el-button
          type="success"
          size="large"
          :disabled="insufficientCash"
          @click="confirmOrder(cartorder, cart)"
          class="px-8 font-gagalin"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg">✓</span>
            <span class="font-semibold">Confirm & Pay</span>
          </div>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Product, CartItem } from '@/type.ts'
import { defineProps, defineEmits, ref, computed } from 'vue'
import jsPDF from 'jspdf'
import { createOrder } from '@/services/cart'
import { createOrderProduct } from '@/services/order'

const outerVisible = ref(false)
const cartorder = ref<number | any>()
const cashReceived = ref<number>(0)
const returnMoney = computed(() => {
  return cashReceived.value - totalPrice.value
})
const insufficientCash = computed(() => {
  return cashReceived.value < totalPrice.value
})

const props = defineProps<{ cart: CartItem[]; products: Product[] }>()
const emit = defineEmits(['increase-qty', 'decrease-qty', 'remove-product', 'clear-cart'])

function getProduct(id: number) {
  return props.products.find((p) => p.id === id)
}

function isDiscountValid(product: Product): boolean {
  if (!product.discount || !product.discount_expired_at) return false
  return new Date(product.discount_expired_at) > new Date()
}

function getItemTotal(item: CartItem): number {
  const product = getProduct(item.id)
  if (!product) return 0
  const originalPrice = parseFloat(product.price) * item.qty
  if (product.discount && isDiscountValid(product)) {
    return originalPrice * (1 - product.discount / 100)
  }
  return originalPrice
}

function getItemDiscount(item: CartItem): number {
  const product = getProduct(item.id)
  if (!product || !product.discount || !isDiscountValid(product)) return 0
  const originalPrice = parseFloat(product.price) * item.qty
  return originalPrice * (product.discount / 100)
}
function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`
}

async function generateInvoicePDF(orderId: number, cartItems: CartItem[]) {
  if (!orderId || !cartItems.length) return
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Invoice', margin, y)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  y += 20
  doc.text(`Order ID: ${orderId}`, margin, y)
  y += 16
  const createdAt = new Date()
  doc.text(`Date: ${createdAt.toLocaleString()}`, margin, y)

  // Header row
  y += 30
  doc.setFont('helvetica', 'bold')
  doc.text('Item', margin, y)
  doc.text('Qty', pageWidth - margin - 180, y)
  doc.text('Discount', pageWidth - margin - 120, y)
  doc.text('Price', pageWidth - margin - 30, y)

  doc.setFont('helvetica', 'normal')
  y += 8
  doc.line(margin, y, pageWidth - margin, y)

  let total = 0
  cartItems.forEach((item) => {
    const qty = Number(item.qty || 0)
    const price = getItemTotal(item) // Use the same calculation as the cart
    total += price
    y += 22
    doc.text(String(item.name || ''), margin, y)
    doc.text(String(qty), pageWidth - margin - 180, y)
    doc.text(String(item.discount || 0) + '%', pageWidth - margin - 120, y)
    doc.text(formatMoney(price), pageWidth - margin - 30, y)
  })

  // Payment Details
  y += 40
  doc.line(margin, y - 16, pageWidth - margin, y - 16)

  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: ${formatMoney(total)}`, pageWidth - margin - 110, y)

  y += 20
  doc.setFont('helvetica', 'normal')
  doc.text(`Cash Received: ${formatMoney(cashReceived.value)}`, pageWidth - margin - 114, y)

  y += 20
  const returnMoneyAmount = cashReceived.value - total
  doc.text(`Return Money: ${formatMoney(returnMoneyAmount)}`, pageWidth - margin - 110, y)

  const filename = `invoice_${orderId}.pdf`
  doc.save(filename)
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
    if (insufficientCash.value) {
      throw new Error('Insufficient cash received')
    }

    const payload = {
      products: products.map((p) => {
        const product = getProduct(p.id)
        return {
          product_id: p.id,
          qty: p.qty,
          price: getItemTotal(p),
          discount: product && isDiscountValid(product) ? product.discount : 0,
        }
      }),
      cash_received: cashReceived.value,
    }

    const response = await createOrderProduct(id, payload)
    console.log('Order submitted successfully:', response)

    // Update PDF generation to include payment details
    await generateInvoicePDF(id, products)

    // Close the confirm order modal
    outerVisible.value = false

    // Reset cash received
    cashReceived.value = 0

    // Clear all items from cart
    emit('clear-cart')
  } catch (e: any) {
    console.error('Order submission failed:', e)
    throw new Error(e)
  }
}

const totalPrice = computed(() => {
  console.log(props.cart, props.products)
  return props.cart.reduce((acc, item) => {
    return acc + getItemTotal(item)
  }, 0)
})
</script>
