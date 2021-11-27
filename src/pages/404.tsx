import React, { FunctionComponent, useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import GlobalStyle from 'components/Common/GlobalStyle'
import { Button, IconButton, Slide, Snackbar } from '@mui/material'

import GitIcon from '@mui/icons-material/GitHub';
import InstaIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';

const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const NotFoundText = styled.div`
  font-size: 150px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 100px;
  }
`

const NotFoundDescription = styled.div`
  font-size: 25px;
  text-align: center;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const GoToMainButton = styled(Link)`
  margin-top: 30px;
  font-size: 20px;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`

function TransitionUp(props: any) {
  return <Slide {...props} direction="up" />
}



const LinkWrapper = styled.div`

`

const NotFoundPage: FunctionComponent = function () {
  //snack bar open state
  const [open, setOpen] = useState(false);

  //snack bar handler
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //snack bar action
  const action = (
    <div>
      <Button color="info" size="small">
        COPY
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );
  return (
    <NotFoundPageWrapper>
      <GlobalStyle />
      <LinkWrapper>
        <Button href="https://github.com/le2sky" color="secondary" variant="text">{<GitIcon />}</Button>
        <Button href="https://www.instagram.com/lee.___.sky/" color="secondary" variant="text">{<InstaIcon />}</Button>
        <Button onClick={handleClick} color="secondary" variant="text">{<MailIcon />}</Button>
      </LinkWrapper>
      <NotFoundText>404</NotFoundText>
      <NotFoundDescription>
        찾을 수 없는 페이지입니다. <br />
        다른 콘텐츠를 보러 가보시겠어요?
      </NotFoundDescription>
      <GoToMainButton to="/">메인으로</GoToMainButton>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        message="le2sky@kakao.com"
        key={TransitionUp ? TransitionUp.name : ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={action}
      />
    </NotFoundPageWrapper>
  )
}

export default NotFoundPage