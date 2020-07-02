import React, {useState, useEffect} from "react";
import {message, Form, Input, Button, Modal} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {Api, Auth, I18n} from "h-react";

export default (props) => {

  const [userInfo, setUserInfo] = useState({});
  const [visible, setVisible] = useState(false);
  const [querying, setQuerying] = useState(false);

  const getData = () => {
    if (Auth.isOnline()) {
      Api.query().post({ADMIN_ME: {}}, (resUser) => {
        if (resUser.code === 200) {
          setUserInfo(resUser.data);
        } else {
          message.error(resUser.msg);
        }
      })
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
    if (querying === true) {
      return;
    }
    setQuerying(true);
    Api.query().post({I18N_SET: values}, (res) => {
      setQuerying(false);
      if (res.code === 200) {
        message.success(I18n('SUCCESS'));
        props.callback();
      } else {
        message.error(res.msg);
      }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div onClick={() => {
      if (visible === false) {
        setVisible(true)
      }
    }}>
      <UserOutlined/>{userInfo.user_meta_name || '无名氏'}
      <Modal
        title={I18n(['CHANGE MY INFORMATION'])}
        visible={visible}
        footer={null}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          {...layout}
          name="me"
          initialValues={userInfo}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {
            Object.entries(userInfo).map((v) => {
              if (v[0] === '_id') {
                return null;
              }
              return (
                <Form.Item
                  key={v[0]}
                  name={v[0]}
                  rules={[
                    {
                      required: true,
                      message: I18n(['PLEASE_INPUT', 'YOUR']) + v[0] + '!',
                    },
                  ]}
                >
                  <Input addonBefore={v[0]} name={v[0]} allowClear={true}/>
                </Form.Item>
              );
            })
          }
          <Form.Item {...tailLayout}>
            <Button
              style={{width: '100%'}}
              htmlType="submit"
              disabled={querying}
              type={querying ? 'normal' : 'primary'}
              loading={querying}
            >
              {querying ? I18n('LOADING') : I18n('SAVE')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};