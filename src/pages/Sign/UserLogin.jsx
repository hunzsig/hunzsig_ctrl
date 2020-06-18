import React, {Component, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from 'antd';
import {TranslationOutlined} from '@ant-design/icons';
import {I18n, I18nContainer} from "h-react";
import LoginForm from './flagment/form'
import './UserLogin.less';

const
  styles = {
    userLoginBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
    },
    formContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '40px 40px 20px 40px',
      background: '#fff',
      borderRadius: '6px',
      boxShadow: '1px 1px 2px #eee',
    },
    formItem: {
      position: 'relative',
      marginBottom: '25px',
      flexDirection: 'column',
    },
    formTitle: {
      margin: '0 0 20px',
      textAlign: 'center',
      color: '#444',
      letterSpacing: '12px',
    },
  };

class UserLogin extends Component {

  render() {
    // 寻找背景图片可以从 https://unsplash.com/ 寻找
    const backgroundImage = require('./flagment/back.jpg');
    return (
      <div className="user-login">
        <div
          style={{
            ...styles.userLoginBg,
            backgroundImage: `url(${backgroundImage.default})`,
          }}
        />
        <div className="content-wrapper">
          <h2 className="slogan">hunzsig</h2>
          <div style={styles.formContainer}>
            <h4 style={styles.formTitle}>{I18n('LOGIN')}</h4>
            <LoginForm/>
          </div>
        </div>
        <I18nContainer placement="right">
          <Button className="tranBtn" icon={<TranslationOutlined/>}>Translate</Button>
        </I18nContainer>
      </div>
    );
  }
}

export default withRouter(UserLogin);
