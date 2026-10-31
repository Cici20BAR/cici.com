import mongoose from 'mongoose'
import 'dotenv/config'
  const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const url = process.env.MONGODB_URI
mongoose.set("strictQuery",false)
mongoose.connect(url,{family:4}).then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)


export default Person