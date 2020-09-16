import React from "react"
import { LineChart, XAxis, YAxis, Legend, Line, Label } from "recharts"

type ChartData = readonly {
  year: number
  [k: string]: number
}[]

type ChartProps = {
  data: ChartData
  selectedPref: string[]
}

const Chart: React.FC<ChartProps> = ({ data, selectedPref }) => {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 100, left: 20, bottom: 20 }}
    >
      {selectedPref.map((pref, i) => (
        <Line key={i} type="monotone" dataKey={pref} stroke="#8884d8" />
      ))}
      <Legend
        layout="vertical"
        verticalAlign="top"
        wrapperStyle={{
          top: 0,
          right: 0,
          transform: "translate(50%, 100%)",
        }}
        height={36}
      />
      <XAxis dataKey="year">
        <Label value="年度" position="bottom" />
      </XAxis>
      <YAxis>
        <Label value="人口数" position="top" offset={30} />
      </YAxis>
    </LineChart>
  )
}

export default React.memo(Chart)
