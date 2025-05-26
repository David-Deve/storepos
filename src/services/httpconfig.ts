import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const request = axios.create({
  baseURL,
})
export default request
