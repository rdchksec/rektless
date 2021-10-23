import React from 'react';
import { Modal, Icon } from 'antd';
import "./LoadingModal.less";

class LoadingModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title, success } = this.props;
        return (
            <Modal
                title={title}
                className={"loading-modal"}
                visible={true}
                footer={false}
                closable={false}
            >
                {
                    success 
                        ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                        : <Icon type="loading" />
                }
                
            </Modal>
        )
    }
}

export default LoadingModal;