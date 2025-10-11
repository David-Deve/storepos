import { toast, type ToastOptions } from 'vue3-toastify'

export function showSuccess(message: string, options: ToastOptions = {}) {
  return toast.success(message, {
    autoClose: 2500,
    pauseOnHover: true,
    hideProgressBar: false,
    position: 'top-right',
    theme: 'colored',
    ...options,
  })
}

export function showError(message: string, options: ToastOptions = {}) {
  return toast.error(message, {
    autoClose: 3500,
    pauseOnHover: true,
    hideProgressBar: false,
    position: 'top-right',
    theme: 'colored',
    ...options,
  })
}

export default { showSuccess, showError }
