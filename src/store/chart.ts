import { PopulationInfo } from "../apiClient"

export type ChartBase = { year: number; [k: string]: number }

// ベースとなる総人口のオブジェクトに該当する年の人口をマージする
// 以下に続くmergePopulationData内使用する関数
const mergePopulation = (
  refIndex: number,
  baseObj: ChartBase,
  populationInfo: PopulationInfo
): ChartBase => {
  const {
    population,
    prefInfo: { prefName },
  } = populationInfo

  return {
    ...baseObj,
    [prefName]: population[refIndex].value,
  }
}

// storeのグラフ描画用データにapiから取得してきた値をマージする
export const mergePopulationData = (
  storedData: ChartBase[] | null,
  payload: PopulationInfo[]
): ChartBase[] => {
  // ベースとなる都道府県とそれ以外で分ける
  const [base, ...rest] = payload

  const data = base.population.map((populationData, refIndex) => {
    // storeにすでに取得してきたデータがあればマージ
    // storeの値がnullであればベースとなる値で初期化する
    const baseObj = {
      ...(storedData ? storedData[refIndex] : { year: populationData.year }),
      [base.prefInfo.prefName]: populationData.value,
    }

    // ベース以外の都道府県のデータがあればマージする
    return rest.reduce(
      (result, populationInfo) =>
        mergePopulation(refIndex, result, populationInfo),
      baseObj
    )
  })
  return data
}
