import { useState } from 'react'

/**
 * Keeps the values of a form's text boxes in one object.
 *   const { values, bind } = useFormFields({ email: '', password: '' })
 *   <Input {...bind('email')} />   ← wires value + onChange in one go
 */
export function useFormFields(initialValues) {
  const [values, setValues] = useState(initialValues)

  const setField = (name, value) => setValues((current) => ({ ...current, [name]: value }))

  const bind = (name) => ({
    value: values[name],
    onChange: (event) => setField(name, event.target.value),
  })

  return { values, setField, bind }
}
