import { useState, useEffect } from 'react'
import personService from '../services/persons.js'
import './App.css'

const phoneNumberRegex = /^\d{2,3}-\d+$/

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

const PersonForm = ({ name, number, errors, onNameChange, onNumberChange, onSubmit }) => (
  <form className="person-form" onSubmit={onSubmit}>
    <div className="form-field">
      <label htmlFor="person-name">Name</label>
      <input
        id="person-name"
        value={name}
        onChange={onNameChange}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'person-name-error' : undefined}
      />
      {errors.name && <p className="field-error" id="person-name-error">{errors.name}</p>}
    </div>
    <div className="form-field">
      <label htmlFor="person-number">Number</label>
      <input
        id="person-number"
        value={number}
        onChange={onNumberChange}
        aria-invalid={Boolean(errors.number)}
        aria-describedby={errors.number ? 'person-number-error' : undefined}
      />
      {errors.number && <p className="field-error" id="person-number-error">{errors.number}</p>}
    </div>
    {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
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
  const [formErrors, setFormErrors] = useState({})

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
    const errors = {}

    if (!trimmedName) {
      errors.name = 'Numele este obligatoriu.'
    } else if (trimmedName.length < 3) {
      errors.name = 'Numele trebuie să conțină cel puțin 3 caractere.'
    }

    if (!trimmedNumber) {
      errors.number = 'Numărul de telefon este obligatoriu.'
    } else if (trimmedNumber.length < 8) {
      errors.number = 'Numărul trebuie să aibă cel puțin 8 caractere.'
    } else if (!phoneNumberRegex.test(trimmedNumber)) {
      errors.number = 'Folosește formatul XX-XXXXXXX sau XXX-XXXXXXX.'
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
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

      try {
        const updatedPerson = await personService.update(existingPerson.id, {
          ...existingPerson,
          number: trimmedNumber,
        })
        setPersons((currentPersons) =>
          currentPersons.map((person) =>
            person.id === updatedPerson.id ? updatedPerson : person
          )
        )
      } catch (error) {
        setFormErrors({
          form: error.response?.data?.error || 'Nu s-a putut actualiza persoana. Încearcă din nou.',
        })
        return
      }
    } else {
      try {
        const returnedPerson = await personService.create({
          name: trimmedName,
          number: trimmedNumber,
        })
        setPersons((currentPersons) => [...currentPersons, returnedPerson])
      } catch (error) {
        setFormErrors({
          form: error.response?.data?.error || 'Nu s-a putut salva persoana. Încearcă din nou.',
        })
        return
      }
    }

    setFormErrors({})
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
          errors={formErrors}
          onNameChange={(event) => {
            setNewName(event.target.value)
            setFormErrors((current) => ({ ...current, name: '', form: '' }))
          }}
          onNumberChange={(event) => {
            setNewNumber(event.target.value)
            setFormErrors((current) => ({ ...current, number: '', form: '' }))
          }}
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
