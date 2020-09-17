import {
  ResasApiPrefecturesResponse,
  PopulationInfo,
  PrefInfo,
} from "../apiClient"
import { mergePopulationData, computeDisplayItems, ChartBase } from "./chart"
import { getErrorMessage, ErrorPayLoad } from "./error"

export type ActionBase<T extends string, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P }

export type StateType = Readonly<{
  fetching: boolean
  fetchItem: PrefInfo | null
  fetched: PrefInfo["prefCode"][]
  fetchingItems: PrefInfo["prefCode"][]
  selected: PrefInfo["prefCode"][]
  displayItems: PrefInfo["prefName"][]
  data: ChartBase[] | null
  dataPool: PopulationInfo[]
  prefMap: Map<PrefInfo["prefCode"], PrefInfo["prefName"]>
  requestError: { message: string; status?: number } | null
}>

export type Actions =
  | ActionBase<"setFetching", boolean>
  | ActionBase<"addData", PopulationInfo>
  | ActionBase<"setPrefMap", ResasApiPrefecturesResponse["result"]>
  | ActionBase<"setSelected", number>
  | ActionBase<"removeSelected", number>
  | ActionBase<"setRequestError", ErrorPayLoad>
  | ActionBase<"clearRequestError">

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
      const fetched = [...state.fetched, fetchedPref]

      // 他にリクエスト中のデータがあれば更新しない = グラフの描画を抑止
      const data = fetching
        ? state.data
        : mergePopulationData(state.data, dataPool)

      const displayItems = fetching
        ? state.displayItems
        : computeDisplayItems({
            fetched,
            selected: state.selected,
            prefMap: state.prefMap,
          })

      return {
        ...state,
        data,
        dataPool: fetching ? dataPool : [],
        fetchingItems,
        fetching,
        fetched: [...state.fetched, fetchedPref],
        displayItems,
        requestError: null,
      }
    }

    case "setPrefMap": {
      const prefMapArray = action.payload.map(
        ({ prefCode, prefName }) => [prefCode, prefName] as const
      )
      const prefMap = new Map(prefMapArray)

      return { ...state, prefMap }
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

      const selected = [...state.selected, action.payload]

      const displayItems = computeDisplayItems({
        selected,
        fetched: state.fetched,
        prefMap: state.prefMap,
      })

      return {
        ...state,
        selected,
        fetchItem,
        fetchingItems,
        fetching: fetchingItems.length > 0,
        displayItems,
      }
    }

    case "removeSelected": {
      if (!state.selected.includes(action.payload)) return state
      const selected = state.selected.filter(
        (prefCode) => prefCode !== action.payload
      )
      const displayItems = computeDisplayItems({
        selected,
        fetched: state.fetched,
        prefMap: state.prefMap,
      })

      return {
        ...state,
        selected,
        displayItems,
      }
    }

    case "setRequestError": {
      return {
        ...state,
        fetchingItems: [],
        fetchItem: null,
        fetching: false,
        requestError: {
          message: getErrorMessage(action.payload),
          status: action.payload.status,
        },
      }
    }

    case "clearRequestError": {
      return {
        ...state,
        requestError: null,
      }
    }
  }
}
