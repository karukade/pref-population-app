import React, { useReducer, useEffect } from "react"
import Header from "./components/Header"
import Main from "./components/Main"
import Chart from "./components/Chart"
import CheckBoxGroup, { CheckBoxGroupeProps } from "./components/CheckBoxGroup"

// TODO: ダミーデータ
const prefOptions: CheckBoxGroupeProps["options"] = [
  {
    value: 1,
    label: "北海道",
  },
]

const selectedPref = ["北海道", "東京"]

const data = [
  { year: 2020, 北海道: 1000, 東京: 2000 },
  { year: 2022, 北海道: 1500, 東京: 1000 },
]

const App: React.FC = () => {
  return (
    <>
      <Header>都道府県別の総人口推移グラフ</Header>
      <Main>
        <CheckBoxGroup name="prefecture" options={prefOptions} />
        <Chart selectedPref={selectedPref} data={data} />
      </Main>
    </>
  )
}

export default App
