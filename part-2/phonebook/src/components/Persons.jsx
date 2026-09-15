const Persons = (props) =>{
  return (
    <ul>
      {props.personsToShow.map(
        person => <PersonData key={person.name} name={person.name} number={person.number} />
      )}
    </ul>
  )
} 


const PersonData = (props) => <li>{props.name} {props.number}</li>


export default Persons