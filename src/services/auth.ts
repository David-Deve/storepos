import request from './httpconfig'
import { ElNotification } from 'element-plus'
export async function login(name: String, password: String) {
  try {
    const response = await request.post('/login', {
      name,
      password,
    })
    ElNotification({
      title: 'Success',
      message: 'Welcome ',
      type: 'success',
    })
    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}
