import styled from '@emotion/styled'
import React, { FunctionComponent } from 'react'

type TitleProps = {
  title: string
}

const TitleWrapper = styled.div`
  width: 768px;
  margin: 0 auto;
  font-size: 25px;
  font-weight: 700;
  color: black;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 20px;
    padding: 0 20px;
  }
`

const Title: FunctionComponent<TitleProps> = function ({ title }) {
  return <TitleWrapper>{title}</TitleWrapper>
}

export default Title
