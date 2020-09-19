import React, { Suspense } from "react"
import styled from "styled-components"

import { useAppState } from "../hooks/useAppState"

import PrefCheckBoxGroup from "./PrefCheckBoxGroup"
import ErrorBox from "./ErrorBox"
import { SkeletonBase } from "./CheckBoxesSkeletons"

const ChartContainer = React.lazy(() => import("./ChartContainer"))
const Container = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`

// デフォルトでグラフに表示する都道府県（北海道）
const initialPref = [1]

const Main: React.FC = () => {
  const [
    { data, prefMap, fetching, requestError, displayItems },
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
        initialCheckedValues={initialPref}
      />
      <Suspense fallback={<SkeletonBase height={500} />}>
        <ChartContainer
          fetching={fetching}
          data={data}
          displayItems={displayItems}
          prefMap={prefMap}
        />
      </Suspense>
    </Container>
  )
}

export default Main
