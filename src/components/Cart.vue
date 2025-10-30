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
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 40
  let y = 50

  // INVOICE header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  doc.setTextColor(30, 41, 84) // Dark blue color
  doc.text('INVOICE', margin, y)

  // Company information
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  y += 25
  doc.text('MART 2500', margin, y)
  y += 14
  doc.setFontSize(9)
  doc.text('Nearest to Norton University', margin, y)
  y += 12
  doc.text('Phnom Penh, Cambodia', margin, y)

  // Add logo (top right) - after text to avoid overlap
  try {
    const logoImg = new Image()
    logoImg.src = '/images/logo/logo.png'
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve
      logoImg.onerror = resolve // Continue even if logo fails
      setTimeout(resolve, 1000) // Timeout after 1 second
    })
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const logoSize = 70
      doc.addImage(logoImg, 'PNG', pageWidth - margin - logoSize, 35, logoSize, logoSize)
    }
  } catch (e) {
    console.log('Logo not loaded, continuing without it')
  }

  // Invoice details (right side)
  let rightY = 120
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE #', pageWidth - 160, rightY)
  doc.setFont('helvetica', 'normal')
  doc.text(`US-${String(orderId).padStart(3, '0')}`, pageWidth - margin, rightY, {
    align: 'right',
  })

  rightY += 18
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE DATE', pageWidth - 160, rightY)
  doc.setFont('helvetica', 'normal')
  const invoiceDate = new Date()
  doc.text(formatDateForInvoice(invoiceDate), pageWidth - margin, rightY, { align: 'right' })

  rightY += 18
  doc.setFont('helvetica', 'bold')
  doc.text('P.O.#', pageWidth - 160, rightY)
  doc.setFont('helvetica', 'normal')
  doc.text(`${orderId}/2025`, pageWidth - margin, rightY, { align: 'right' })

  rightY += 18
  doc.setFont('helvetica', 'bold')
  doc.text('DUE DATE', pageWidth - 160, rightY)
  doc.setFont('helvetica', 'normal')
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + 15) // 15 days from invoice date
  doc.text(formatDateForInvoice(dueDate), pageWidth - margin, rightY, { align: 'right' })

  // Table header
  y = 220
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, y - 12, pageWidth - 2 * margin, 20, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('QTY', margin + 5, y)
  doc.text('DESCRIPTION', margin + 60, y)
  doc.text('UNIT PRICE', pageWidth - margin - 120, y)
  doc.text('AMOUNT', pageWidth - margin - 5, y, { align: 'right' })

  // Table line
  y += 8
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)

  // Products
  let subtotal = 0
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  cartItems.forEach((item) => {
    y += 20
    const qty = Number(item.qty || 0)
    const lineTotal = getItemTotal(item) // Total for this line
    const unitPrice = lineTotal / qty // Get unit price
    subtotal += lineTotal

    doc.text(String(qty), margin + 5, y)
    doc.text(String(item.name || ''), margin + 60, y)
    doc.text(formatMoney(unitPrice), pageWidth - margin - 120, y)
    doc.text(formatMoney(lineTotal), pageWidth - margin - 5, y, { align: 'right' })
  })

  // Subtotal line
  y += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)

  // Subtotal
  y += 20
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal', pageWidth - margin - 120, y)
  doc.text(formatMoney(subtotal), pageWidth - margin - 5, y, { align: 'right' })

  // Sales Tax (6.25%)
  y += 16
  const taxRate = 0.0625 // 6.25%
  const taxAmount = subtotal * taxRate
  doc.text(`Sales Tax ${(taxRate * 100).toFixed(2)}%`, pageWidth - margin - 120, y)
  doc.text(formatMoney(taxAmount), pageWidth - margin - 5, y, { align: 'right' })

  // Total
  y += 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  const finalTotal = subtotal + taxAmount
  doc.text('TOTAL', pageWidth - margin - 120, y)
  doc.text(formatMoney(finalTotal), pageWidth - margin - 5, y, { align: 'right' })

  // Payment information
  y += 30
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Cash Received', pageWidth - margin - 120, y)
  doc.text(formatMoney(cashReceived.value), pageWidth - margin - 5, y, { align: 'right' })

  y += 16
  const change = cashReceived.value - finalTotal
  doc.text('Change', pageWidth - margin - 120, y)
  doc.text(formatMoney(change), pageWidth - margin - 5, y, { align: 'right' })

  // Signature area (if space allows)
  if (y < pageHeight - 200) {
    y += 60
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(24)
    doc.text('Thank you', margin + 80, y)
  }

  // Terms & Conditions at bottom
  const termsY = pageHeight - 100
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(220, 53, 69) // Red color
  doc.text('TERMS & CONDITIONS', pageWidth - margin - 150, termsY)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text('Payment is due within 15 days', pageWidth - margin - 150, termsY + 15)
  doc.text('Please make checks payable to: MART 2500', pageWidth - margin - 150, termsY + 28)

  // Generate PDF blob and save
  const filename = `invoice_${orderId}.pdf`
  doc.save(filename)

  // Also create blob URL for opening in new tab
  const pdfBlob = doc.output('blob')
  const pdfBlobUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfBlobUrl, '_blank')
}

function formatDateForInvoice(date: Date): string {
  if (!date) return '—'
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
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
