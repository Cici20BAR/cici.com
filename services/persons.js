import axios from 'axios'

const baseUrl = 'https://cici-com.onrender.com/persons'

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data)
}

const create = (newPers) => {
  return axios.post(baseUrl, newPers).then((res) => res.data)
}

const update = (id, newobj) => {
  return axios.put(`${baseUrl}/${id}`, newobj).then((res) => res.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }