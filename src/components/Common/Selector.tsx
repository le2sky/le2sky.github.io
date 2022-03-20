import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import React, { FunctionComponent, useState } from 'react'

const PostPageTogglesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 768px;
  margin: 0 auto;
  height: 60px;
  @media (max-width: 768px) {
    width: 100%;
    height: 80px;
    padding: 0 20px;
  }
`
const SelectButton = styled.button`
  ${({ active }) => {
    return css`
      background-color: inherit;
      color: ${active ? 'rgba(0, 100, 255, 0.8)' : 'black'};
      border: none;
      position: relative;
      height: 40px;
      font-size: 18px;
      font-weight: ${active ? 800 : 400};
      padding: 0 2em;
      cursor: pointer;
      transition: 0.3s ease all;
      outline: none;
      border-bottom: ${active ? '1px solid rgba(0, 100, 255, 0.8)' : 'none'};
      &:hover {
        color: rgba(0, 100, 255, 0.8);
      }
      @media (max-width: 768px) {
        font-size: 16px;
      }
    `
  }}
`

const Selector: FunctionComponent = function ({ type }) {
  return (
    <PostPageTogglesWrapper>
      <Link to="/post">
        <SelectButton active={type === 'post' ? true : false}>글</SelectButton>
      </Link>
      <Link to="/guest">
        <SelectButton active={type === 'guest' ? true : false}>
          방명록
        </SelectButton>
      </Link>
      <Link to="/info">
        <SelectButton active={type === 'info' ? true : false}>
          소개
        </SelectButton>
      </Link>
    </PostPageTogglesWrapper>
  )
}
export default Selector
