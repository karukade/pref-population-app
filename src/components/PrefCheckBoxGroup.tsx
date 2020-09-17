import React from "react"
import styled from "styled-components"

import CheckBox from "./CheckBox"
import { usePopulationApi } from "../hooks/usePopulationApi"
import { StateType, Actions } from "../store"

const CheckBoxList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom: 40px;
  > li {
    padding: 8px;
  }
`

export type PrefCheckBoxGroupProps = {
  dispatch: React.Dispatch<Actions>
  name: string
  prefMap: NonNullable<StateType["prefMap"]>
  fetchItem: StateType["fetchItem"]
}

const PrefCheckBoxGroup: React.FC<PrefCheckBoxGroupProps> = ({
  prefMap,
  name,
  dispatch,
  fetchItem,
}) => {
  const onChange = usePopulationApi(dispatch, fetchItem)
  return (
    <CheckBoxList>
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
    </CheckBoxList>
  )
}

export default React.memo(PrefCheckBoxGroup)
