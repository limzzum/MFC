import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default function UserVideoComponent({ streamManager }) {

    const getNicknameTag = () => {
        // Gets the nickName of the user
        if (streamManager && streamManager.stream && streamManager.stream.connection) {
            return JSON.parse(streamManager.stream.connection.data).clientData;
        }
        return "";
    }

    return (
        <div>
            {streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponent streamManager={streamManager} />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
            ) : null}
        </div>
    );
}