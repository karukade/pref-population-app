import React, { useEffect, useReducer } from "react"
import styled from "styled-components"

import { rootReducer } from "../store/"
import { fetchPref } from "../apiClient"
import { useChartProps } from "../hooks/useChartProps"
import { useElmWidth } from "../hooks/useElmWidth"

import Chart from "./Chart"
import ChartContainer from "./ChartContainer"
import PrefCheckBoxGroup from "./PrefCheckBoxGroup"

const Container = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`

const Main: React.FC = () => {
  const [
    { selected, fetched, data, prefMap, fetchItem, fetching },
    dispatch,
  ] = useReducer(rootReducer, {
    fetching: false,
    fetched: [],
    fetchItem: null,
    fetchingItems: [],
    selected: [],
    data: null,
    dataPool: [],
    prefMap: new Map(),
  })

  const { chartLineColors, selectedPref } = useChartProps({
    selected,
    prefMap,
    fetched,
  })

  const [elmRef, width] = useElmWidth<HTMLElement>()

  useEffect(() => {
    const getPrefList = async () => {
      const prefList = await fetchPref().catch((e) => {
        // TODO: 都道府県リスト取得エラーをハンドルする
      })
      if (!prefList) return
      dispatch({ type: "setPrefMap", payload: prefList.data.result })
      // グラフがないと何ができるのか分からないので北海道をデフォルトで表示しておく
      dispatch({ type: "setSelected", payload: 1 })
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
          selected={selected}
          fetchItem={fetchItem}
        />
      )}
      <ChartContainer
        fetching={fetching}
        chart={
          data &&
          chartLineColors && (
            <Chart
              data={data}
              selectedPref={selectedPref}
              lineColor={chartLineColors}
              width={width}
            />
          )
        }
      />
    </Container>
  )
}

export default Main
