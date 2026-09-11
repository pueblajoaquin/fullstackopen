import {useState} from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleNeutralClick = () => setNeutral(neutral + 1)

  const handleGoodClick = () => setGood(good + 1)

  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <Title text='give feedback' />
      <Button text='good' handleClick={handleGoodClick}/>
      <Button text='neutral' handleClick={handleNeutralClick}/>
      <Button text='bad' handleClick={handleBadClick}/>
      <Title text = 'statistics' />
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

const Title = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticsLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
} 

const Statistics = (props) => {

  const {good, neutral, bad} = props
  const all = good + neutral + bad

  if(all === 0){
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good/all) * 100

  return(
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={all} />
        <StatisticsLine text='average' value={average} />
        <StatisticsLine text='positive' value={'%' + positive} />
      </tbody>
    </table>
  )
}

export default App