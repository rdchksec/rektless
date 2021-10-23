import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import "./Nav.less";

const pages = [
    {
        title: "user",
        route: "/",
        subMenu: []
    },
    {
        title: "admin",
        route: "/admin",
        subMenu: []
    },
    // {
    //     title: "exploit",
    //     route: "/exploit",
    //     subMenu: []
    // }
];

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { history } = this.props;
        let find = pages.find(page => page.route === history.location.pathname);
        return (
            <Menu className={"nav-left"} mode="horizontal" defaultSelectedKeys={[String(find ? (pages.indexOf(find) + 1) : null)]}>
                {
                    pages.map((page, index) => {
                        return (
                            <Menu.Item key={Number(index) + 1}>
                                <Link to={page.route}>{page.title}</Link>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
    }
}

export default withRouter(Nav);