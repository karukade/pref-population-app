import { ResasApiPrefecturesResponse, PopulationInfo } from "../apiClient"
import { mergePopulationData, ChartBase } from "./chart"

export type StateType = {
  fetching: boolean
  fetched: number[]
  selected: number[]
  data: ChartBase[] | null
  prefMap: Map<number, string> | null
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
      const data = mergePopulationData(state.data, action.payload)
      return {
        ...state,
        data,
        fetched: [...state.fetched, action.payload.prefInfo.prefCode],
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
      return {
        ...state,
        selected: [...state.selected, action.payload],
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
