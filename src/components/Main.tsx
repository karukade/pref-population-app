import React, { useEffect, useReducer } from "react"
import styled from "styled-components"

import { rootReducer } from "../store/"
import { fetchPref } from "../apiClient"
import { useChartProps } from "../hooks/useChartProps"
import { useElmWidth } from "../hooks/useElmWidth"

import Chart from "./Chart"
import PrefCheckBoxGroup from "./PrefCheckBoxGroup"

const Container = styled.main`
  max-width: 1200px;
  margin: 40px auto;
`

const Main: React.FC = () => {
  const [{ selected, fetched, data, prefMap }, dispatch] = useReducer(
    rootReducer,
    {
      fetching: false,
      selected: [],
      data: null,
      prefMap: null,
      fetched: [],
    }
  )

  const { chartLineColors, selectedPref } = useChartProps({
    selected,
    prefMap,
    fetched,
  })

  const [elmRef, width] = useElmWidth<HTMLElement>()

  useEffect(() => {
    const getPrefList = async () => {
      const prefList = await fetchPref()
      if (!prefList.data) return
      dispatch({ type: "setPrefMap", payload: prefList.data.result })
    }
    getPrefList()
  }, [])

  return (
    <Container ref={elmRef}>
      {prefMap && (
        <PrefCheckBoxGroup
          name="prefecture"
          dispatch={dispatch}
          prefMap={prefMap}
          fetched={fetched}
        />
      )}
      {data && chartLineColors && (
        <Chart
          data={data}
          selectedPref={selectedPref}
          lineColor={chartLineColors}
          width={width}
        />
      )}
    </Container>
  )
}

export default Main
