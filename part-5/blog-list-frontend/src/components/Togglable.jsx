import { useImperativeHandle, useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const changeVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  useImperativeHandle(props.ref, () => {
    return { changeVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={changeVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={changeVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable