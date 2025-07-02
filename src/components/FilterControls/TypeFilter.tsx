import React from 'react'
import { Dropdown } from '../Dropdown'

interface Props {
  value: 'memorize' | 'understand' | ''
  onChange: (val: 'memorize' | 'understand' | '') => void
}

export const TypeFilter: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { value: 'memorize',    label: 'Memorize (📘)' },
    { value: 'understand',  label: 'Understand (💡)' },
  ]

  return (
    <Dropdown
      placeholder="All Types"
      options={options}
      value={value}
      onChange={val => onChange(val as 'memorize' | 'understand')}
    />
  )
}
