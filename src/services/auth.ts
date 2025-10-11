import request from './httpconfig'
import { showSuccess, showError } from '@/lib/toast'
export async function login(name: String, password: String) {
  try {
    const response = await request.post('/login', {
      name,
      password,
    })
    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
