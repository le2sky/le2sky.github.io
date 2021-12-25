import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material'
import { FunctionComponent, ReactElement, useState } from 'react'
import React from 'react'
import styled from '@emotion/styled'
import MenuIcon from '@mui/icons-material/Menu'

//icons
import GitIcon from '@mui/icons-material/GitHub'
import InstaIcon from '@mui/icons-material/Instagram'
import PostIcon from '@mui/icons-material/Book'
import PortIcon from '@mui/icons-material/Person'
import InfoIcon from '@mui/icons-material/Info'
//meterial
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Link } from 'gatsby'
import SearchAppBar from './Search'

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
  @media (max-width: 768px) {
    height: 40px;
  }
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
    elevation: trigger ? 4 : 0,
  })
}

const ElevateAppBar: FunctionComponent<ElevationProps> = function (
  props: ElevationProps,
) {
  const [state, setState] = useState(false)
  //side menu
  const toggleButton = () => {
    setState(!state)
  }
  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {['블로그 소개', '게시글'].map((text, index) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={index === 0 ? '/info' : ''}
          >
            <ListItemIcon>
              {index === 0 ? <InfoIcon /> : index === 1 ? <PostIcon /> : null}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Github', 'Instagram', 'Portfolio'].map((text, index) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={
              text === 'Github'
                ? 'https://github.com/le2sky'
                : text === 'Instagram'
                ? 'https://www.instagram.com/lee.___.sky/'
                : text === 'Portfolio'
                ? '/404'
                : '/404'
            }
          >
            <ListItemIcon>
              {index === 0 ? (
                <GitIcon />
              ) : index === 1 ? (
                <InstaIcon />
              ) : index === 2 ? (
                <PortIcon />
              ) : null}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
  return (
    <header>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar sx={{ backgroundColor: 'white' }}>
          <ContentWrapper>
            <SearchAndSideButtonWraaper>
              <IconButton onClick={toggleButton}>
                {<MenuIcon sx={{ color: 'black' }} />}
              </IconButton>
              <SearchAppBar />
            </SearchAndSideButtonWraaper>
            <Drawer open={state} onClose={toggleButton}>
              {list()}
            </Drawer>
            <Typography
              sx={{
                color: 'black',
                fontWeight: '500',
                paddingRight: '20px',
                fontSize: '20px',
              }}
            >
              Haneul Lee 🌜
            </Typography>
          </ContentWrapper>
        </AppBar>
      </ElevationScroll>
    </header>
  )
}

export default ElevateAppBar
