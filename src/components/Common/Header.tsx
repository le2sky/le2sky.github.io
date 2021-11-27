import { FunctionComponent, useState } from "react";
import styled from "@emotion/styled";

//icons
import MenuIcon from '@mui/icons-material/Menu';
import GitIcon from '@mui/icons-material/GitHub';
import InstaIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import InfoIcon from '@mui/icons-material/Info';
import PostIcon from '@mui/icons-material/Book';
import CloseIcon from '@mui/icons-material/Close';
import PortIcon from '@mui/icons-material/Person';



//meterial
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Link } from "gatsby";


function TransitionUp(props: any) {
    return <Slide {...props} direction="up" />
}



const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: row;
`
const LinkWrapper = styled.div`
    margin-left: auto;
`
const Header: FunctionComponent = () => {
    const [state, setState] = useState(false);

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



    //side menu 
    const toggleButton = () => {
        setState(!state);
    }

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        le2sky's tech blog🚀
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        1999.06.23 🐰
                    </Typography>
                    <br />
                    <Typography sx={{ fontSize: 12 }} variant="body2">
                        "개발과 운동을 좋아하는 이하늘입니다."<br />
                        백엔드 개발자가 되기 위해서 <br />
                        학습 중입니다.💻
                    </Typography>
                </CardContent>
            </Card>
            <List>
                {['블로그 소개', '게시글'].map((text, index) => (
                    <ListItem button key={text} component={Link} to={index === 0 ? "/info" : ""}>
                        <ListItemIcon>
                            {index === 0 ? <InfoIcon /> :
                                index === 1 ? <PostIcon /> : null
                            }
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Github', 'Instagram', 'Portfolio'].map((text, index) => (
                    <ListItem button key={text} component={Link}
                        to={text === 'Github' ? "https://github.com/le2sky" :
                            text === "Instagram" ? "https://www.instagram.com/lee.___.sky/" :
                                text === "Portfolio" ? "/404" : "/404"
                        }>
                        <ListItemIcon>
                            {index === 0 ? <GitIcon /> :
                                index === 1 ? <InstaIcon /> :
                                    index === 2 ? <PortIcon /> : null
                            }
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return (
        <HeaderWrapper>
            <Button onClick={toggleButton} color="secondary" variant="text">{<MenuIcon />}</Button>
            <Drawer
                open={state}
                onClose={toggleButton}
            >
                {list()}
            </Drawer>
            <LinkWrapper>
                <Button href="https://github.com/le2sky" color="secondary" variant="text">{<GitIcon />}</Button>
                <Button href="https://www.instagram.com/lee.___.sky/" color="secondary" variant="text">{<InstaIcon />}</Button>
                <Button onClick={handleClick} color="secondary" variant="text">{<MailIcon />}</Button>
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
        </HeaderWrapper >
    );
}

export default Header;