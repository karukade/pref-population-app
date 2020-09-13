import React from "react"

export type CheckBoxProps = {
  value: string | number
  name: string
  label: string
  onChange: (info: { value: string; checked: boolean }) => void
}

const CheckBox: React.FC<CheckBoxProps> = ({
  onChange,
  label,
  ...restProps
}) => {
  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    onChange({ value, checked })
  }
  return (
    <label>
      <input type="checkbox" {...restProps} onChange={_onChange} />
      {label}
    </label>
  )
}

export default React.memo(CheckBox)
