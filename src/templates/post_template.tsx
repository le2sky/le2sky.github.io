import React, { FunctionComponent } from 'react'
import PostHead from 'components/Post/PostHead'
import Template from '../components/Common/Template'
import { PostPageItemType } from 'types/PostItem.types'
import { graphql } from 'gatsby'
import PostContent from 'components/Post/PostContent'
//import { Box } from "@mui/system";
import CommentWidget from 'components/Post/CommentWidget'

import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'

type PostTemplateProps = {
  data: {
    allMarkdownRemark: {
      edges: PostPageItemType[]
    }
  }
  location: {
    href: string
  }
}

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
  location: { href },
}) {
  deckDeckGoHighlightElement()
  const {
    node: {
      html,
      frontmatter: {
        title,
        summary,
        date,
        categories,
        thumbnail: {
          childImageSharp: { gatsbyImageData },
          publicURL,
        },
      },
    },
  } = edges[0]

  return (
    <Template title={title} description={summary} url={href} image={publicURL}>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        thumbnail={gatsbyImageData}
      />
      <PostContent html={html} />
      <CommentWidget />
      {/* <Box dangerouslySetInnerHTML={{ __html: tableOfContents }}>
      </Box> */}
    </Template>
  )
}
export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          tableOfContents
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
          }
        }
      }
    }
  }
`
