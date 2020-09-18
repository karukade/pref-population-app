import { useLayoutEffect, useRef, useState } from "react"
import { debounce } from "../utils"

export const useElmWidth = <T extends HTMLElement>(): [
  React.RefObject<T>,
  number
] => {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState<number>(0)

  useLayoutEffect(() => {
    if (!ref.current) return
    const onResize = debounce(
      () => {
        ref.current && setWidth(ref.current.clientWidth)
      },
      { useAnimationFrame: true }
    )

    setWidth(ref.current.clientWidth)
    window.addEventListener("resize", onResize)

    return () => window.removeEventListener("resize", onResize)
  }, [])
  return [ref, width]
}
