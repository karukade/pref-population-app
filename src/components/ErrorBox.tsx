import React from "react"
import styled from "styled-components"
import { backGround, font } from "../styles"
import { Actions } from "../store"

const Box = styled.div`
  position: relative;
  background-color: ${backGround.baseLight};
  border-radius: 8px;
  padding: 16px;
`

const CloseButton = styled.button`
  width: 18px;
  height: 18px;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background-color: ${font.color.gray};
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

const ErrorBox: React.FC<{
  message?: string
  dispatch: React.Dispatch<Actions>
}> = ({ message, dispatch }) => {
  return (
    <>
      {message && (
        <Box>
          <ButtonWrapper>
            <CloseButton
              onClick={() => dispatch({ type: "clearRequestError" })}
            />
          </ButtonWrapper>
          {message}
        </Box>
      )}
    </>
  )
}

export default ErrorBox
