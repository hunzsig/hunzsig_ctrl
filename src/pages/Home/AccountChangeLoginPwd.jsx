import React, {Component} from 'react';
import {Spin} from 'antd';
import {Api, Auth, I18n} from 'h-react';

export default class AccountChangeLoginPwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
    };
  }

  componentDidMount() {
    Api.query().cache('USER_INFO', {uid: Auth.getUserId()}, (res) => {
      if (res.code === 200) {
        this.setState({
          userInfo: res.data,
        });
      }
    });
  }

  getField = () => {
    const fields = [
      {
        field: 'login_pwd',
        type: 'password',
        label: 'new password',
        params: {minLength: 6, maxLength: 16, required: true}
      },
      {
        field: 'login_pwd_confirm',
        type: 'password',
        label: 'confirm password',
        params: {maxLength: 16, required: true}
      },
    ];
    return fields;
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.userInfo === null}>
        {
          this.state.userInfo !== null &&
          <DesktopForm form={{
            scope: 'User.Info.edit',
            refresh: true,
            items: [
              {
                title: 'Change login password',
                col: 1,
                values: this.getField(),
              },
            ],
            valueFormatter: (result) => {
              if (result.login_pwd !== result.login_pwd_confirm) {
                return 'confirm password error';
              }
              result.uid = Auth.getUserId();
              return result;
            },
            onSuccess: () => {
              this.setState({
                userInfo: null,
              });
              Api.real('User.Info.getInfo', {uid: Auth.getUserId()}, (res) => {
                if (res.code === 200) {
                  this.setState({
                    userInfo: res.data,
                  });
                }
              });
            },
            operation: [
              {
                type: 'submit',
                label: I18n('SAVE'),
              },
            ],
          }}
          />
        }
      </Spin>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    minHeight: '250px',
  },
};
