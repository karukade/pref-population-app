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
  // リクエスト中かどうか
  fetching: boolean

  fetchItem: PrefInfo | null

  // データ取得済の都道府県コードのリスト
  fetched: PrefInfo["prefCode"][]

  // リクエスト中の都道府県コードのリスト
  fetchingItems: PrefInfo["prefCode"][]

  // 選択中の都道府県コード(リクエスト中の都道府県も含む)
  selected: PrefInfo["prefCode"][]

  // 選択中かつデータ取得済の都道府県名。グラフに表示する都道府県。
  displayItems: PrefInfo["prefName"][]

  // グラフに表示するデータ（取得したデータは全てここに格納する）
  data: ChartBase[] | null

  // 複数並行してリクエストしている間に返ってきたデータを一時的に格納
  dataPool: PopulationInfo[]

  // 都道府県一覧
  prefMap: Map<PrefInfo["prefCode"], PrefInfo["prefName"]>

  // APIへのリクエストエラー
  requestError: { message: string; status?: number } | null
}>

export type Actions =
  | ActionBase<"addData", PopulationInfo>
  | ActionBase<"setPrefMap", ResasApiPrefecturesResponse["result"]>
  | ActionBase<"setSelected", number>
  | ActionBase<"removeSelected", number>
  | ActionBase<"setRequestError", ErrorPayLoad>
  | ActionBase<"clearRequestError">

export const rootReducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
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

      const fetchItem = state.fetched.includes(selectedPref)
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
