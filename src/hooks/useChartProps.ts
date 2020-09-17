import { useMemo } from "react"
import { StateType } from "../store"

import { generateLineColors } from "../components/Chart"

type Params = {
  selected: StateType["selected"]
  prefMap: StateType["prefMap"]
  fetched: StateType["fetched"]
}

export const useChartProps = ({ selected, prefMap, fetched }: Params) => {
  const selectedPref = useMemo(() => {
    return prefMap
      ? selected
          .filter((prefCode) => fetched.includes(prefCode))
          .map((prefCode) => prefMap.get(prefCode) as string)
      : []
  }, [selected, prefMap, fetched])

  const chartLineColors = useMemo(() => {
    return prefMap
      ? generateLineColors([...prefMap].map(([, prefName]) => prefName))
      : null
  }, [prefMap])

  return {
    selectedPref,
    chartLineColors,
  }
}
