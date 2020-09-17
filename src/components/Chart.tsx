import React, { useMemo } from "react"
import { LineChart, XAxis, YAxis, Legend, Line, Label, Tooltip } from "recharts"
import { font as baseFont } from "../styles"

import { StateType } from "../store"

type LineColors = { [K: string]: { color: string; dash: string } }

type ChartProps = {
  data: NonNullable<StateType["data"]>
  displayItems: StateType["displayItems"]
  prefMap: StateType["prefMap"]
  width: number
}

const generateLineColors = (prefMap: StateType["prefMap"]) =>
  [...prefMap].reduce<LineColors>((colors, [, name], index) => {
    return {
      ...colors,
      [name]: {
        color: `hsl(${index * 7.6}, 70%, 50%)`,
        dash: `${index % 2 === 0 ? "1 0" : "2 2"}`,
      },
    }
  }, {})
const chartMargin = { top: 20, right: 100, left: 30, bottom: 20 }

const Chart: React.FC<ChartProps> = ({
  data,
  displayItems,
  prefMap,
  width,
}) => {
  const lineColors = useMemo(() => generateLineColors(prefMap), [prefMap])

  return (
    <LineChart
      width={width - chartMargin.left - chartMargin.right}
      height={500}
      data={data}
      margin={chartMargin}
    >
      {displayItems.map((pref, i) => (
        <Line
          key={i}
          type="monotone"
          dataKey={pref}
          stroke={lineColors[pref].color}
          strokeDasharray={lineColors[pref].dash}
        />
      ))}
      <Legend
        layout="vertical"
        verticalAlign="top"
        wrapperStyle={{
          top: 0,
          right: 0,
          transform: "translate(50%, 100%)",
        }}
        iconType="plainline"
        height={30}
        iconSize={20}
      />
      <Tooltip
        labelStyle={{
          color: baseFont.color.dark,
        }}
        contentStyle={{
          borderRadius: "8px",
          fontSize: baseFont.size,
          backgroundColor: "#fff",
          border: "none",
        }}
      />
      <XAxis
        tick={{ fill: baseFont.color.gray, fontSize: baseFont.size }}
        dataKey="year"
      >
        <Label fill={baseFont.color.gray} value="年度" position="bottom" />
      </XAxis>
      <YAxis tick={{ fill: baseFont.color.gray, fontSize: baseFont.size }}>
        <Label
          fill={baseFont.color.gray}
          value="人口数"
          position="top"
          offset={30}
        />
      </YAxis>
    </LineChart>
  )
}

export default React.memo(Chart)
