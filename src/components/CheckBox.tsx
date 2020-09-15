import React from "react"

export type CheckBoxProps = {
  value: string | number
  name: string
  label: string
  onChange: (info: {
    value: string | number
    checked: boolean
    label: string
  }) => void
}

const CheckBox: React.FC<CheckBoxProps> = ({
  onChange,
  label,
  value,
  name,
}) => {
  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    onChange({ value, checked, label })
  }
  return (
    <label>
      <input type="checkbox" value={value} name={name} onChange={_onChange} />
      {label}
    </label>
  )
}

export default React.memo(CheckBox)
