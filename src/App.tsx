import React from "react"
import { createGlobalStyle } from "styled-components"

//components
import Header from "./components/Header"
import Main from "./components/Main"

import { font, backGround } from "./styles"
import "ress/dist/ress.min.css"

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${backGround.base};
    font-size: ${font.size}px;
    font-family: ${font.family};
    color: ${font.color.base};
  }
`

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Header>都道府県別の総人口推移グラフ</Header>
      <Main />
    </>
  )
}

export default App
