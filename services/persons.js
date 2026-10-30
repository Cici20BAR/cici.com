import axios from 'axios'

const baseUrl = process.env.URL;
const PORT=process.env.PORT;

const getAll=()=>{
   return  axios.get(baseUrl).then((res)=>res.data)
}
const create=(newPers)=>{
    return axios.post(baseUrl,newPers).then((res)=>res.data)   

}
const update=(id,newobj)=>{
    return axios.put(`${baseUrl}/${id}`,newobj).then((res)=>res.data) 

}
const remove =(id)=>{
    return axios.delete(`${baseUrl}/${id}`)
}
export default { getAll, create, update, remove }
