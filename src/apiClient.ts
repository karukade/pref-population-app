export type Prefectures = {
  message: null | string
  result: { prefCode: number; prefName: string }[]
}

export type Populations = {
  message: null | string
  result: {
    boundaryYear: number
    data: { label: string; data: { year: number; value: number }[] }[]
  }
}

export const fetchDataFromResasApi = <R>(
  url: string
): Promise<{
  err: boolean
  status: number
  data: null | R
}> => {
  const baseUrl = "https://opendata.resas-portal.go.jp/api/v1/"
  const init: RequestInit = {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.API_KEY as string,
    },
  }

  return fetch(`${baseUrl}${url}`, init).then(async (res) => {
    if (!res.ok) return { err: true, status: res.status, data: null }
    const data: R = await res.json()
    return { err: false, status: res.status, data }
  })
}

export const fetchPref = () => fetchDataFromResasApi<Prefectures>("prefectures")
