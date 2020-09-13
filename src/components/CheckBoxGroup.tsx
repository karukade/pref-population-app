import React from "react"
import CheckBox, { CheckBoxProps } from "./CheckBox"

export type CheckBoxGroupeProps = {
  name: string
  options: { value: string | number; label: string }[]
}

const CheckBoxGroupe: React.FC<CheckBoxGroupeProps> = ({ options, name }) => {
  const onChange: CheckBoxProps["onChange"] = ({ value, checked }) => {
    console.log({ value, checked })
  }
  return (
    <ul>
      {options.map(({ value, label }) => (
        <li key={value}>
          <CheckBox
            name={name}
            value={value}
            label={label}
            onChange={onChange}
          />
        </li>
      ))}
    </ul>
  )
}

export default React.memo(CheckBoxGroupe)
