import VueCookies from 'vue-cookies'
import request from './httpconfig'
import { ElNotification } from 'element-plus'
const token = VueCookies.get('storepos')
export async function getAllProduct() {
  try {
    const response = await request.get('/product', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response
  } catch (e: any) {
    throw new Error(e)
  }
}
