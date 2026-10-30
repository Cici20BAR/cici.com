import { useState, useEffect } from 'react'
import personService from '../services/persons.js'
import './App.css'

const phoneNumberRegex = /^\d[\d-]*$/

const Search = ({ value, onChange }) => (
  <div className="search-field">
    <label htmlFor="person-search">Search contacts</label>
    <input
      id="person-search"
      type="search"
      value={value}
      onChange={onChange}
      placeholder="Type a name"
    />
  </div>
)

const PersonForm = ({ name, number, onNameChange, onNumberChange, onSubmit }) => (
  <form className="person-form" onSubmit={onSubmit}>
    <div className="form-field">
      <label htmlFor="person-name">Name</label>
      <input id="person-name" value={name} onChange={onNameChange} />
    </div>
    <div className="form-field">
      <label htmlFor="person-number">Number</label>
      <input id="person-number" value={number} onChange={onNumberChange} />
    </div>
    <div className="form-actions">
      <button className="primary-button" type="submit">Add contact</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <div className="person-list">
    {persons.map((person) => (
      <div className="person-item" key={person.id}>
        <div>
          <strong>{person.name}</strong>
          <span>{person.number}</span>
        </div>
        <button className="delete-button" onClick={() => onDelete(person.id)}>
          Delete
        </button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((err) => {
        console.error("No conection:", err)
      })
  }, [])
const handleDelete=async(id)=>{
  const conf=window.confirm("Are you sure you want to delete?")
  if(!conf){
    return;
  }
  await personService.remove(id)
  setPersons((c)=>c.filter((p)=>p.id!==id))

}
  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName) {
      alert('Please insert a name!')
      return
    }

    if (!phoneNumberRegex.test(trimmedNumber)) {
      alert('Please insert a valid phone number using digits and hyphens!')
      return
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPerson) {
      const confirmed = window.confirm(
        `${existingPerson.name} is already in the phonebook. Replace the old number?`
      )
      if (!confirmed) return

      const updatedPerson = await personService.update(existingPerson.id, {
        ...existingPerson,
        number: trimmedNumber,
      })
      setPersons((currentPersons) =>
        currentPersons.map((person) =>
          person.id === updatedPerson.id ? updatedPerson : person
        )
      )
    } else {
      const returnedPerson = await personService.create({
        name: trimmedName,
        number: trimmedNumber,
      })
      setPersons((currentPersons) => [...currentPersons, returnedPerson])
    }

    setNewName('')
    setNewNumber('')
  }

  const visiblePersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <main className="phonebook">
      <header className="page-header">
        <p className="eyebrow">YOUR CONTACTS</p>
        <h1>Phonebook</h1>
        <p className="page-description">Keep all your important numbers in one place.</p>
      </header>

      <section className="phonebook-card">
        <h2>Find a contact</h2>
        <Search value={search} onChange={(event) => setSearch(event.target.value)} />

        <div className="section-divider" />

        <h2>Add a new contact</h2>
        <PersonForm
          name={newName}
          number={newNumber}
          onNameChange={(event) => setNewName(event.target.value)}
          onNumberChange={(event) => setNewNumber(event.target.value)}
          onSubmit={handleSubmit}
        />

        <div className="section-divider" />

        <div className="contacts-heading">
          <h2>Contacts</h2>
          <span className="contact-count">{visiblePersons.length}</span>
        </div>
        <Persons persons={visiblePersons} onDelete={handleDelete} />
      </section>
    </main>
  )
}

export default App  
