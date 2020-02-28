import axios from 'axios'
const baseUrl = '/api/plans'

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

const get = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl + '/' + id, config)
  return response.data
}

const deletePlan = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(baseUrl + '/' + id, config)
  return response.data
}

export default {
  getAll,
  get,
  deletePlan,
  setToken
}
