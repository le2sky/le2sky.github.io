import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { IGatsbyImageData, GatsbyImage } from "gatsby-plugin-image";



type ProfileImageProps = {
    profileImage: IGatsbyImageData
}


const ProfileImageWrapper = styled(GatsbyImage)`
    width: 270px;
    height: 270px;

    @media (max-width: 768px) {
        width: 150px;
        height: 150px;
    }
`

const ProfileImage: FunctionComponent<ProfileImageProps> = function ({
    profileImage,
}) {
    return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage;
