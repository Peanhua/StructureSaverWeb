import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    if (type === 'checkbox')
      setValue(event.target.checked)
    else
      setValue(event.target.value)
  }

  const reset = () => {
    if (type === 'checkbox')
      setValue(false)
    else
      setValue('')
  }

  return [
    {
      type,
      value,
      onChange
    },
    reset
  ]
}

