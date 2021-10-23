import React from "react";
import ReactDOM from "react-dom";
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.less';

import NotFound from "./components/NotFound/NotFound.jsx";
import Nav from "./components/Nav/Nav.jsx";
import ConnectMetamask from "./components/ConnectMetamask/ConnectMetamask.jsx";
import MigrateForm from "./components/MigrateForm/MigrateForm.jsx";
import ProfilesList from "./components/ProfilesList/ProfilesList.jsx";

const { Header, Content, Footer } = Layout;
const history = createBrowserHistory()

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null
        }
        this.setAddress = this.setAddress.bind(this);
    }

    componentDidMount() {

    }

    setAddress(address) {
        this.setState({ address });
    }

    render() {
        const { address } = this.state;
        return (
            <div className="App">
                <BrowserRouter history={history}>
                    <Layout className="layout">
                        <div className={"main-content"}>
                            <Header className={"header"}>
                                <div className={"max-width"}>
                                    <div className="nav-right">
                                        <ConnectMetamask
                                            address={address}
                                            setAddress={this.setAddress}
                                        />
                                    </div>
                                    <div className="logo">rektless</div>
                                    <Nav history={history} />
                                </div>
                            </Header>
                            <Content style={{ padding: '0 50px' }}>
                                <div className={"max-width"}>
                                    <Switch>
                                        <Route exact path='/'>
                                            <MigrateForm
                                                address={address}
                                            />
                                        </Route>
                                        <Route path='/admin'>
                                            <ProfilesList
                                                address={address}
                                            />
                                        </Route>
                                        <Route path='/exploit'>
                                            exploit
                                        </Route>
                                        <Route>
                                            <NotFound />
                                        </Route>
                                    </Switch>
                                </div>
                            </Content>
                        </div>
                        <Footer style={{ textAlign: 'center' }}>
                            <div>rektless ©{new Date().getFullYear()}</div>
                        </Footer>
                    </Layout>
                </BrowserRouter>
            </div>
        )
    }
}

const AppWithRouter = withRouter(App);

ReactDOM.render(<App />, document.getElementById('root'));