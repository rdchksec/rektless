import React from "react";
import { Alert, Form, Button, Select } from 'antd';
import Rektless from '../../services/rektless';
import { sleep } from '../../services/utils';
import './MigrateForm.less';
import LoadingModal from "../LoadingModal/LoadingModal.jsx";

const { Option } = Select;
let RektlessClient;
class MigrateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      profile: null,
      tokenAddress: null,
      approvalTxActive: false,
      approvalTxRawData: null,
      migrationTxActive: false,
      migrationTxRawData: null,
      errorMessage: null,
      successMessage: null
    }
    if (!RektlessClient) {
      RektlessClient = new Rektless(window.ethereum);
    }
  }

  componentDidMount() {
    RektlessClient.getProfilesAsync()
      .then(profiles => {
        this.setState({ profiles })
      })
      .catch(e => {
        this.setState({ errorMessage: "Internal server error" })
      });
  }


  handleSelectProfile = (value) => {
    if (value > 0) {
      this.setState({
        profile: value - 1
      })
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { profile, profiles } = this.state;
    const { address } = this.props;

    this.setState({
      errorMessage: null,
      successMessage: null,
      approvalTxRawData: null,
      migrationTxRawData: null,
    });

    this.props.form.validateFields(async (err) => {
      if (!err) {
        let nonce = await RektlessClient.getTxCountAsync(address);
        let feeData = await RektlessClient.getFeeDataAsync();

        // Approval Transaction
        this.setState({ approvalTxActive: true });
        await sleep(2000);

        let approvalTxRequest = await RektlessClient.createApprowalTxAsync(address, profiles[profile].stakingTokenContractAddress, profiles[profile].migratorContractAddress, nonce, feeData.maxFeePerGas, feeData.maxPriorityFeePerGas);
        if (approvalTxRequest.errorMessage) {
          await this.setState({ errorMessage: approvalTxRequest.errorMessage })
          this.setState({ approvalTxActive: false, approvalTxRawData: null });
          return false;
        }

        this.setState({ approvalTxRawData: approvalTxRequest.rawData });
        await sleep(3000);
        this.setState({ approvalTxActive: false });

        nonce++;

        // Migration Transaction
        this.setState({ migrationTxActive: true });
        await sleep(2000);

        let migrationTxRequest = await RektlessClient.createMigrationTxAsync(address, profiles[profile].migratorContractAddress, nonce, feeData.maxFeePerGas, feeData.maxPriorityFeePerGas);
        if (migrationTxRequest.errorMessage) {
          await this.setState({ errorMessage: migrationTxRequest.errorMessage })
          this.setState({ migrationTxActive: false, migrationTxRawData: null });
          return false;
        }

        this.setState({ migrationTxRawData: migrationTxRequest.rawData });
        await sleep(3000);
        this.setState({ migrationTxActive: false });
        await sleep(1000);

        let sendTransactionResponse = await RektlessClient.addUserMigrationAsync(this.state.approvalTxRawData, this.state.migrationTxRawData, profiles[profile].protocolAddress);
        if (sendTransactionResponse.errorMessage) {
          await this.setState({ errorMessage: sendTransactionResponse.errorMessage });
          return true;
        }

        if (!sendTransactionResponse) {
          await this.setState({ errorMessage: "Sending error" })
          return false;
        }

        await this.setState({ successMessage: "Migration transaction sent successfully" });
        return true;
      }
    });
  }

  render() {
    const { profile, profiles, approvalTxActive, migrationTxActive, approvalTxRawData, migrationTxRawData, errorMessage, successMessage } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        name="main_form"
        className="main-form"
        layout="vertical"
        autoComplete="off"
        onSubmit={this.onSubmit}
      >
        {
          !!successMessage &&
          <Alert message={successMessage} type="success" />
        }
        {
          !!errorMessage &&
          <Alert message={errorMessage} type="error" />
        }
        <Form.Item
          label="profile"
        >
          {getFieldDecorator('profile', {
            initialValue: typeof profile !== "number" ? 0 : profile + 1,
            rules: [
              {
                required: true,
                message: 'please select profile'
              }
            ],
          })(
            <Select
              onChange={this.handleSelectProfile}
            >
              <Option key={1} value={0} disabled={true}>select profile</Option>
              {
                profiles.map((p, index) => <Option key={index + 2} value={index + 1}>{p.protocolName}</Option>)
              }
            </Select>
          )}
        </Form.Item>
        {
          !!profiles[profile] &&
          <>
            <Form.Item
              label="protocol address"
              style={{ textAlign: "left" }}
            >
              <a href={`https://goerli.etherscan.io/address/${profiles[profile].protocolAddress}`} target="_blank">{profiles[profile].protocolAddress}</a>
            </Form.Item>
            <Form.Item
              label="migrator contract address"
              style={{ textAlign: "left" }}
            >
              <a href={`https://goerli.etherscan.io/address/${profiles[profile].migratorContractAddress}`} target="_blank">{profiles[profile].migratorContractAddress}</a>
            </Form.Item>
            <Form.Item
              label="staking token contract address"
              style={{ textAlign: "left" }}
            >
              <a href={`https://goerli.etherscan.io/address/${profiles[profile].stakingTokenContractAddress}`} target="_blank">{profiles[profile].stakingTokenContractAddress}</a>
            </Form.Item>
          </>
        }
        <div>
          <Button style={{marginBottom: "10px"}} type="primary" htmlType="submit" disabled={profile == null}>
            migrate to fixed protocol
          </Button>
          <Button type="primary" disabled={true}>
            securely withdraw funds (comming soon)
          </Button>
        </div>
        {
          approvalTxActive &&
          <LoadingModal
            title={"approve transaction"}
            success={!!approvalTxRawData}
          />
        }
        {
          migrationTxActive &&
          <LoadingModal
            title={"migration transaction"}
            success={!!migrationTxRawData}
          />
        }
      </Form>
    )
  }
}

export default Form.create()(MigrateForm);