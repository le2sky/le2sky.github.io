import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { IGatsbyImageData, GatsbyImage } from 'gatsby-plugin-image'

type ProfileImageProps = {
  profileImage: IGatsbyImageData
}

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 768px) {
    margin-bottom: 20px;
    width: 90px;
    height: 90px;
  }
`

const ProfileImage: FunctionComponent<ProfileImageProps> = function ({
  profileImage,
}) {
  return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage
