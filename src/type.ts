export interface Product {
  id: number
  price: string | any
  name: string
  qty: number
  linkimg?: string
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
