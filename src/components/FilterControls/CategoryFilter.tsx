import React from 'react'
import categoriesData from '../../data/categories.json'
import { Dropdown } from '../Dropdown'

interface Props {
  value: string
  onChange: (val: string) => void
}

export const CategoryFilter: React.FC<Props> = ({ value, onChange }) => {
  const options = categoriesData.map(c => ({
    value: c.id,
    label: c.name
  }))

  return (
    <Dropdown
      placeholder="All Categories"
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
