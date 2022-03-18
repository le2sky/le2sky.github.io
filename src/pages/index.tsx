import GlobalStyle from 'components/Common/GlobalStyle'
import { graphql, Link } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import React, { FunctionComponent, useEffect } from 'react'
import * as THREE from 'three'
import Box from '@mui/material/Box'
import NavigationIcon from '@mui/icons-material/Navigation'
import Fab from '@mui/material/Fab'

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
const IndexPage: FunctionComponent<IndexPageProps> = function ({}) {
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
    renderer.setSize(window.innerWidth, window.innerHeight - 58)
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
      <Box
        sx={{ backgroundColor: 'black', height: '100%', paddingTop: '10px' }}
      >
        <Fab variant="extended" sx={{ height: '100' }}>
          <NavigationIcon sx={{ mr: 1 }} />
          <a href="/post">Go to Blog</a>
        </Fab>
      </Box>
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
