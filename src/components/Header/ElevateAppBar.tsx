import {
  AppBar,
  CssBaseline,
  IconButton,
  useScrollTrigger,
} from '@mui/material'
import { FunctionComponent, ReactElement, useState } from 'react'
import React from 'react'
import styled from '@emotion/styled'
import HomeIcon from '@mui/icons-material/home'
import { Link } from 'gatsby'

const SearchAndSideButtonWraaper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 52px;
`

type ElevationProps = {
  window?: () => Window
  children?: ReactElement
}

const ElevationScroll: FunctionComponent<ElevationProps> = function (
  props: ElevationProps,
) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })
  return React.cloneElement(children as ReactElement, {
    elevation: trigger ? 14 : 0,
    sx: {
      backgroundColor: trigger ? '#292929' : 'white',
      color: trigger ? 'white' : '#292929',
      transition: 'all 0.3s ease-in-out;',
    },
  })
}

const ElevateAppBar: FunctionComponent<ElevationProps> = function (
  props: ElevationProps,
) {
  //side menu
  return (
    <header>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <ContentWrapper>
            <Link to="/post">
              <IconButton
                sx={{
                  color: 'inherit',
                  fontWeight: '500',
                  fontSize: '18px',
                  marginLeft: '15px',
                  '@media (max-width: 768px)': {
                    marginLeft: '5px',
                  },
                }}
              >
                <HomeIcon />
              </IconButton>
            </Link>
          </ContentWrapper>
        </AppBar>
      </ElevationScroll>
    </header>
  )
}

export default ElevateAppBar
