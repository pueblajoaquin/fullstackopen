import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState({})
  const [selected, setSelected] = useState(0)

  const handleVoteAnecdoteButton = () => {
    const newVotes =  {...votes}

    if(!Object.hasOwn(newVotes,selected)){
      newVotes[selected] = 0
    }

    newVotes[selected] += 1

    setVotes(newVotes)
  }

  const handleRandomAnecdotesButton = () => {
    const index = getRandomInt(anecdotes.length)
    setSelected(index)
  }

  const getMostVoted = () => {
    let maxKey = null

    for(const key in votes){
      if(maxKey === null || votes[key] > votes[maxKey]){
        maxKey = key
      }
    }

    return maxKey
  }

  return (
    <div>
      <Anecdote
        title='Anecdote of the day'
        anecdote={anecdotes[selected]} 
        votes={votes[selected]} 
      />
      <Button handleClick={handleVoteAnecdoteButton} text='vote' />
      <Button handleClick={handleRandomAnecdotesButton} text='next anecdote' />
      <Anecdote 
        title='Anecdote with most votes' 
        anecdote={anecdotes[getMostVoted()]} 
        votes={votes[getMostVoted()]} 
      />
    </div>
  )
}

const Anecdote = ({title, anecdote = '-', votes = 0}) => {
  return(
    <div>
      <h1>{title}</h1>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}

const getRandomInt = max => Math.floor(Math.random() * max)

export default App