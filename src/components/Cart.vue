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
                <el-button class="buttondiscount" size="small" @click="openDiscountModal(item)">
                  <span v-if="item.discount && item.discount > 0" class="font-gagalin text-white"
                    >{{ item.discount }}%</span
                  >
                  <span v-else class="font-gagalin text-white">Discount</span>
                </el-button>
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

  <!-- Discount Modal -->
  <el-dialog
    v-model="discountModalVisible"
    title=""
    width="380"
    class="discount-modal"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="closeDiscountModal"
  >
    <div class="discount-content">
      <!-- Header -->
      <div class="text-center mb-4">
        <div class="discount-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            ></path>
          </svg>
        </div>
        <h2 class="modal-title">Apply Discount</h2>
        <p class="modal-subtitle">Set discount for this item</p>
      </div>

      <!-- Product Info -->
      <div class="product-card">
        <div class="product-name">{{ selectedItem?.name }}</div>
        <div class="product-price">${{ getOriginalItemPrice(selectedItem) }}</div>
      </div>

      <!-- Discount Input -->
      <div class="input-section">
        <label class="input-label">Discount Percentage</label>
        <div class="input-wrapper">
          <el-input
            v-model="discountInput"
            type="number"
            placeholder="Enter discount percentage"
            :min="0"
            :max="100"
            class="discount-input"
            size="large"
            @input="onDiscountInput"
            @keyup.enter="applyDiscount"
            ref="discountInputRef"
          />
        </div>
        <div class="input-hint">Enter 0-100</div>
      </div>

      <!-- Quick Discount Buttons -->
      <div class="quick-discounts">
        <button
          v-for="discount in [10, 20, 30, 50]"
          :key="discount"
          @click="setQuickDiscount(discount)"
          class="quick-btn"
          :class="{ active: discountInput === discount }"
        >
          {{ discount }}%
        </button>
      </div>

      <!-- Preview -->
      <div v-if="discountInput !== null && discountInput > 0" class="preview-card">
        <div class="preview-header">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Discount Preview</span>
        </div>
        <div class="preview-content">
          <div class="price-row">
            <span>New Price:</span>
            <span class="new-price">${{ getDiscountedPrice(selectedItem).toFixed(2) }}</span>
          </div>
          <div class="price-row">
            <span>You Save:</span>
            <span class="savings">${{ getDiscountAmount(selectedItem).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button @click="closeDiscountModal" class="cancel-btn" size="large"> Cancel </el-button>
        <el-button
          type="primary"
          @click="applyDiscount"
          :disabled="discountInput === null || discountInput < 0 || discountInput > 100"
          class="apply-btn"
          size="large"
        >
          Apply Discount
        </el-button>
      </div>
    </template>
  </el-dialog>

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

// Discount modal state
const discountModalVisible = ref(false)
const selectedItem = ref<CartItem | null>(null)
const discountInput = ref<number | null>(null)
const discountInputRef = ref()

const props = defineProps<{ cart: CartItem[]; products: Product[] }>()
const emit = defineEmits([
  'increase-qty',
  'decrease-qty',
  'remove-product',
  'apply-discount',
  'clear-cart',
])

function getProduct(id: number) {
  return props.products.find((p) => p.id === id)
}

// Discount functions
function openDiscountModal(item: CartItem) {
  selectedItem.value = item
  discountInput.value = item.discount || null
  discountModalVisible.value = true
  // Focus input after modal opens
  setTimeout(() => {
    discountInputRef.value?.focus()
  }, 100)
}

function closeDiscountModal() {
  discountModalVisible.value = false
  selectedItem.value = null
  discountInput.value = null
}

function setQuickDiscount(discount: number) {
  discountInput.value = discount
  // Add a subtle animation feedback
  const input = discountInputRef.value
  if (input) {
    input.focus()
  }
}

function onDiscountInput() {
  // Real-time validation feedback
  if (discountInput.value !== null && (discountInput.value < 0 || discountInput.value > 100)) {
    // Could add visual feedback here
  }
}

function applyDiscount() {
  if (
    selectedItem.value &&
    discountInput.value !== null &&
    discountInput.value >= 0 &&
    discountInput.value <= 100
  ) {
    emit('apply-discount', selectedItem.value, discountInput.value)
    closeDiscountModal()
  }
}

function getOriginalItemPrice(item: CartItem | null): string {
  if (!item) return '0.00'
  const product = getProduct(item.id)
  return product ? (product.price * item.qty).toFixed(2) : '0.00'
}

function getDiscountedPrice(item: CartItem | null): number {
  if (!item || discountInput.value === null || discountInput.value <= 0) return 0
  const product = getProduct(item.id)
  if (!product) return 0
  const originalPrice = product.price * item.qty
  return originalPrice * (1 - discountInput.value / 100)
}

function getDiscountAmount(item: CartItem | null): number {
  if (!item || discountInput.value === null || discountInput.value <= 0) return 0
  const product = getProduct(item.id)
  if (!product) return 0
  const originalPrice = product.price * item.qty
  return originalPrice * (discountInput.value / 100)
}

function getItemTotal(item: CartItem): number {
  const product = getProduct(item.id)
  if (!product) return 0
  const originalPrice = product.price * item.qty
  if (item.discount && item.discount > 0) {
    return originalPrice * (1 - item.discount / 100)
  }
  return originalPrice
}

function getItemDiscount(item: CartItem): number {
  const product = getProduct(item.id)
  if (!product || !item.discount) return 0
  const originalPrice = product.price * item.qty
  return originalPrice * (item.discount / 100)
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
      products: products.map((p) => ({
        product_id: p.id,
        qty: p.qty,
        price: getItemTotal(p), // Use discounted price instead of original price
        discount: p.discount || 0,
      })),
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
