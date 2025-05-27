import VueCookies from 'vue-cookies'
import request from './httpconfig'
import { ElNotification } from 'element-plus'
export async function createOrderProduct(
  cartId: number,
  data: { products: { product_id: number; qty: number; price: number }[] },
) {
  const token = VueCookies.get('storepos')

  try {
    const response = await request.post(`/createorderproduct/${cartId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    ElNotification({
      title: 'Success',
      message: 'Order Success',
      type: 'success',
    })
    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
