import React, { useReducer, useEffect } from "react"

import { rootReducer } from "./store/"
import { fetchPref } from "./apiClient"

//components
import Header from "./components/Header"
import Main from "./components/Main"
import Chart from "./components/Chart"
import PrefCheckBoxGroup from "./components/PrefCheckBoxGroup"

// TODO: ダミーデータ

const selectedPref = ["北海道", "東京"]

const data = [
  { year: 2020, 北海道: 1000, 東京: 2000 },
  { year: 2022, 北海道: 1500, 東京: 1000 },
]

const App: React.FC = () => {
  const [state, dispatch] = useReducer(rootReducer, {
    fetching: false,
    selected: [],
    data: null,
    prefMap: null,
  })

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
        {state.prefMap && (
          <>
            <PrefCheckBoxGroup name="prefecture" prefMap={state.prefMap} />
            <Chart selectedPref={selectedPref} data={data} />
          </>
        )}
      </Main>
    </>
  )
}

export default App
