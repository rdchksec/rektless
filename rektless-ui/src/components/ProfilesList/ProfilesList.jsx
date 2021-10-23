import React from 'react';
import { Alert, Table, Button, Icon } from 'antd';
import Rektless from '../../services/rektless';
import { sleep } from '../../services/utils';
import "./ProfilesList.less";
import CreateProfileModal from "../CreateProfileModal/CreateProfileModal.jsx";
import LoadingModal from "../LoadingModal/LoadingModal.jsx";

let RektlessClient;

class ProfilesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            profiles: [],
            modalVisible: false,
            unpauseTxActive: false,
            unpauseTxRawData: null,
            pauseTxActive: false,
            pauseTxRawData: null,
            errorMessage: null,
            successMessage: null,
        }
        if (!RektlessClient && window.ethereum) {
            RektlessClient = new Rektless(window.ethereum);
        }
    }

    componentDidMount() {
        this.updateProfilesList();
    }

    updateProfilesList = async () => {
        this.setState({ loading: true });
        let profiles = await RektlessClient.getProfilesAsync();
        if (!profiles) {
            this.setState({ errorMessage: "Internal server error", loading: false });
            return false;
        }
        this.setState({ profiles, loading: false });
        return true;
    }

    showModal = async () => {
        this.setState({
            errorMessage: null,
            successMessage: null
        });
        this.setState({ modalVisible: true });
    }

    closeModal = async () => {
        await this.updateProfilesList();
        this.setState({ modalVisible: false });
    };

    deleteProfile = async (protocolAddress) => {
        this.setState({
            errorMessage: null,
            successMessage: null
        });
        await RektlessClient.deleteProfileAsync(protocolAddress);
        await this.updateProfilesList();
    };

    runProfile = async (profileIndex) => {
        const { profiles } = this.state;
        const { address } = this.props;

        this.setState({
            unpauseTxActive: true,
            errorMessage: null,
            successMessage: null,
            unpauseTxRawData: null,
            pauseTxRawData: null
        });

        let nonce = await RektlessClient.getTxCountAsync(address);
        let feeData = await RektlessClient.getFeeDataAsync();
        // Unpause Transaction
        await sleep(2000);

        let unpauseTxRequest = await RektlessClient.createPauseTxAsync(address, profiles[profileIndex], false, nonce, feeData.maxFeePerGas, feeData.maxPriorityFeePerGas);
        if (unpauseTxRequest.errorMessage) {
            await this.setState({ errorMessage: unpauseTxRequest.errorMessage })
            this.setState({ unpauseTxActive: false, unpauseTxRawData: null });
            return false;
        }

        this.setState({ unpauseTxRawData: unpauseTxRequest.rawData });
        await sleep(3000);
        this.setState({ unpauseTxActive: false });

        nonce++;

        // Pause Transaction
        this.setState({ pauseTxActive: true });
        await sleep(2000);

        let pauseTxRequest = await RektlessClient.createPauseTxAsync(address, profiles[profileIndex], true, nonce, feeData.maxFeePerGas, feeData.maxPriorityFeePerGas);
        if (pauseTxRequest.errorMessage) {
            await this.setState({ errorMessage: pauseTxRequest.errorMessage })
            this.setState({ pauseTxActive: false, pauseTxRawData: null });
            return false;
        }

        this.setState({ pauseTxRawData: pauseTxRequest.rawData });
        await sleep(3000);
        this.setState({ pauseTxActive: false });
        await sleep(1000);

        let sendTransactionResponse = await RektlessClient.runMigrationTransactionAsync(this.state.unpauseTxRawData, this.state.pauseTxRawData, profiles[profileIndex].protocolAddress);
        if (sendTransactionResponse.errorMessage) {
            await this.setState({ errorMessage: sendTransactionResponse.errorMessage });
            return true;
        }

        if (!sendTransactionResponse) {
            await this.setState({ errorMessage: "Sending error" })
            return false;
        }

        let msg = <div>
            <div>Transaction Bundle sent successfully. It will be privately mined in 1-10 blocks.</div>
            <div>Please, check its status here: </div>
            {
                !!sendTransactionResponse.txHashes &&
                sendTransactionResponse.txHashes.map((hash, i) => <div>{i === 0 ? "unpause - " : i == (sendTransactionResponse.txHashes.length - 1) ? "pause - " : "user transactions - "}<a href={`https://goerli.etherscan.io/tx/${hash}`} target="_blank">{hash}</a></div>)
            }
        </div>

        await this.setState({ successMessage: msg });
        return true;
    };

    render() {
        const { modalVisible, unpauseTxActive, unpauseTxRawData, pauseTxActive, pauseTxRawData, loading, errorMessage, successMessage } = this.state;
        const { address } = this.props;
        const columns = [
            {
                title: 'protocol name',
                dataIndex: 'protocolName',
                key: 'protocolName',
            },
            {
                title: 'protocol address',
                dataIndex: 'protocolAddress',
                key: 'protocolAddress',
            },
            {
                title: 'migrator contract address',
                dataIndex: 'migratorContractAddress',
                key: 'migratorContractAddress',
            },
            {
                title: 'staking token contract address',
                dataIndex: 'stakingTokenContractAddress',
                key: 'stakingTokenContractAddress',
            },
            {
                title: 'action',
                dataIndex: '',
                key: 'run',
                width: "100px",
                align: "center",
                render: (text, record, index) => <a className={'run-link' + (loading || !address ? " disabled" : "")} disabled={loading || !address} onClick={() => this.runProfile(index)}>run</a>,
            },
            {
                title: '',
                dataIndex: '',
                key: 'del',
                width: "50px",
                render: (text, record) => <a className={'del-link' + (loading || !address ? " disabled" : "")} disabled={loading || !address} onClick={() => this.deleteProfile(record.protocolAddress)}><Icon type="close-circle" theme="twoTone" twoToneColor="red" /></a>,
            },
        ];
        
        return (
            <div className={"profiles-list"}>
                {
                    !!successMessage &&
                    <Alert style={{ textAlign: "left" }} message={successMessage} type="success" />
                }
                {
                    !!errorMessage &&
                    <Alert message={errorMessage} type="error" />
                }
                <Button disabled={loading || !address} onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
                    create profile
                </Button>
                <Table
                    loading={loading}
                    tableLayout="fixed"
                    dataSource={this.state.profiles.map((p, i) => { p.key = i + 1; return p; })}
                    columns={columns}
                    expandedRowRender={record => <div style={{ margin: 0 }}><div><b>users migration requests</b></div>{JSON.stringify(record.usersMigrationRequests)}</div>}
                />
                <CreateProfileModal
                    visible={modalVisible}
                    onClose={this.closeModal}
                />
                {
                    unpauseTxActive &&
                    <LoadingModal
                        title={"unpause transaction"}
                        success={!!unpauseTxRawData}
                    />
                }
                {
                    pauseTxActive &&
                    <LoadingModal
                        title={"pause transaction"}
                        success={!!pauseTxRawData}
                    />
                }
            </div>
        )
    }
}

export default ProfilesList;