import React, {useState} from "react";
import {message, Form, Input, Button, Checkbox} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Api, Auth, I18n, Path} from "h-react";

export default () => {

  const [formData, setFormData] = useState({
    account: Auth.getAccount(),
    password: undefined,
    remember: Auth.getRemember(),
    loginStatus: 'free',
  });

  const layout = {
    labelCol: {
      span: 0,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const
    tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 24,
      },
    };

  const onFinish = values => {
    console.log('Success:', values);
    if (formData.loginStatus !== 'free') {
      return;
    }
    setFormData({...formData, loginStatus: 'ing'});
    Api.query().real('USER_LOGIN_ADMIN', values, (res) => {
      if (res.code === 200) {
        message.success(I18n('LOGIN_SUCCESS'));
        setFormData({...formData, loginStatus: 'ok'});
        console.log(values.remember);
        if (values.remember === true) {
          Auth.setRemember(values.remember ? 1 : 0);
          Auth.setAccount(values.account);
        }
        Auth.setUserId(res.data.user_uid);
        setTimeout(() => {
          Path.locationTo('/');
        }, 2000);
      } else {
        message.error(res.msg);
        setTimeout(() => {
          setFormData({...formData, loginStatus: 'free'});
        }, 300);
      }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="login"
      initialValues={formData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="account"
        rules={[
          {
            required: true,
            message: I18n(['PLEASE_INPUT', 'YOUR', 'ACCOUNT']) + '!',
          },
        ]}
      >
        <Input
          name="account"
          maxLength={20}
          allowClear={true}
          prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'ACCOUNT'])}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: I18n(['PLEASE_INPUT', 'YOUR', 'PASSWORD']) + '!',
          },
        ]}
      >
        <Input.Password
          name="password"
          maxLength={16}
          prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder={I18n(['YOUR', 'PASSWORD'])}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item {...tailLayout} name="remember" valuePropName="checked" noStyle>
          <Checkbox>{I18n('REMEMBER_ME')}</Checkbox>
        </Form.Item>
        <Button type="link">{I18n('FORGOT_PASSWORD')}</Button>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          style={{width: '100%'}}
          htmlType="submit"
          // disabled={!formData.account || !formData.password}
          type={formData.loginStatus === 'free' ? 'primary' : formData.loginStatus === 'ok' ? 'secondary' : 'normal'}
          loading={formData.loginStatus !== 'free'}
        >
          {formData.loginStatus === 'free' ? I18n('SUBMIT') : formData.loginStatus === 'ok' ? I18n('LOADING') : I18n('ACCESSING')}
        </Button>
      </Form.Item>
    </Form>
  );
};