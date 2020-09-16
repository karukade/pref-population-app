import React, { useReducer, useEffect, useMemo } from "react"

import { rootReducer } from "./store/"
import { fetchPref } from "./apiClient"

//components
import Header from "./components/Header"
import Main from "./components/Main"
import Chart from "./components/Chart"
import PrefCheckBoxGroup from "./components/PrefCheckBoxGroup"

const App: React.FC = () => {
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

  const selectedPref = useMemo(() => {
    return prefMap
      ? selected
          .filter((prefCode) => fetched.includes(prefCode))
          .map((prefCode) => prefMap.get(prefCode) as string)
      : []
  }, [selected, prefMap, fetched])

  useEffect(() => {
    const getPrefList = async () => {
      const prefList = await fetchPref()
      if (!prefList.data) return
      dispatch({ type: "setPrefMap", payload: prefList.data.result })
    }
    getPrefList()
  }, [])

  return (
    <>
      <Header>都道府県別の総人口推移グラフ</Header>
      <Main>
        {prefMap && (
          <PrefCheckBoxGroup
            name="prefecture"
            dispatch={dispatch}
            prefMap={prefMap}
            fetched={fetched}
          />
        )}
        {data && <Chart selectedPref={selectedPref} data={data} />}
      </Main>
    </>
  )
}

export default App
