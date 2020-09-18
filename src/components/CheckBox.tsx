import React, { useCallback, useState } from "react"
import { debounce } from "../utils"
import styled from "styled-components"

export type CheckBoxProps = {
  value: string | number
  name: string
  label: string
  initialChecked?: boolean
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
  initialChecked,
}) => {
  const [checked, setChecked] = useState(initialChecked || false)
  const debouncedOnChange = useCallback(
    debounce((checked: boolean) => {
      _onChange({ value, checked, label })
    }),
    [_onChange]
  )

  const onChange = (e: ChangeEvent) => {
    const { checked } = e.target
    setChecked(checked)
    debouncedOnChange(checked)
  }
  const onKeyPress = (e: KeyPressEvent) => {
    if (e.key === "Enter") {
      const { checked } = e.target as HTMLInputElement
      setChecked(!checked)
      debouncedOnChange(!checked)
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
