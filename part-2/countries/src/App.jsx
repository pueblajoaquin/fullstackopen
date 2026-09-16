import { useEffect, useState } from 'react'
import axios from 'axios'
import CountriesData from './components/CountriesData'


function App() {

  const [countries, setCountries] = useState([])
  const [formValue, setFormValue] = useState('')

  useEffect(()=>{
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  },[])

  const handleChangeForm = (event) => {
    setFormValue(event.target.value)
  }

  return (
    <div>
      <form >
        find countries 
        <input 
          type="text" 
          value={formValue}
          onChange={handleChangeForm}
        />
      </form>

      <CountriesData countries = {countries} formValue={formValue} />
    </div>
  )
}

export default App
