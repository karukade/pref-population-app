import {
  ResasApiPrefecturesResponse,
  PopulationInfo,
  PrefInfo,
} from "../apiClient"
import { mergePopulationData, ChartBase } from "./chart"

export type StateType = {
  fetching: boolean
  fetched: number[]
  fetchItem: PrefInfo | null
  fetchingItems: number[]
  selected: number[]
  data: ChartBase[] | null
  dataPool: PopulationInfo[]
  prefMap: Map<number, string>
}

export type Actions =
  | { type: "setFetching"; payload: boolean }
  | { type: "addData"; payload: PopulationInfo }
  | { type: "setPrefMap"; payload: ResasApiPrefecturesResponse["result"] }
  | { type: "setSelected"; payload: number }
  | { type: "removeSelected"; payload: number }

export const rootReducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
    case "setFetching":
      return { ...state, fetching: action.payload }

    case "addData": {
      const fetchedPref = action.payload.prefInfo.prefCode
      const fetchingItems = state.fetchingItems.filter(
        (prefCode) => prefCode !== fetchedPref
      )
      const fetching = fetchingItems.length > 0
      const dataPool = [...state.dataPool, action.payload]

      // 他にリクエスト中のデータがあれば更新しない = グラフの描画を抑止
      const data = fetching
        ? state.data
        : mergePopulationData(state.data, dataPool)

      return {
        ...state,
        data,
        dataPool: fetching ? dataPool : [],
        fetchingItems,
        fetching,
        fetched: [...state.fetched, fetchedPref],
      }
    }

    case "setPrefMap": {
      const prefMap = action.payload.map(
        ({ prefCode, prefName }) => [prefCode, prefName] as const
      )
      return { ...state, prefMap: new Map(prefMap) }
    }

    case "setSelected": {
      if (state.selected.includes(action.payload)) return state
      const selectedPref = action.payload

      const fetchItem =
        state.fetched.includes(selectedPref) && state.prefMap.has(selectedPref)
          ? null
          : {
              prefCode: selectedPref,
              prefName: state.prefMap.get(selectedPref) as string,
            }

      const fetchingItems = fetchItem
        ? [...state.fetchingItems, selectedPref]
        : state.fetchingItems

      return {
        ...state,
        selected: [...state.selected, action.payload],
        fetchItem,
        fetchingItems,
        fetching: fetchingItems.length > 0,
      }
    }

    case "removeSelected": {
      if (!state.selected.includes(action.payload)) return state
      return {
        ...state,
        selected: state.selected.filter(
          (prefCode) => prefCode !== action.payload
        ),
      }
    }
  }
}
