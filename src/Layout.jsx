import React, {Component} from 'react';
import {ConfigProvider, Layout, Menu, message} from 'antd';
import {LogoutOutlined, TranslationOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import {Api, Auth, I18n, I18nContainer, Cookie, I18nConfig} from 'h-react';
import hRouter from './Router';
import Me from './me';

import './Layout.less';

const {Header, Content, Sider} = Layout;
const {SubMenu} = Menu;

class hLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    // 对应主题相关修正
    this.theme = {
      pathHideType: this.props.h.pathHideType || 'disabled',
    };
    switch (this.props.h.theme) {
      case 'light':
        this.theme.type = 'light';
        break;
      default:
        this.theme.type = 'dark';
        break;
    }
    if (Auth.isOnline() === false) {
      message.error(I18n('LOGIN_OFFLINE'), 3.00);
      this.props.history.replace(Auth.getLoginUrl());
    }
    this.routerAll = this.allRouter();
    this.routerFlat = this.flatRouter(this.routerAll);
    this.head = this.getHead();
    if (this.routerFlat[this.head] === undefined) {
      location.href = '/';
      return;
    }
    this.children = this.routerFlat[this.head].children || [];
    this.state = {
      collapsed: Number.parseInt(Cookie.get('collapsed'), 10) > 0,
      path: [],
    };
    this.state.routerHead = this.headRouter();
    this.state.active = this.getActive();
    this.state.open = this.getOpen();
  }

  componentDidMount() {
  }

  getHead = () => {
    return '/' + (this.props.location.pathname.split('/')[1] || 'index');
  };

  getJumpPath = (router, path) => {
    path = path || router.path;
    if (router.children === undefined || router.children.length <= 0) {
      return path;
    }
    for (const child of router.children) {
      if (child.hide !== true && child.disabled !== true) {
        path += child.path;
        path = this.getJumpPath(child, path);
        break;
      }
    }
    return path;
  };

  // 同时重置 routerConfig 的 fullPath
  allRouter = (routers, all, prev) => {
    routers = routers || hRouter.config;
    all = all || [];
    prev = prev || '';
    routers.forEach((val, idx) => {
      if (['/', '*', '/sign'].includes(val.path) === false) {
        val.idx = idx;
        val.fullPath = prev + val.path;
        val.jumpPath = prev + this.getJumpPath(val);
        all.push(val);
        if (val.children !== undefined && Array.isArray(val.children) && val.children.length > 0) {
          all = this.allRouter(val.children, all, prev + val.path);
        }
      }
    });
    return all;
  };

  flatRouter = (routers, flat) => {
    flat = flat || {};
    routers.forEach((val) => {
      flat[val.fullPath] = val;
      if (val.children !== undefined && val.children.length <= 0) {
        flat = this.flatRouter(val.children, flat);
      }
    });
    console.log(flat);
    return flat;
  };

  headRouter = () => {
    const head = [];
    hRouter.config.forEach((val) => {
      if (['/', '*', '/sign'].includes(val.path) === false && val.hide !== true) {
        if (this.state.path.includes(val.jumpPath)) {
          let isOK = false;
          for (const i in val.children) {
            if (!this.state.path.includes(val.children[i].jumpPath)) {
              val.jumpPath = val.children[i].jumpPath;
              isOK = true;
              break;
            }
          }
          if (isOK) {
            head.push(val);
          } else if (this.theme.pathHideType === 'disabled') {
            val.disabled = true;
            head.push(val);
          }
        } else head.push(val);
      }
    });
    return head;
  };

  onCollapse = () => {
    Cookie.set('collapsed', this.state.collapsed ? '0' : '1');
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getActive = () => {
    const paths = this.props.location.pathname.split('/');
    let temp = '/';
    const active = [];
    paths.forEach((val) => {
      temp += (temp === '/') ? val : '/' + val;
      active.push(temp);
      if (this.routerFlat[temp] !== undefined && !active.includes(this.routerFlat[temp].jumpPath)) {
        active.push(this.routerFlat[temp].jumpPath);
      }
    });
    if (paths.length === 2 && paths[1] === '') {
      active.push(this.routerAll[0].jumpPath);
    }
    return active;
  };

  getOpen = () => {
    const open = [];
    open.push(this.props.location.pathname);
    if (this.props.location.pathname === '/') {
      open.push(this.routerAll[0].jumpPath);
    }
    return open;
  };

  onMenuClick = (evt) => {
    console.log(`onMenuClick:${evt.key}`);
    switch (evt.key) {
      case 'i18n':
        // nothing
        break;
      case 'me':
        // nothing
        break;
      case 'loginOut':
        Api.query().post({ADMIN_LOGOUT: {id: Auth.getUserId()}}, (res) => {
          if (res.code === 200) {
            message.success(I18n('LOGOUT_SUCCESS'));
            Auth.clearUid();
            this.props.history.replace(Auth.getLoginUrl());
          } else {
            message.error(res.response);
          }
        });
        break;
      default:
        if (evt.key !== this.props.location.pathname) {
          this.props.history.push(evt.key);
        }
        break;
    }
  };

  onOpenChange = (openKeys) => {
    console.log(openKeys);
  };

  renderSub = (router) => {
    router = router || this.children;
    return (
      router.map((val) => {
        if (val.hide === true) {
          return null;
        } else if (this.state.path.includes(val.jumpPath)) {
          switch (this.theme.pathHideType) {
            case 'hidden':
              return null;
            case 'disabled':
            default:
              return (<Menu.Item key={val.jumpPath}
                                 disabled>{val.icon !== undefined ? val.icon : ''}<span>{val.name}</span></Menu.Item>);
          }
        } else if (val.children !== undefined && val.children.length > 0) {
          return (<SubMenu key={val.jumpPath} disabled={val.disabled} title={
            <span>{val.icon !== undefined ? val.icon : ''}<span>{val.name}</span></span>}>{this.renderSub(val.children)}</SubMenu>);
        }
        return (<Menu.Item key={val.jumpPath}
                           disabled={val.disabled}>{val.icon !== undefined ? val.icon : ''}<span>{val.name}</span></Menu.Item>);
      })
    );
  };

  render() {
    return (
      <ConfigProvider locale={I18nConfig.antd()}>
        <Layout>
          <Header style={style.Header}>
            <Menu
              theme={this.theme.type}
              mode="horizontal"
              selectedKeys={this.state.active}
              style={style.HeaderMenu}
              onClick={this.onMenuClick}
            >
              <Menu.Item key="loginOut"><LogoutOutlined rotate={180}/>{I18n('LOGOUT')}</Menu.Item>
              <Menu.Item key="me" className="me"><Me/></Menu.Item>
              <Menu.Item key="i18n" className="i18n">
                <I18nContainer placement="left"><TranslationOutlined/>Translate</I18nContainer>
              </Menu.Item>
              {
                this.state.routerHead.map((val) => {
                  return (
                    <Menu.Item
                      disabled={val.disabled}
                      key={val.jumpPath}
                    >
                      {val.icon !== undefined ? val.icon : ''}{val.name}
                    </Menu.Item>
                  );
                })
              }
            </Menu>
          </Header>
          <Layout>
            <Sider
              collapsible={true}
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <Menu
                defaultOpenKeys={this.state.active}
                selectedKeys={this.state.open}
                mode="inline"
                onOpenChange={this.onOpenChange}
                onClick={this.onMenuClick}
              >
                {this.renderSub(this.children)}
              </Menu>
            </Sider>
            <Content style={style.Content} id="layout">
              <div style={style.ContentChild}>
                {this.props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

const style = {
  loading: {width: '100%', marginTop: '100px'},
  HeaderMenu: {textAlign: 'left', background: '#272727'},
  History: {padding: 10, background: '#272727'},
  Content: {margin: 0, padding: 0, background: '#ffffff'},
  ContentChild: {margin: 0, padding: 10},
};

export default withRouter(hLayout);
