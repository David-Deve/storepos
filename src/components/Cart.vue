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

  <el-dialog
    v-model="outerVisible"
    :title="`Confirm Order ID ${cartorder}`"
    width="800"
    class="dialog"
  >
    <span>{{ cartorder }}</span>
    <ul v-for="item in cart" :key="item.id">
      <div class="flex flex-col items-center text-xl">
        <div class="flex justify-center items-center gap-2">
          <p>{{ item.name }}:</p>
          <p>{{ item.qty }}</p>
          <p>${{ getItemTotal(item).toFixed(2) }}</p>
          <span v-if="item.discount && item.discount > 0" class="text-green-600 text-sm">
            ({{ item.discount }}% off)
          </span>
        </div>
        <p v-if="item.discount && item.discount > 0" class="text-sm text-green-600">
          Discount: ${{ getItemDiscount(item).toFixed(2) }}
        </p>
      </div>
    </ul>
    <p class="text-2xl">
      Total: <span class="text-green-700">${{ totalPrice.toFixed(2) }}</span>
    </p>
    <el-button type="success" class="mt-4 w-24" @click="confirmOrder(cartorder, cart)">
      <p class="font-black">Pay</p>
    </el-button>
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

  // Totals
  y += 24
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: ${formatMoney(total)}`, pageWidth - margin, y, { align: 'right' })

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
    }
    const response = await createOrderProduct(id, payload)
    console.log('Order submitted successfully:', response)
    await generateInvoicePDF(id, products)

    // Close the confirm order modal
    outerVisible.value = false

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
