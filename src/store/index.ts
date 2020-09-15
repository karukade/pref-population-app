import { Prefectures, PopulationAmount } from "../apiClient"

export type Actions =
  | { type: "setFetching"; payload: boolean }
  | { type: "addData"; payload: PopulationAmount[] }
  | { type: "removeData"; payload: { prefCode: number } }
  | { type: "setPrefMap"; payload: Prefectures["result"] }
  | { type: "setFetched"; payload: number }
  | { type: "setSelected"; payload: number }

export type StateType = {
  fetching: boolean
  fetched: number[]
  selected: number[]
  data: { year: number; [k: string]: number }[] | null
  prefMap: Map<number, string> | null
}

export const rootReducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
    case "setFetching":
      return { ...state, fetching: action.payload }

    case "addData": {
      const [base, ...rest] = action.payload
      // TODO: apiからのレスポンスをグラフ表示用のデータに変換する
      return { ...state, data: state.data }
    }

    case "removeData":
      return { ...state, data: state.data }

    case "setPrefMap": {
      const prefMap = action.payload.map(
        ({ prefCode, prefName }) => [prefCode, prefName] as const
      )
      return { ...state, prefMap: new Map(prefMap) }
    }

    case "setFetched": {
      if (state.fetched.includes(action.payload)) return state
      return { ...state, fetched: [...state.fetched, action.payload] }
    }

    case "setSelected": {
      return { ...state, selected: [...state.fetched, action.payload] }
    }
  }
}
