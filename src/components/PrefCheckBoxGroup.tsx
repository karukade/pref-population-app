import React, { useEffect, useState, useCallback, useRef } from "react"

import CheckBox, { CheckBoxProps } from "./CheckBox"
import { fetchPrefPopulation } from "../apiClient"

import { StateType, Actions } from "../store"
import styled from "styled-components"

const CheckBoxList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  > li {
    padding: 4px 8px;
  }
`

export type PrefCheckBoxGroupProps = {
  dispatch: React.Dispatch<Actions>
  name: string
  prefMap: NonNullable<StateType["prefMap"]>
  selected: StateType["selected"]
  fetched: StateType["fetched"]
}

type FetchQueue = { prefCode: number; prefName: string }[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debounce = <P extends unknown[], R>(
  func: (...args: P) => R,
  shouldExecute?: (...args: P) => boolean,
  waitTime = 200
): ((...args: P) => void) => {
  let timer: number
  return (...args) => {
    if (timer) clearTimeout(timer)
    if (shouldExecute && shouldExecute(...args)) {
      func(...args)
      return
    }
    timer = setTimeout(() => func(...args), waitTime)
  }
}

const executeFetchPopulationQueue = async (
  queue: FetchQueue,
  setQueue: React.Dispatch<React.SetStateAction<FetchQueue>>,
  dispatch: React.Dispatch<Actions>
) => {
  const requests = queue.map((prefInfo) => fetchPrefPopulation(prefInfo))
  setQueue([])
  const res = await Promise.all(requests).catch((e) => {
    if (typeof e === "object" && e.status === 429) {
      // handle Too Many Requests
    }
  })
  if (!res) return // Too Many Requests
  dispatch({ type: "addData", payload: res.map(({ data }) => data) })
}

const PrefCheckBoxGroup: React.FC<PrefCheckBoxGroupProps> = ({
  prefMap,
  name,
  dispatch,
  fetched,
}) => {
  const [queue, setQueue] = useState<FetchQueue>([])
  const debouncedFetchPref = useRef(debounce(executeFetchPopulationQueue))

  // TODO onchangeをデバウンスする
  // TODO queue、fetchedが更新されるたびに関数が生成されてchekboxが無駄に再描画されているので修正する
  const onChange: CheckBoxProps["onChange"] = useCallback(
    ({ value, checked, label }) => {
      if (typeof value !== "number") return

      if (!checked) {
        dispatch({ type: "removeSelected", payload: value })
        return
      }

      dispatch({ type: "setSelected", payload: value })

      // 総人口を取得済であればリクエストしない
      if (fetched.includes(value)) return

      // リクエストのキューに追加
      if (queue.findIndex((item) => item.prefCode === value) === -1)
        setQueue((queue) => [...queue, { prefCode: value, prefName: label }])
    },
    [queue, fetched, dispatch]
  )

  useEffect(() => {
    if (queue.length === 0) return
    debouncedFetchPref.current(queue, setQueue, dispatch)
  }, [queue, dispatch])

  return (
    <CheckBoxList>
      {[...prefMap].map(([value, label]) => (
        <li key={value}>
          <CheckBox
            name={name}
            value={value}
            label={label}
            onChange={onChange}
          />
        </li>
      ))}
    </CheckBoxList>
  )
}

export default React.memo(PrefCheckBoxGroup)
