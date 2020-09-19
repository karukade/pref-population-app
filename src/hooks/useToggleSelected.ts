import React, { useCallback } from "react"
import { Actions } from "../store"
import { CheckBoxProps } from "../components/CheckBox"

export const useToggleSelected = (
  dispatch: React.Dispatch<Actions>
): CheckBoxProps["onChange"] => {
  const onChange: CheckBoxProps["onChange"] = useCallback(
    ({ value, checked }) => {
      if (typeof value !== "number") return // type guard

      if (!checked) {
        dispatch({ type: "removeSelected", payload: value })
        return
      }

      dispatch({ type: "setSelected", payload: value })
    },
    [dispatch]
  )

  return onChange
}
