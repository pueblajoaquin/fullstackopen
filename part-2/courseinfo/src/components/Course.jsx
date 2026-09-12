const Header = ({name}) => <h2>{name}</h2>

const Content = ({parts}) =>(
  <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({total}) => <p>total of {total} exercises</p>

const Course = ({course}) => {
  const { name, parts } = course
  const sumExercises = parts.reduce((total, part) => total + part.exercises, 0)
  return(
    <div>
      <Header name={name} />
      <Content parts={parts} />
      <Total total={sumExercises} />
    </div>
  )
}

export default Course