type ErrorType = "prefList" | "population"
export type ErrorPayLoad = { type: ErrorType; status?: number; meta?: unknown }

const errTypeMap = {
  prefList: "都道府県リスト",
  population: "総人口",
} as const

const errTypePrefix = (type: ErrorType) => `${errTypeMap[type]}取得時エラー。`

export const getErrorMessage = ({ status, type, meta }: ErrorPayLoad) => {
  if (meta === "offline")
    return `${errTypePrefix(type)}インターネットに接続されていないようです。`

  if (!status) return `${errTypePrefix(type)}原因不明のエラー`

  if (status >= 500)
    return `${errTypePrefix(type)}サーバーに何か問題が発生しているようです。`

  if (status === 408) return `${errTypePrefix(type)}タイムアウト`

  if (status === 429)
    return "あなたの操作にAPIサーバーがついていけていないようです。もう少しだけゆっくり操作してください。"

  return `${errTypePrefix(
    type
  )}実装に不備がありうまくデータを取得できませんでした。。申し訳ありません。`
}
