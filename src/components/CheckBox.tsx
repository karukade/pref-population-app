import React, { useCallback } from "react"
import { debounce } from "../utils"
import styled from "styled-components"

export type CheckBoxProps = {
  value: string | number
  name: string
  label: string
  checked?: boolean
  onChange: (info: {
    value: string | number
    checked: boolean
    label: string
  }) => void
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type KeyPressEvent = React.KeyboardEvent<HTMLInputElement>

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  > * + * {
    margin-left: 4px;
  }
`

const CheckBox: React.FC<CheckBoxProps> = ({
  onChange: _onChange,
  label,
  value,
  name,
  checked,
}) => {
  const debouncedOnChange = useCallback(
    debounce((checked: boolean) => {
      _onChange({ value, checked, label })
    }),
    [_onChange]
  )

  const onChange = (e: ChangeEvent) => {
    const { checked } = e.target
    debouncedOnChange(checked)
  }
  const onKeyPress = (e: KeyPressEvent) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement
      debouncedOnChange(!target.checked)
    }
  }
  return (
    <Label>
      <input
        type="checkbox"
        value={value}
        name={name}
        onKeyPress={onKeyPress}
        onChange={onChange}
        checked={checked}
      />
      <span>{label}</span>
    </Label>
  )
}

export default React.memo(CheckBox)
