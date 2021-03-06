import React, { FunctionComponent, useMemo } from 'react'
import { graphql } from 'gatsby'
import { PostListItemType } from 'types/PostItem.types'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import Template from 'components/Common/Template'
import Introduction from 'components/Main/Introduction'
import Selector from 'components/Common/Selector'
import styled from '@emotion/styled'

type InfoPageProps = {
  location: {
    search: string
  }
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
        description: string
      }
    }
    allMarkdownRemark: {
      edges: PostListItemType[]
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL: string
    }
  }
}

const InformationWrapper = styled.div`
  width: 768px;
  height: 900px;
  margin: 50px auto 0 auto;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
`

const InfoPage: FunctionComponent<InfoPageProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    file: {
      publicURL,
      childImageSharp: { gatsbyImageData },
    },
  },
}) {
  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <Introduction profileImage={gatsbyImageData} />
      <Selector type={'info'} />
      <InformationWrapper></InformationWrapper>
    </Template>
  )
}

export default InfoPage

export const getPostList = graphql`
  query getInfoList {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    file(name: { eq: "Profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 200, height: 200)
      }
      publicURL
    }
  }
`
