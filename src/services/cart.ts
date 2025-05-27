import VueCookies from 'vue-cookies'
import request from './httpconfig'

export async function createOrder(customer_name: string) {
  const token = VueCookies.get('storepos')
  try {
    const response = await request.post(
      '/createorder',
      { customer_name },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
