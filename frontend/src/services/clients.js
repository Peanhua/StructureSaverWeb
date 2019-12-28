import axios from 'axios'
const baseUrl = '/api/clients'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (newClient) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newClient, config)
  return response.data
}

export default {
  getAll,
  create,
  setToken
}
