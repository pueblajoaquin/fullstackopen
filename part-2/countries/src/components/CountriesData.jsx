import { useEffect, useState } from "react"
import axios from "axios"
import describeWeather from './weatherCodes'

const CountriesData = ({countries, formValue})=>{

  const [showCountry, setShowCountry] = useState(null)

  useEffect(()=>{
    setShowCountry(null)
  },[formValue])

  const countriesToShow = countries.filter(country => {
    const nameCountry = country.name.common.toLowerCase()
    return nameCountry.includes(formValue.toLowerCase())
  })

  if(showCountry !== null && countriesToShow.includes(showCountry)){
    return(
      <CountryDetails country={showCountry} />
    )
  }

  if(countriesToShow.length <= 0){
    return (
      <div>
        <p>Charging...</p>
      </div>
    )
  }

  if(countriesToShow.length === 1){
    return (
      <CountryDetails country={countriesToShow[0]} />
    )
  }

  if(countriesToShow.length > 10){
    
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  const handleClickShow = (country) => {
    setShowCountry(country)
  }

  return(
    <div>
      <ul>
        {countriesToShow.map(country => 
          <li key={country.name.official}>
            {country.name.common}
            <button onClick={() => handleClickShow(country)}>show details</button>
        
            </li>
        )}
      </ul>
    </div>
  )
}

const CountryDetails = ({country}) => {
    const [weatherData, setWeatherData] = useState(null)

  const api_key = import.meta.env.VITE_OPEN_METEO

  const { name, capital, languages, area, flags, latlng } = country

  const nameCommon = name.common

  useEffect(()=>{
    axios
      .get(`${api_key}?latitude=${latlng[0]}&longitude=${latlng[1]}&current=temperature_2m,weather_code,wind_speed_10m,is_day&wind_speed_unit=ms`)
      .then(response => {
          setWeatherData(response.data.current)
      })
  },[country])

  return(
    <div>
      <h1>{nameCommon}</h1>
      <h2>Capitals</h2>
        <ul>
          {(capital ?? []).map(capital => <li key={capital}>{capital}</li>)}
        </ul>
      <h2>Languages</h2>
        <ul>
          {Object.values(languages ?? {}).map(lan => {
            return(
            <li key={lan}>{lan}</li>
            )
          })}
        </ul>
      <h2>Area</h2>
        <p>{area}</p>
      <h2>Flag</h2>
        <img src={flags.png} alt={flags.alt} />
      <h2>Weather in {nameCommon}</h2>
        <WeatherDetails weatherData={weatherData}/>
    </div>
  )
}

const WeatherDetails = ({weatherData}) =>{
    if(weatherData === null){
        return (
            <div>
                <p>Charging...</p>
            </div>
        )
    }

    const {temperature_2m, wind_speed_10m, weather_code, is_day} = weatherData
    const {label, iconUrl} = describeWeather(weather_code, is_day)
    return (
        <div>
            <p>Temperature {temperature_2m} Celsius</p>
            <img src={iconUrl} alt={label} />
            <p>Wind {wind_speed_10m} m/s</p>
        </div>
    )
}

export default CountriesData