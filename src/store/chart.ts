import { PopulationInfo } from "../apiClient"

export type ChartBase = { year: number; [k: string]: number }

// storeのグラフ描画用データにapiから取得してきた値をマージする
export const mergePopulationData = (
  storedData: ChartBase[] | null,
  payload: PopulationInfo
): ChartBase[] => {
  const data = payload.population.map((populationData, refIndex) => {
    // storeにすでに取得してきたデータがあればマージ
    // storeの値がnullであればベースとなる値で初期化する
    return {
      ...(storedData ? storedData[refIndex] : { year: populationData.year }),
      [payload.prefInfo.prefName]: populationData.value,
    }
  })
  return data
}
