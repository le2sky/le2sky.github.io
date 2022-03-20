import React, { FunctionComponent, memo, useMemo } from 'react'
import styled from '@emotion/styled'
import ProfileImage from './ProfileImage'
import GitIcon from '@mui/icons-material/GitHub'
import InstaIcon from '@mui/icons-material/Instagram'
import MailIcon from '@mui/icons-material/Mail'

import { IGatsbyImageData } from 'gatsby-plugin-image'
import { IconButton, Tooltip } from '@mui/material'
import { Link } from 'gatsby'

const Background = styled.div`
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 768px;
  height: 360px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    padding: 0 20px;
  }
`
const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`

const Title = styled.div`
  margin-bottom: 5px;
  font-size: 25px;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`
const TitleContainer = styled.div`
  margin-bottom: 30px;
  margin-left: 15px;
  @media (max-width: 768px) {
    margin-bottom: 20px;
    margin-left: 10px;
  }
`
const MainContentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 768px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

type IntroductionProps = {
  profileImage: IGatsbyImageData
}

const Introduction: FunctionComponent<IntroductionProps> = function ({
  profileImage,
}) {
  return (
    <Background>
      <Wrapper>
        <MainContentsWrapper>
          <ProfileImage profileImage={profileImage} />
          <TitleContainer>
            <Title>HaNeul Lee</Title>
            <SubTitle>backend developer</SubTitle>
          </TitleContainer>
        </MainContentsWrapper>
        <IconWrapper>
          <Link to="https://github.com/le2sky">
            <Tooltip title="github">
              <IconButton size="large" aria-label="github">
                <GitIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Link>

          <Link to="https://www.instagram.com/lee.___.sky/">
            <Tooltip title="instagram">
              <IconButton size="large" aria-label="instagram">
                <InstaIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Link>

          <Tooltip title="le2sky@kakao.com">
            <IconButton size="large" aria-label="mail">
              <MailIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </IconWrapper>
      </Wrapper>
    </Background>
  )
}

export default Introduction
