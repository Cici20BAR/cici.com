import mongoose from 'mongoose'
import 'dotenv/config'
  const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minlength:[3,'Numele trebuie să conțină cel puțin 3 caractere.'],
    required:[true,'obligatoriu']
  },
  number: {
    type: String,
    minLength: [8, 'Numărul trebuie să aibă cel puțin 8 caractere.'], // Regula de lungime
    required: [true, 'Numărul de telefon este obligatoriu.'],
    validate:{
      validator:function(v){
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} nu este un număr de telefon valid! Folosește formatul XX-XXXXXXX sau XXX-XXXXXXX.`


    }
  }
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