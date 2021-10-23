import React from "react";
import Config from 'Config';
import { Tooltip, Icon, message } from 'antd';
import Web3 from 'web3';
import './ConnectMetamask.less';

class ConnectMetamask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null
    }
  }

  componentDidMount() {
    window.web3 = new Web3(window.ethereum);
    this.useMetaMask();
    this.getConnectedWallet();
  };

  useMetaMask = async () => {
    ethereum.on('connect', () => {
      this.getConnectedWallet();
    });

    ethereum.on('disconnect', () => {
      this.props.setAddress(null);
    });

    ethereum.on('accountsChanged', () => {
      this.getConnectedWallet();
    });

    ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }

  hasMetaMask = async () => {
    this.setState({
      errorMessage: null,
    })
    if (
      !window.hasOwnProperty('ethereum')
      || typeof window.ethereum === 'undefined'
      || !window.ethereum.isMetaMask
    ) {
      this.setState({
        errorMessage: "Metamask not found. Check and try again.",
        disable: true,
      })
      return false;
    }
    let networkId = await web3.eth.net.getId();
    if (networkId !== Config['chainId']) {
      this.setState({
        errorMessage: "Metamask network must be: " + Config['chain'],
        disable: true,
      });

      return false;
    }

    return true;
  }

  getConnectedWallet = async () => {
    if (await this.hasMetaMask()) {
      let selectedAddresses = await window.ethereum.request({ method: 'eth_accounts' });
      if (selectedAddresses) {
        this.props.setAddress(selectedAddresses[0]);
        return true;
      }
    }

    this.props.setAddress(null);
  }

  onConnect = async (e) => {
    e.preventDefault();
    await this.setState({
      errorMessage: false
    });

    try {
      let networkId = await web3.eth.net.getId();
      if (networkId !== Config['chainId']) {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + Config['chainId'] }]
        });
        return false;
      }
      // window.ethereum.request({ method: 'eth_accounts' });
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (typeof accounts === "object" && accounts.length === 0) {
        message.error("Address not found. Check and try again.", 2);
        return false;
      }
      this.getConnectedWallet();
    } catch (err) {
      if (err) {
        this.setState({
          errorMessage: err.message,
        })
      }
    }
  };

  render() {
    const { errorMessage } = this.state;
    const { address } = this.props;
    return (
      <div className={"connect-metamask"}>
        <Tooltip placement="bottom" title={errorMessage || null}>
          <div className={"connect-metamask__button"} onClick={this.onConnect}>
            {
              !!address &&
              <div className={"address"}>{address}</div>
            }
            {
              !address &&
              <div className={"connect"}>
                {
                  !!errorMessage &&
                  <Icon type="warning" theme="twoTone" twoToneColor="#eb2f96" />
                }
                Connect Wallet
              </div>
            }
          </div>
        </Tooltip>
      </div>
    )
  }
}

export default ConnectMetamask;