import React from 'react'
import subjectsData from '../../data/subjects.json'
import { Dropdown } from '../Dropdown'

interface Props {
  value: string
  onChange: (val: string) => void
  /** optional upstream filters */
  categoryId?: string
  teacherId?: string
}

export const SubjectFilter: React.FC<Props> = ({
  value, onChange, categoryId, teacherId
}) => {
  const filtered = subjectsData.filter(s =>
    (!categoryId || s.categoryId === categoryId) &&
    (!teacherId  || s.teacherId  === teacherId)
  )

  const options = filtered.map(s => ({
    value: s.id,
    label: s.name
  }))

  return (
    <Dropdown
      placeholder="All Subjects"
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
