import React, { FunctionComponent, useMemo } from 'react'
import { graphql } from 'gatsby'
import { PostListItemType } from 'types/PostItem.types'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import Template from 'components/Common/Template'
import Introduction from 'components/Main/Introduction'
import Selector from 'components/Common/Selector'
import CommentWidget from 'components/Post/CommentWidget'

type GuestPageProps = {
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

const GuestPage: FunctionComponent<GuestPageProps> = function ({
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
      <Selector type={'guest'} />
      <CommentWidget />
    </Template>
  )
}

export default GuestPage

export const getPostList = graphql`
  query getGuestList {
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
