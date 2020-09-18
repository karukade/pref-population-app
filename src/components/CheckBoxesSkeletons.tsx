import React from "react"
import styled, { keyframes } from "styled-components"

const loadingAnimation = keyframes`
  0% {
      background-position: 100% 50%
  }

  to {
      background-position: 0 50%
  }
`

const addUnitIfNeed = (value: number | string, unit = "px") =>
  typeof value === "number" ? `${value}${unit}` : value

export const SkeletonBase = styled.div<{
  width?: number | string
  height?: number | string
}>`
  width: ${({ width }) => (width ? addUnitIfNeed(width) : "100%")};
  height: ${({ height }) => (height ? addUnitIfNeed(height) : "1.5em")};
  background: linear-gradient(90deg, #1d1d27 25%, #1f2233 37%, #1d1d27 63%);
  background-size: 400% 100%;
  animation: ${loadingAnimation} ease 1.4s infinite;
`

const CheckBoxesSkeletons: React.FC = () => (
  <>
    {Array(47)
      .fill(0)
      .map((_, i) => (
        <SkeletonBase as="li" key={i} width={"5em"} />
      ))}
  </>
)

export default CheckBoxesSkeletons
