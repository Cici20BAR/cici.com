import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => axios.get(baseUrl).then((response) => response.data)

const create = (newNote) => axios.post(baseUrl, newNote).then((response) => response.data)

const update = (id, updatedNote) =>
  axios.put(`${baseUrl}/${id}`, updatedNote).then((response) => response.data)

const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, update, remove }
