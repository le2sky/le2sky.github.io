import styled from "@emotion/styled";
import Footer from "components/Common/Footer";
import Header from "components/Common/Header";
import GlobalStyle from "components/Common/GlobalStyle";
import React, { FunctionComponent, ReactNode } from "react";
import { Helmet } from "react-helmet";


type TemplateProps = {
    children: ReactNode
    title: string
    description: string
    url: string
    image: string
}



const Container = styled.main`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`



const Template: FunctionComponent<TemplateProps> = function ({
    children,
    url,
    title,
    description,
    image
}) {
    return (
        <Container>
            <Helmet>
                <title>{title}</title>

                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content={title} />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:site" content="@le2sky" />
                <meta name="twitter:creator" content="@le2sky" />
                <meta name="google-site-verification" content="5xXRZrCZS3S9PVEAVjys_iHa9OVLogd5xf7A2R8BswM" />
                <html lang="ko" />
            </Helmet>
            <GlobalStyle />
            <Header />
            {children}
            <Footer />

        </Container>
    );
}

export default Template;
