import React, { useEffect, useReducer } from "react"
import styled from "styled-components"

import { rootReducer } from "../store/"
import { fetchPref } from "../apiClient"

import Chart from "./Chart"
import ChartContainer from "./ChartContainer"
import PrefCheckBoxGroup from "./PrefCheckBoxGroup"
import ErrorBox from "./ErrorBox"

const Container = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`

const Main: React.FC = () => {
  const [
    {
      selected,
      data,
      prefMap,
      fetchItem,
      fetching,
      requestError,
      displayItems,
    },
    dispatch,
  ] = useReducer(rootReducer, {
    fetching: false,
    fetched: [],
    fetchItem: null,
    fetchingItems: [],
    selected: [],
    displayItems: [],
    data: null,
    dataPool: [],
    prefMap: new Map(),
    requestError: null,
  })

  useEffect(() => {
    const getPrefList = async () => {
      const prefList = await fetchPref().catch((e) => {
        dispatch({
          type: "setRequestError",
          payload: { type: "prefList", status: e?.status, meta: e?.meta },
        })
      })
      if (!prefList) return
      dispatch({ type: "setPrefMap", payload: prefList.data.result })
      // グラフがないと何ができるのか分からないので北海道をデフォルトで表示しておく
      dispatch({ type: "setSelected", payload: 1 })
    }
    getPrefList()
  }, [])

  return (
    <Container>
      {requestError && (
        <ErrorBox message={requestError.message} dispatch={dispatch} />
      )}
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
