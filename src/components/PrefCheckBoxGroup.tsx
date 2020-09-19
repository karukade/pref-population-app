import React from "react"
import styled from "styled-components"

import CheckBox from "./CheckBox"
import CheckBoxesSkeletons from "./CheckBoxesSkeletons"
import { useToggleSelected } from "../hooks/useToggleSelected"
import { StateType, Actions } from "../store"

const CheckBoxList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom: 40px;
  > li {
    margin: 8px;
  }
`

export type PrefCheckBoxGroupProps = {
  dispatch: React.Dispatch<Actions>
  name: string
  prefMap: StateType["prefMap"]
  initialCheckedValues: StateType["selected"]
}

const PrefCheckBoxGroup: React.FC<PrefCheckBoxGroupProps> = ({
  prefMap,
  name,
  dispatch,
  initialCheckedValues,
}) => {
  const onChange = useToggleSelected(dispatch)
  const checkBoxes = () =>
    [...prefMap].map(([value, label]) => (
      <li key={value}>
        <CheckBox
          initialChecked={initialCheckedValues.includes(value)}
          name={name}
          value={value}
          label={label}
          onChange={onChange}
        />
      </li>
    ))
  return (
    <CheckBoxList>
      {prefMap.size > 0 ? checkBoxes() : <CheckBoxesSkeletons />}
    </CheckBoxList>
  )
}

export default React.memo(PrefCheckBoxGroup)
