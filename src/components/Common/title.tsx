import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";


type HeaderProps = {
    title: string
}

const HeaderWrapper = styled.div`
    width:768px;
    margin: 20px auto 0 auto;
    font-size: 22px;
    font-weight:500;
`


const Header: FunctionComponent<HeaderProps> = function ({ title }) {
    return (
        <HeaderWrapper>
            {title}
        </HeaderWrapper>
    );
}

export default Header;
