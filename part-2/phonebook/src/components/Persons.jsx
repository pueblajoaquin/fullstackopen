const Persons = (props) =>{
  return (
    <ul>
      {props.personsToShow.map(
        person => <PersonData 
          key={person.id}
          id={person.id}
          name={person.name} 
          number={person.number} 
          onClick={props.onClick}
        />
      )}
    </ul>
  )
} 


const PersonData = (props) => {
  return(
    <li>
      {props.name} 
      {props.number}
      <button onClick={() => props.onClick(props.id)}>
        delete
      </button>
    </li>
  )
}


export default Persons