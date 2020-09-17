// Apiのレスポンスをステータスとエラー情報を加えてラップするオブジェクト
type FetchResult<R = null> = {
  err: R extends null ? true : false
  status: number
  data: R
  meta?: any
}

// 該当する年の総人口を表すオブジェクト
export type PopulationData = {
  year: number
  value: number
}

export type PrefInfo = {
  prefName: string
  prefCode: number
}

// ResasApiからのレスポンスのベースとなる型
type ResasApiResPonseBase<T> = {
  message: null | string
  result: T
}

// 都道府県一覧APIからのレスポンス
export type ResasApiPrefecturesResponse = ResasApiResPonseBase<PrefInfo[]>

// 人口構成APIからのレスポンス
export type ResasApiPopulationResponse = ResasApiResPonseBase<{
  boundaryYear: number
  data: { label: string; data: PopulationData[] }[]
}>

// 総人口、都道府県名、コード
export type PopulationInfo = {
  prefInfo: PrefInfo
  population: PopulationData[]
}

export type FetchPrefPopulationResult = FetchResult<PopulationInfo>

// ResasAPIへフェッチする関数
// urlに指定したエンドポイントにリクエストを投げる
export const fetchDataFromResasApi = <R>(
  url: string
): Promise<FetchResult<R> | FetchResult> => {
  const baseUrl = "https://opendata.resas-portal.go.jp/api/v1/"
  const init: RequestInit = {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.API_KEY as string,
    },
  }

  return fetch(`${baseUrl}${url}`, init)
    .then(async (res) => {
      if (!res.ok) {
        return { err: true, status: res.status, data: null } as any
      }
      const data: R = await res.json()
      return { err: false, data, status: res.status }
    })
    .catch((e) => {
      return {
        err: true,
        status: undefined,
        data: null,
        meta: navigator.onLine ? e : "offline",
      } as any
    })
}

export const fetchPref = async () => {
  const res = await fetchDataFromResasApi<ResasApiPrefecturesResponse>(
    "prefectures"
  )
  if (!res.data) return Promise.reject(res)
  return res
}

// APIのレスポンスから総人口のみを抽出する
const extractPopulation = (
  result: ResasApiPopulationResponse["result"]["data"]
) => {
  const population = result.find(({ label }) => label === "総人口")
  return population && population.data
}

export const fetchPrefPopulation = async (prefInfo: PrefInfo) => {
  const params = objToQueryParams({
    prefCode: prefInfo.prefCode,
    cityCode: "-",
  })
  const res = await fetchDataFromResasApi<ResasApiPopulationResponse>(
    `population/composition/perYear${params}`
  )
  if (!res.data) return Promise.reject(res)

  const population = extractPopulation(res.data.result.data)

  if (!population) throw new Error("population undefined")

  const result: FetchPrefPopulationResult = {
    ...res,
    data: { prefInfo, population },
  }
  return result
}

const objToQueryParams = (paramObj: { [k: string]: string | number }) => {
  return Object.entries(paramObj).reduce(
    (q, [key, value]) => `${q}&${key}=${value}`,
    "?"
  )
}
