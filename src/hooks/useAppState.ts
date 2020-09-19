import { useReducer, useEffect } from "react"
import { rootReducer, StateType, Actions } from "../store"

import { fetchPrefPopulation, fetchPref, PrefInfo } from "../apiClient"

// 都道府県一覧を取得してStoreにdispatch
const setPrefList = async (
  dispatch: React.Dispatch<Actions>,
  initialPref?: StateType["selected"]
) => {
  const prefList = await fetchPref().catch((e) => {
    dispatch({
      type: "setRequestError",
      payload: { type: "prefList", status: e?.status, meta: e?.meta },
    })
  })

  if (!prefList) return

  dispatch({ type: "setPrefMap", payload: prefList.data.result })

  // グラフがないと何ができるのか分からないのでデフォルトで任意の都道府県を表示できる
  initialPref?.forEach((prefCode) =>
    dispatch({ type: "setSelected", payload: prefCode })
  )
}

// 総人口を取得してStoreにdispatch
const setPopulation = async (
  selectedPref: PrefInfo,
  dispatch: React.Dispatch<Actions>
) => {
  const res = await fetchPrefPopulation(selectedPref).catch((e) => {
    dispatch({
      type: "setRequestError",
      payload: { type: "population", status: e?.status, meta: e?.meta },
    })
  })
  if (!res) return
  dispatch({ type: "addData", payload: res.data })
}

export const useAppState = (initialPref?: StateType["selected"]) => {
  const [
    { data, prefMap, fetchItem, fetching, requestError, displayItems },
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

  // 都道府県一覧を取得する
  useEffect(() => {
    setPrefList(dispatch, initialPref)
  }, [dispatch, initialPref])

  // 総人口を取得する
  useEffect(() => {
    if (!fetchItem) return
    setPopulation(fetchItem, dispatch)
  }, [dispatch, fetchItem])

  return [
    {
      data,
      prefMap,
      fetching,
      requestError,
      displayItems,
    },
    dispatch,
  ] as const
}
