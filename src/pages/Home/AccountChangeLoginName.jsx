import React, {Component} from 'react';
import {Spin} from 'antd';
import {Api, Auth, I18n} from 'h-react';


export default class AccountChangeLoginName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
    };
  }

  componentDidMount() {
    Api.query().cache('USER_INFO', {uid: Auth.getUid()}, (res) => {
      if (res.code === 200) {
        this.setState({
          userInfo: res.data,
        });
      }
    });
  }

  getField = () => {
    const fields = [
      {field: 'old_login_name', type: 'label', label: 'current username', value: this.state.userInfo.user_login_name},
      {
        field: 'login_name',
        type: 'string',
        label: 'new username',
        params: {minLength: 5, maxLength: 20, required: true}
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
            scope: 'USER_CHANGE_LOGINNAME',
            refresh: true,
            defaultErrorStatus: true,
            items: [
              {
                title: 'Change your username',
                col: 1,
                values: this.getField(),
              },
            ],
            valueFormatter: (result) => {
              if (!isNaN(result.login_name.substring(0, 1))) {
                return 'The first char can not be number';
              }
              result.uid = this.state.userInfo.user_uid;
              return result;
            },
            onSuccess: () => {
              this.setState({
                userInfo: null,
              });
              Api.query().real('USER_INFO', {uid: Auth.getUid()}, (res) => {
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
                label: I18n('SUBMIT'),
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
