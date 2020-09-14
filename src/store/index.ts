import { Populations, Prefectures } from "../apiClient"

type Actions =
  | { type: "setFetching"; payload: boolean }
  | { type: "addData"; payload: { prefCode: number; data: Populations } }
  | { type: "removeData"; payload: { prefCode: number } }
  | { type: "setPrefMap"; payload: Prefectures["result"] }

export type StateType = {
  fetching: boolean
  selected: { value: number; name: string }[] | []
  data: { year: number; [k: string]: number } | null
  prefMap: Map<number, string> | null
}

export const rootReducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
    case "setFetching":
      return { ...state, fetching: action.payload }
    case "addData":
      return { ...state, data: state.data }
    case "removeData":
      return { ...state, data: state.data }
    case "setPrefMap": {
      const prefMap = action.payload.map(
        ({ prefCode, prefName }) => [prefCode, prefName] as const
      )
      return { ...state, prefMap: new Map(prefMap) }
    }
  }
}
