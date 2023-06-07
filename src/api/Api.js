import axios from 'axios'
import VueCookies from 'vue-cookies'

class Api {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: 'https://cooperative-attire-goat.cyclic.app/api/v1' + baseURL,
      withCredentials: true,
      headers: { authorization: `Bearer ${VueCookies.get('jwt')}` }
    })
  }

  async get(url) {
    return await this.client.get(url)
  }

  async post(url, data = {}) {
    return await this.client.post(url, data)
  }

  async delete(url) {
    return await this.client.delete(url)
  }

  async update(url, data = {}) {
    return await this.client.update(url, data)
  }

  async patch(url, data = {}) {
    return await this.client.patch(url, data)
  }
}

export default Api
