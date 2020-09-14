import React from "react"
import CheckBox, { CheckBoxProps } from "./CheckBox"

import { StateType } from "../store"

export type PrefCheckBoxGroupProps = {
  name: string
  prefMap: NonNullable<StateType["prefMap"]>
}

const PrefCheckBoxGroup: React.FC<PrefCheckBoxGroupProps> = ({
  prefMap,
  name,
}) => {
  const onChange: CheckBoxProps["onChange"] = ({ value, checked }) => {
    console.log({ value, checked })
  }
  return (
    <ul>
      {[...prefMap].map(([value, label]) => (
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

export default React.memo(PrefCheckBoxGroup)
