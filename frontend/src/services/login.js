import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const steamLogin = async (steamAuthQuery) => {
  const response = await axios.get(baseUrl + '/steamAuthenticate' + steamAuthQuery)
  return response.data
}

const getSteamAuthUrl = async () => {
  const response = await axios.get(baseUrl + '/steamAuthUrl')
  return response.data.authUrl
}

export default {
  login,
  steamLogin,
  getSteamAuthUrl
}
