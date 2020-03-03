import axios from 'axios'
const baseUrl = '/api/users'

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

const create = async (newUser) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newUser, config)
  return response.data
}

const deleteUser = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(baseUrl + '/' + id, config)
  return response.data
}

const changePassword = async (id, new_password) => {
  const config = {
    headers: { Authorization: token }
  }
  const data = {
    password: new_password
  }
  const response = await axios.post(baseUrl + '/password/' + id, data, config)
  return response.data
}

const updateUser = async (id, changes) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.patch(baseUrl + '/' + id, changes, config)
  return response.data
}



export default {
  getAll,
  create,
  deleteUser,
  changePassword,
  updateUser,
  setToken
}
