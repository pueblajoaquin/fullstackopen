import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personServices from './services/persons'
import Message from './components/Message'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filterPersons, setNewFilter] = useState('')

  const [currentMessage, setCurrentMessage] = useState(null)

  useEffect(() => {
    personServices
      .getAll()
      .then(initalPersons => setPersons(initalPersons))
  }, [])

  const handleNameChange = (event)=>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event)=>{
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if(newName === '' || newNumber === ''){
      alert('the input is incomplete')
      return
    }
    if(persons.some(person => person.number === newNumber)){
      alert(`${newNumber} is already exists in the phonebook`)
      return
    }
    if(persons.some(person => person.name === newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new once?`)){
        const person = persons.find(person => person.name === newName)
        editPerson(person.id)
      }
      return
    }

    const personObject = {
      name: newName,
      number : newNumber
    }

    personServices
      .createPerson(personObject)
      .then(personCreated =>{
        setPersons(persons.concat(personCreated))
        setNewName('')
        setNewNumber('')
        editCurrentMessage(`Added ${personCreated.name}`)
      })
      .catch(err => {
        editCurrentMessage(err.response.data.error,'error')
      })
  }

  const removePerson = id =>{
    const person = persons.find(person => person.id === id)

    if(window.confirm(`Delete ${person.name} ?`)){
      personServices
        .deletePerson(id)
        .then(personDeleted => {
          const newPersons = persons.filter(person => person.id !== personDeleted.id)
          setPersons(newPersons)
          editCurrentMessage(`Deleted ${personDeleted.name}`)
        })
    }
  }

  const editPerson = (id)=>{
    const personObject = {
      name: newName,
      number: newNumber
    }

    personServices
      .update(id, personObject)
      .then(personModified => {
        setPersons(persons.map(person => person.id !== id ? person : personModified))
        setNewName('')
        setNewNumber('')
        editCurrentMessage(`Modified ${personModified.name}`)
      })
      .catch(error => {
        console.log(error)
        editCurrentMessage(`Information of ${newName} has already been removed from server`, 'error')
      })
  }

  const editCurrentMessage = (message, type = 'success') => {
    setCurrentMessage({message, type})
    setTimeout(()=>{
      setCurrentMessage(null)
    }, 5000)
  }

  const personsToShow = persons.filter(person => {
    const filterToLowerCase = filterPersons.toLowerCase()
    const nameToLowerCase = person.name.toLowerCase()
    return nameToLowerCase.includes(filterToLowerCase)
  })
  
  return (
    <div>
      <h1>Phonebook</h1>

        <Message message={currentMessage} />

        <Filter onChange={handleFilterChange} />

      <h2>Add a new</h2>

        <PersonForm 
          onSubmit = {addPerson}
          name = {newName}
          number = {newNumber}
          onChangeName = {handleNameChange}
          onChangeNumber = {handleNumberChange}
        />

      <h2>Numbers</h2>

        <Persons 
          personsToShow={personsToShow}
          onClick={removePerson}
        />
    </div>
  )
}

export default App