import styled from '@emotion/styled'
import { Link } from 'gatsby'
import React, { FunctionComponent, ReactNode } from 'react'

export type CategoryListProps = {
  selectedCategory: string
  categoryList: {
    [key: string]: number
  }
}

type CategoryItemProps = {
  active: boolean
}

type GatsbyLinkProps = {
  children: ReactNode
  className?: string
  to: string
} & CategoryListProps

const CategoryListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 768px;
  margin: 60px auto 0;
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 20px;
  }
`

/*
to, rest 매개변수를 전달하는 Link를 반환하는 익명 컴포넌트인데 active, to, ...rest를 props로 받음
active, to, ...rest를 받아서 to랑 나머지 전달

GatsbyLinkProps => Link Wrapper 익명 컴포넌트 props type

CategoryItemProps => 결국 반환되는 styled link 컴포넌트의 props 

결국 반환되는 styled link 컴포넌트는 active만 사용하니깐 active type check만 해줌

active를 어떻게 Link에서 쓰냐면, 전달받은 active를 클로저로 사용함

styled(({active, to, ...rest를 props으로 받는 익명 컴포넌트}) => (<Link>에 props(to, rest 매개변수) 전달 후 반환))

*/

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoryItem = styled(({ active, to, ...props }: GatsbyLinkProps) => (
  <Link to={to} {...props} />
))<CategoryItemProps>`
  margin-right: 15px;
  margin-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 7px;
  border-radius: 15px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  font-size: 15px;
  font-weight: ${({ active }) => (active ? '800' : '400')};
  color: ${({ active }) => (active ? 'rgba(0,100,255,0.8)' : 'black')};
  border: ${({ active }) =>
    active ? '1px solid rgba(0,100,255,0.8)' : '1px solid rgba(0, 0, 0, 0.5)'};
  cursor: pointer;
  &:last-of-type {
    margin-right: 0px;
  }
  @media (max-width: 768px) {
    font-size: 15px;
    margin-right: 10px;
    margin-top: 5px;
  }
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    color: rgba(0, 100, 255, 0.8);
    border: 1px solid rgba(0, 100, 255, 0.8);
  }
`

const CategoryList: FunctionComponent<CategoryListProps> = function ({
  selectedCategory,
  categoryList,
}) {
  return (
    <CategoryListWrapper>
      {Object.entries(categoryList).map(([name, count]) => (
        <CategoryItem
          to={`/?category=${name}`}
          active={name === selectedCategory}
          key={name}
        >
          {name}({count})
        </CategoryItem>
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
