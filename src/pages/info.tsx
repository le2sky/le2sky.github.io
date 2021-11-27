import React, { FunctionComponent } from "react";


type InfoPageProps = {
    data: {
        site: {
            siteMetadata: {
                title: string
                description: string
                author: string
            }
        }
    }
}

const InfoPage: FunctionComponent<InfoPageProps> = function ({
}) {
    return (
        <div>
            미구현
        </div >
    )
}

export default InfoPage
