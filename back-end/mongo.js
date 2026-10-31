import mongoose from 'mongoose'
import Person from './model/schema_conn.js'

const args = process.argv.slice(2)

if (args.length !== 1 && args.length !== 3) {
  console.error('Usage: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const [password, name, number] = args
const url = `mongodb+srv://raresrobert2004_db_user:${(password)}@cluster0.fjpyrrj.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

const main = async () => {
  try {
    await mongoose.connect(url, { family: 4 })

    if (args.length === 1) {
      const persons = await Person.find({})
      persons.forEach((person) => {
        console.log(`name: ${person.name}`)
        console.log(`nr: ${person.number}`)
      })
      return
    }

    const person = new Person({ name, number })
    await person.save()
    console.log(`name: ${name}, nr: ${number}`)
  } catch (error) {
    console.error('MongoDB operation failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

main()
