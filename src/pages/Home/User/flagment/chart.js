import React, {useState, useEffect} from "react";
import {Column} from '@ant-design/charts';
import {Api} from "h-react";
import {Spin} from "antd";

import "./chart.less";

export default () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    user: [],
    account: [],
  });

  const getData = () => {
    Api.query().post({
      STAT_USER: {},
      STAT_USERACCOUNT: {},
    }, (res) => {
      if (res.code === 200) {
        setData({
          user: res.data.STAT_USER,
          account: res.data.STAT_USERACCOUNT,
        })
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const config = {
    user: {
      title: {
        visible: true,
        text: '用户量分布图',
      },
      description: {
        visible: true,
        text: '平台用户数量统计',
      },
      forceFit: true,
      data: data.user,
      padding: 'auto',
      xField: 'label',
      yField: 'value',
      meta: {
        label: {alias: '用户状态'},
        value: {alias: '用户数'},
      },
    },
    account: {
      title: {
        visible: true,
        text: '账号量分布图',
      },
      description: {
        visible: true,
        text: '平台账号数量统计',
      },
      forceFit: true,
      data: data.account,
      padding: 'auto',
      xField: 'label',
      yField: 'value',
      meta: {
        label: {alias: '账号类型'},
        value: {alias: '账号数'},
      },
    },
  };

  if (loading) {
    return (
      <div>
        <div className="loading">
          <Spin/>
        </div>
        <div className="loading">
          <Spin/>
        </div>
      </div>

    );
  } else {
    return (
      <div>
        <Column {...config.user} />
        <Column {...config.account} />
      </div>
    );
  }
};