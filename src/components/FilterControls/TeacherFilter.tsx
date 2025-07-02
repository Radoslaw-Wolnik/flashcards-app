import React from 'react'
import teachersData from '../../data/teachers.json'
import { Dropdown } from '../Dropdown'

interface Props {
  value: string
  onChange: (val: string) => void
}

export const TeacherFilter: React.FC<Props> = ({ value, onChange }) => {
  const options = teachersData.map(t => ({
    value: t.id,
    label: t.name
  }))

  return (
    <Dropdown
      placeholder="All Teachers"
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
