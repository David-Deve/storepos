// stores/useCartStore.ts
import { defineStore } from 'pinia'
import type { Product, CartItem } from '@/type'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as Product[], // full product info including `qty`
    products: [] as Product[],
  }),

  actions: {
    addToCart(productId: number) {
      const product = this.products.find((p) => p.id === productId)
      if (!product || product.qty === 0) return

      const item = this.cart.find((i) => i.id === productId)
      if (item) {
        item.qty++
      } else {
        this.cart.push({ ...product, qty: 1 })
      }
      product.qty--
    },
  },
})
