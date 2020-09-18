import React from "react"
import styled from "styled-components"

import { useAppState } from "../hooks/useAppState"

import Chart from "./Chart"
import ChartContainer from "./ChartContainer"
import PrefCheckBoxGroup from "./PrefCheckBoxGroup"
import ErrorBox from "./ErrorBox"

const Container = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`

// デフォルトでグラフに表示する都道府県（北海道）
const initialPref = [1]

const Main: React.FC = () => {
  const [
    {
      data,
      prefMap,
      fetchItem,
      fetching,
      requestError,
      displayItems,
      selected,
    },
    dispatch,
  ] = useAppState(initialPref)

  return (
    <Container>
      {requestError && (
        <ErrorBox message={requestError.message} dispatch={dispatch} />
      )}
      <PrefCheckBoxGroup
        name="prefecture"
        dispatch={dispatch}
        prefMap={prefMap}
        selected={selected}
        fetchItem={fetchItem}
      />
      <ChartContainer
        fetching={fetching}
        renderChart={(width) =>
          data && (
            <Chart
              data={data}
              displayItems={displayItems}
              prefMap={prefMap}
              width={width}
            />
          )
        }
      />
    </Container>
  )
}

export default Main
