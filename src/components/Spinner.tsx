import React from "react"
import styled, { keyframes } from "styled-components"

const line = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(450deg);
  }
`

const rotate = keyframes`
  0% {
    stroke-dasharray: 2, 85.964;
    transform: rotate(0);
  }

  50% {
    stroke-dasharray: 65.973, 21.9911;
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dasharray: 2, 85.964;
    stroke-dashoffset: -65.973;
    transform: rotate(90deg);
  }
`

const Circle = styled.circle`
  animation: ${line} 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    ${rotate} 0.8s linear infinite;
  stroke-width: 1px;
  transform-origin: 50%;
`

const Spinner: React.FC<{
  width?: number
  height?: number
  stroke?: string
}> = ({ width = 50, height = 50, stroke = "#fff" }) => (
  <svg viewBox="0 0 32 32" width={width} height={height}>
    <Circle cx="16" cy="16" r="14" fill="none" stroke={stroke} />
  </svg>
)

export default Spinner
