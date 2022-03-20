import GlobalStyle from 'components/Common/GlobalStyle'
import { graphql, Link } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import React, { FunctionComponent, useEffect } from 'react'
import * as THREE from 'three'
import NavigationIcon from '@mui/icons-material/Navigation'
import Fab from '@mui/material/Fab'
import { Helmet } from 'react-helmet'

type IndexPageProps = {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
        description: string
      }
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL: string
    }
  }
}

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    file: { publicURL },
  },
}) {
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10,
    )
    camera.position.z = 1

    const scene = new THREE.Scene()

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(animation)
    document.getElementById('threeDIV').appendChild(renderer.domElement)
    function animation(time: any) {
      mesh.rotation.x = time / 2000
      mesh.rotation.y = time / 1000

      renderer.render(scene, camera)
    }
  }, [])

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={publicURL} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={title} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={publicURL} />
        <meta name="twitter:site" content="@le2sky" />
        <meta name="twitter:creator" content="@le2sky" />
        <meta
          name="google-site-verification"
          content="5xXRZrCZS3S9PVEAVjys_iHa9OVLogd5xf7A2R8BswM"
        />
        <meta
          name="naver-site-verification"
          content="5357dfe02506442121b9a0e97c725828d62c62ad"
        />

        <html lang="ko" />
      </Helmet>

      <Link to="/post">
        <Fab
          sx={{
            position: 'fixed',
            bottom: '95%',
            left: '0',
            marginLeft: '5px',
          }}
          variant="extended"
          size="medium"
          aria-label="Move"
          color="default"
        >
          <NavigationIcon sx={{ mr: 1 }} />
          go to blog
        </Fab>
      </Link>
      <div id="threeDIV"></div>
    </>
  )
}

export default IndexPage

export const getSiteMetadata = graphql`
  query getSiteMetadata {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    file(name: { eq: "Profile-image" }) {
      publicURL
    }
  }
`
