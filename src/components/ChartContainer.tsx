import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { useElmWidth } from "../hooks/useElmWidth"
import { backGround } from "../styles"
import { StateType } from "../store"

import Chart from "./Chart"
import Spinner from "./Spinner"

const Container = styled.div`
  position: relative;
  min-height: 500px;
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

type ChartContainerProps = {
  fetching: boolean
  data: StateType["data"]
  displayItems: StateType["displayItems"]
  prefMap: StateType["prefMap"]
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  fetching,
  data,
  displayItems,
  prefMap,
}) => {
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
      {data && (
        <Chart
          data={data}
          displayItems={displayItems}
          prefMap={prefMap}
          width={width}
        />
      )}
    </Container>
  )
}
export default ChartContainer
