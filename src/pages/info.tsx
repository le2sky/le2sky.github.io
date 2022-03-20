import React, { FunctionComponent, useMemo } from 'react'
import CategoryList, { CategoryListProps } from 'components/Main/CategoryList'
import { graphql } from 'gatsby'
import { PostListItemType } from 'types/PostItem.types'
import PostList from 'components/Main/PostList'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import queryString, { ParsedQuery } from 'query-string'
import Template from 'components/Common/Template'
import Introduction from 'components/Main/Introduction'
import Selector from 'components/Common/Selector'
import PostPage from './post'

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
