import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { useElmWidth } from "../hooks/useElmWidth"
import Spinner from "./Spinner"
import { backGround } from "../styles"

const Container = styled.div`
  position: relative;
`

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${backGround.base};
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  > svg {
    z-index: 1;
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${backGround.base};
    opacity: 0.5;
  }
`

const ChartContainer: React.FC<{
  renderChart: (width: number) => React.ReactNode
  fetching: boolean
}> = ({ renderChart, fetching }) => {
  const [spinner, setSpinner] = useState<React.ReactNode>()
  const [elmRef, width] = useElmWidth<HTMLDivElement>()

  // 全てのリクエストが200ms以内に返ってこなければスピナーを表示する
  useEffect(() => {
    const spinner = fetching && (
      <Overlay>
        <Spinner />
      </Overlay>
    )
    const timer = setTimeout(() => {
      setSpinner(spinner)
    }, 200)

    return () => clearTimeout(timer)
  }, [fetching])

  return (
    <Container ref={elmRef}>
      {spinner}
      {renderChart(width)}
    </Container>
  )
}
export default ChartContainer
