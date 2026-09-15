import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import axios from 'axios'
import Filter from './components/Filter'
import Persons from './components/Persons'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filterPersons, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
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
    
    if(persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }
    if(persons.some(person => person.number === newNumber)){
      alert(`${newNumber} is already exists in the phonebook`)
      return
    }
    if(newName === '' || newNumber === ''){
      alert('the input is incomplete')
      return
    }
    
    const personObject = {
      name: newName,
      number : newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person => {
    const filterToLowerCase = filterPersons.toLowerCase()
    const nameToLowerCase = person.name.toLowerCase()
    return nameToLowerCase.includes(filterToLowerCase)
  })
  
  return (
    <div>
      <h2>Phonebook</h2>

        <Filter onChange={handleFilterChange} />

      <h3>Add a new</h3>

        <PersonForm 
          onSubmit = {addPerson}
          name = {newName}
          number = {newNumber}
          onChangeName = {handleNameChange}
          onChangeNumber = {handleNumberChange}
        />

      <h2>Numbers</h2>

        <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App