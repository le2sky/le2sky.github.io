import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import ProfileImage from "./ProfileImage";

import { IGatsbyImageData } from "gatsby-plugin-image";


const Background = styled.div`
    width: 100%;
    color: #FFFFFF;
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    
`

const Wrapper = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 768px;
        height: 400px;
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
            font-size: 10px
        }   
`

const Title = styled.div`
        margin-top: 5px;
        font-size: 35px;
        font-weight: 700;
        @media (max-width: 768px) {
            font-size: 25px
        } 
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
                <ProfileImage profileImage={profileImage} />
                <SubTitle>ㅡ</SubTitle>
                <SubTitle>창의적인 아이디어를 위해 끊임없이 탐구합니다.</SubTitle>
                <Title>Ha-Neul Lee</Title>
            </Wrapper>
        </Background >
    )
}

export default Introduction