import React, { useState, useEffect, useCallback } from "react"
import { Actions, StateType } from "../store"
import { PrefInfo, fetchPrefPopulation } from "../apiClient"
import { CheckBoxProps } from "../components/CheckBox"

const fetchPopulation = async (
  selectedPref: PrefInfo,
  dispatch: React.Dispatch<Actions>
) => {
  const res = await fetchPrefPopulation(selectedPref).catch((e) => {
    if (typeof e === "object" && e.status === 429) {
      // handle Too Many Requests
    }
  })
  if (!res) return // Too Many Requests
  dispatch({ type: "addData", payload: res.data })
}

export const usePopulationApi = (
  dispatch: React.Dispatch<Actions>,
  fetched: StateType["fetched"]
): CheckBoxProps["onChange"] => {
  const [selectedPref, setSelectedPref] = useState<PrefInfo>()

  const onChange: CheckBoxProps["onChange"] = useCallback(
    ({ value, checked, label }) => {
      if (typeof value !== "number") return

      if (!checked) {
        dispatch({ type: "removeSelected", payload: value })
        return
      }

      dispatch({ type: "setSelected", payload: value })
      setSelectedPref({ prefCode: value, prefName: label })
    },
    [dispatch]
  )

  useEffect(() => {
    if (!selectedPref) return
    // 総人口を取得済であればリクエストしない
    if (fetched.includes(selectedPref.prefCode)) return

    fetchPopulation(selectedPref, dispatch)
  }, [selectedPref, fetched, dispatch])

  return onChange
}
