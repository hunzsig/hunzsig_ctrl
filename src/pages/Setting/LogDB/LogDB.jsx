import React, {Component} from 'react';
import {Table, Pagination} from 'antd';
import ReactJson from 'react-json-view'
import {Api, I18n, Parse, Moment} from "h-react";
import Filter from "./flagment/filter";
import "./LogDB.less";

const table = "yonna_log_";

class LogDB extends Component {

  constructor(props) {
    super(props);
    const search = Parse.urlSearch(props);
    this.state = {
      loading: true,
      params: {
        key: search.key,
        type: search.type,
        log_time: search.log_time ? search.log_time.split(',') : undefined,
        current: search.current || 1,
        per: search.per || 10,
      },
      pagination: null,
      dataSource: [],
      columns: [
        {
          title: I18n(["record", "time"]),
          dataIndex: table + 'log_time',
          key: table + 'log_time',
          render: (txt) => Moment.format(txt)
        },
        {
          title: I18n("source"),
          dataIndex: table + 'key',
          key: table + 'key',
        },
        {
          title: I18n("type"),
          dataIndex: table + 'type',
          key: table + 'type',
        },
        {
          width: "50%",
          title: I18n("data"),
          dataIndex: table + 'data',
          key: table + 'data',
          render: (txt) => <ReactJson src={txt} collapsed={true}/>
        },
      ]
    };
  }

  getList = () => {
    this.setState({
      loading: true,
    });
    Api.query().post({LOG_DB: this.state.params}, (res) => {
      this.setState({
        loading: false,
      });
      if (res.code === 200) {
        this.setState({
          dataSource: res.data.list || [],
          pagination: res.data.page
        });
      }
    });
  };

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <div>
        <Filter params={this.state.params} onFilter={(params) => {
          params.current = 1;
          this.setState({params: params});
          this.getList();
        }}/>
        <Table
          rowKey="_id"
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={false}
        />
        {
          this.state.pagination && <Pagination
            className="pagination"
            showSizeChanger
            showQuickJumper
            defaultCurrent={this.state.pagination.current}
            defaultPageSize={this.state.pagination.per}
            total={this.state.pagination.total}
            showTotal={total => I18n("TOTAL") + total + I18n("ITEMS")}
            onChange={(current, pageSize) => {
              this.state.params.current = current;
              this.state.params.pageSize = pageSize;
              this.setState({params: this.state.params});
              this.getList();
            }}
            onShowSizeChange={(current, pageSize) => {
              this.state.params.current = current;
              this.state.params.pageSize = pageSize;
              this.setState({params: this.state.params});
              this.getList();
            }}
          />
        }
      </div>
    );
  }
}

export default LogDB;
