import React, {Component} from 'react';
import {Tree, Input, Spin, Row, Col} from 'antd';
import {FileTextOutlined} from '@ant-design/icons';
import {Api, I18n} from "h-react";
import "./LogFile.less";

const {DirectoryTree} = Tree;
const {Search} = Input;

class LogFile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      putting: false,
      expandedKeys: [],
      autoExpandParent: true,
      treeData: [],
      fileData: '...',
    };
  }

  getDirDataChildren = (data, pkey = '', path = '') => {
    const treeData = [];
    data && data.forEach((val, idx) => {
      const key = [idx, pkey, val.path].join('#');
      const temp = {
        key: key,
        title: val.path,
        path: path + '/' + val.path
      };
      if (val.children) {
        temp.selectable = false;
        temp.children = this.getDirDataChildren(val.children || [], key, temp.path);
      } else {
        temp.selectable = true;
        temp.icon = <FileTextOutlined/>;
      }
      treeData.push(temp);
    });
    return treeData;
  };

  getDirData = () => {
    this.setState({
      loading: true,
    });
    Api.query().post({LOG_DIR: {}}, (res) => {
      this.setState({
        loading: false,
      });
      if (res.code === 200) {
        this.setState({
          treeData: this.getDirDataChildren(res.data)
        });
      }
    });
  };

  getFileData = (file) => {
    this.setState({
      putting: true,
      fileData: '...',
    });
    Api.query().post({LOG_FILE: {file: file}}, (res) => {
      this.setState({
        putting: false,
      });
      if (res.code === 200) {
        this.setState({
          fileData: res.data.string
        });
      }
    });
  };

  componentDidMount() {
    this.getDirData();
  }

  getSearchKey = (value, tree, parentKey = []) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.key.toLowerCase().indexOf(value) > -1) {
        parentKey.push(node.key);
      } else if (node.children) {
        parentKey = this.getSearchKey(value, node.children, parentKey);
      }
    }
    return parentKey;
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    this.getFileData(info.node.path);
  };

  onChange = e => {
    const {value} = e.target;
    if (value) {
      this.setState({
        expandedKeys: this.getSearchKey(value.toLowerCase(), this.state.treeData),
        autoExpandParent: true,
      });
    } else {
      this.setState({
        expandedKeys: [],
        autoExpandParent: false,
      });
    }
  };

  render() {
    return (
      <Row>
        <Col span={6}>
          <Search
            loading={this.state.loading}
            disabled={this.state.loading}
            placeholder={I18n('SEARCH')}
            enterButton={I18n('REFRESH')}
            onChange={this.onChange}
            onSearch={() => {
              this.getDirData();
            }}
          />
          <DirectoryTree
            style={{marginTop: 8}}
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            treeData={this.state.treeData}
            onSelect={this.onSelect}
          />
        </Col>
        <Col span={18}>
          <div className="log-box">
            <div dangerouslySetInnerHTML={{__html: this.state.fileData}}/>
            {
              this.state.putting &&
              <div className="putting">
                <Spin/>
              </div>
            }
          </div>
        </Col>
      </Row>
    );
  }
}

export default LogFile;
