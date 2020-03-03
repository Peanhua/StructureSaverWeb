import { useState } from 'react'

export const useField = (type, defaultValue) => {
  const [value, setValue] = useState(defaultValue !== undefined ? defaultValue : '')

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

  const checked = (type === 'checkbox') ? value : null

  return [
    {
      type,
      value,
      checked,
      onChange
    },
    reset,
    setValue
  ]
}

