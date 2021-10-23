import React from 'react';
import "./NotFound.less";

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"not-found"}>
                <div className={"code"}>404</div>
                <div className={"text"}>Page not found</div>
            </div>
        )
    }
}

export default NotFound;