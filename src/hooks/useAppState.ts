import { useReducer, useEffect } from "react"
import { rootReducer, StateType } from "../store"

import { fetchPref } from "../apiClient"

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
    const getPrefList = async () => {
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
    getPrefList()
  }, [dispatch, initialPref])

  return [
    {
      data,
      prefMap,
      fetchItem,
      fetching,
      requestError,
      displayItems,
    },
    dispatch,
  ] as const
}
