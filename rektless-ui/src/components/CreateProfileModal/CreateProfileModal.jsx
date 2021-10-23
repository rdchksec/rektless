import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import Rektless from '../../services/rektless';
import "./CreateProfileModal.less";

let RektlessClient;

class CreateProfileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protocolAddress: null,
            migratorContractAddress: null,
            stakingTokenContractAddress: null,
            protocolName: null,
        }
        if (!RektlessClient) {
            RektlessClient = new Rektless(window.ethereum);
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const { protocolName, protocolAddress, migratorContractAddress, stakingTokenContractAddress } = this.state;
        this.props.form.validateFields(async (err) => {
            if (!err) {
                let result = await RektlessClient.addProfileAsync(protocolAddress, migratorContractAddress, stakingTokenContractAddress, protocolName);
                if (result) {
                    if (result.errorMessage) {
                        message.error(result.errorMessage);
                    } else {
                        message.success('profile created successfully');
                    }
                } else {
                    message.error('profile creation error');
                }
                this.onCancel();
            }
        });
    };

    handleInputData = (e) => {
        this.setState({ [e.target.id]: e.target.value })
    }

    onCancel = () => {
        const { onClose } = this.props;
        this.props.form.resetFields();
        onClose();
    }

    render() {
        const { protocolName, protocolAddress, migratorContractAddress, stakingTokenContractAddress } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title={"new profile"}
                className={"new-profile-modal"}
                visible={visible}
                footer={false}
                onCancel={this.onCancel}
            >
                <Form
                    name="new_profile_form"
                    className="new-profile-form"
                    layout="vertical"
                    autoComplete="off"
                    onSubmit={this.onSubmit}
                >
                    <Form.Item
                        label="protocol name"
                    >
                        {getFieldDecorator('protocolName', {
                            initialValue: protocolName,
                            rules: [
                                {
                                    required: true,
                                    message: 'please enter protocol name'
                                }
                            ],
                        })(
                            <Input
                                onChange={this.handleInputData}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="protocol address"
                    >
                        {getFieldDecorator('protocolAddress', {
                            initialValue: protocolAddress,
                            rules: [
                                {
                                    required: true,
                                    message: 'please enter protocol address'
                                }, {
                                    pattern: /^0x[a-fA-F0-9]{40}$/,
                                    message: 'Please enter a valid address',
                                }
                            ],
                        })(
                            <Input
                                onChange={this.handleInputData}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="migrator contract address"
                    >
                        {getFieldDecorator('migratorContractAddress', {
                            initialValue: migratorContractAddress,
                            rules: [
                                {
                                    required: true,
                                    message: 'please enter migrator contract address'
                                }, {
                                    pattern: /^0x[a-fA-F0-9]{40}$/,
                                    message: 'Please enter a valid address',
                                }
                            ],
                        })(
                            <Input
                                onChange={this.handleInputData}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="staking token contract address"
                    >
                        {getFieldDecorator('stakingTokenContractAddress', {
                            initialValue: stakingTokenContractAddress,
                            rules: [
                                {
                                    required: true,
                                    message: 'please enter staking token contract address'
                                }, {
                                    pattern: /^0x[a-fA-F0-9]{40}$/,
                                    message: 'Please enter a valid address',
                                }
                            ],
                        })(
                            <Input
                                onChange={this.handleInputData}
                            />
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        create
                    </Button>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CreateProfileModal);