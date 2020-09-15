type PopulationData = {
  year: number
  value: number
}

type FetchResult<R = null> = {
  err: R extends null ? true : false
  status: number
  data: R
}

export type PrefInfo = {
  prefName: string
  prefCode: number
}

export type Prefectures = {
  message: null | string
  result: { prefCode: number; prefName: string }[]
}

export type Populations = {
  message: null | string
  result: {
    boundaryYear: number
    data: { label: string; data: PopulationData[] }[]
  }
}

export type PopulationAmount = {
  prefInfo: PrefInfo
  population: PopulationData[]
}

export type FetchPrefPopulationResult = FetchResult<PopulationAmount>

export type ErrObj = FetchResult

export const fetchDataFromResasApi = <R>(
  url: string
): Promise<FetchResult<R> | ErrObj> => {
  const baseUrl = "https://opendata.resas-portal.go.jp/api/v1/"
  const init: RequestInit = {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.API_KEY as string,
    },
  }

  return fetch(`${baseUrl}${url}`, init).then(async (res) => {
    if (!res.ok) {
      return { err: true, status: res.status, data: null } as any
    }
    const data: R = await res.json()
    return { err: false, data, status: res.status }
  })
}

export const fetchPref = async () => {
  const res = await fetchDataFromResasApi<Prefectures>("prefectures")
  if (!res.data) return Promise.reject(res)
  return res
}

const extractPopulation = (result: Populations["result"]["data"]) => {
  const population = result.find(({ label }) => label === "総人口")
  return population && population.data
}

export const fetchPrefPopulation = async (prefInfo: PrefInfo) => {
  const params = objToQueryParams({
    prefCode: prefInfo.prefCode,
    cityCode: "-",
  })
  const res = await fetchDataFromResasApi<Populations>(
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
