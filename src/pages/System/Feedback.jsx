import React, { Component } from 'react';
import { Spin } from 'antd';
import FilterTable from 'h-react-library/components/FilterTable';
import Index from "h-react-library/common/Api";

export default class ThisPage extends Component {
  constructor(props) {
    super(props);
    this.name = '反馈信息';
    this.state = {
      params: null,
    };
    this.table = null;
    this.KV = {
      feedback_type: {},
    };
    this.MAP = {
      feedback_type: [],
    };
  }

  componentDidMount() {
    Index.real('System.Data.getInfoForKey', { key: ['feedback_type'] }, (res) => {
      console.log(res.data);
      res.data.feedback_type.system_data_data.forEach((sdd) => {
        this.KV.feedback_type[sdd.key] = sdd.label;
        this.MAP.feedback_type.push({ value: sdd.key, label: sdd.label });
      });
      this.setState({
        params: {
          scope: 'Data.Feedback.getList',
          params: {
            page: 1,
            pagePer: 20,
          },
          filter: [
            { name: '联系人', field: 'contact_name', type: 'string' },
            { name: '联系电话', field: 'contact_phone', type: 'string' },
            { name: '反馈时间', field: 'create_time', type: 'rangeDatetime' },
          ],
          display: [
            { field: 'data_feedback_create_time', name: '反馈时间' },
            { field: 'data_feedback_content', name: '内容' },
            { field: 'data_feedback_contact_name', name: '联系人' },
            {
              field: 'data_feedback_contact_phone',
              name: '联系电话',
              renderColumn: (...values) => {
                console.log(values);
                const mobile = values[3].data_feedback_contact_phone;
                console.log(mobile);
                return (
                  <div>
                    <span>{mobile}</span>
                  </div>
                );
              },
            },
          ],
        },
      });
    });
  }

  onRef = (table) => {
    this.table = table;
  };

  render() {
    return (
      <Spin style={styles.loading} shape="dot-circle" color="#aaaaaa" spinning={this.state.params === null}>
        {this.state.params !== null && <FilterTable table={this.state.params} title={this.name} hasBorder={true} isSearch={true} onRef={this.onRef} />}
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
