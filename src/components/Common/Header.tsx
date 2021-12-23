import { FunctionComponent, useState } from 'react'
import styled from '@emotion/styled'

//icons
import MenuIcon from '@mui/icons-material/Menu'
import GitIcon from '@mui/icons-material/GitHub'
import InstaIcon from '@mui/icons-material/Instagram'
import MailIcon from '@mui/icons-material/Mail'
import InfoIcon from '@mui/icons-material/Info'
import PostIcon from '@mui/icons-material/Book'
import CloseIcon from '@mui/icons-material/Close'
import PortIcon from '@mui/icons-material/Person'

//meterial
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IconButton } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'
import { Link } from 'gatsby'

function TransitionUp(props: any) {
  return <Slide {...props} direction="up" />
}

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
`
const LinkWrapper = styled.div`
  margin-left: auto;
  margin-right: 10px;
`
const Header: FunctionComponent = () => {
  const [state, setState] = useState(false)

  //snack bar open state
  const [open, setOpen] = useState(false)

  //snack bar handler
  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  //snack bar action
  const action = (
    <div>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  )

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
    <HeaderWrapper>
      <IconButton onClick={toggleButton}>{<MenuIcon />}</IconButton>
      <Drawer open={state} onClose={toggleButton}>
        {list()}
      </Drawer>
      <LinkWrapper>
        <IconButton href="https://github.com/le2sky">{<GitIcon />}</IconButton>
        <IconButton href="https://www.instagram.com/lee.___.sky/">
          {<InstaIcon />}
        </IconButton>
        <IconButton onClick={handleClick}>{<MailIcon />}</IconButton>
      </LinkWrapper>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        message="le2sky@kakao.com"
        key={TransitionUp ? TransitionUp.name : ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={action}
      />
    </HeaderWrapper>
  )
}

export default Header
