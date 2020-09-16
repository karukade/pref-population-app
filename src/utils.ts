// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const debounce = <P extends unknown[]>(
  func: (...args: P) => void,
  shouldInvoke?: (...args: P) => boolean,
  waitTime = 200
): ((...args: P) => void) => {
  let timer: number
  return (...args) => {
    if (timer) clearTimeout(timer)
    if (shouldInvoke && shouldInvoke(...args)) {
      func(...args)
      return
    }
    timer = setTimeout(() => func(...args), waitTime)
  }
}
