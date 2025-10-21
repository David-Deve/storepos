export interface Product {
  id: number
  price: string | any
  name: string
  qty: number
  discount?: number
  discount_expired_at?: string
}

export interface CartItem {
  id: number
  name: string
  qty: number
  price: string
  discount?: number
}
