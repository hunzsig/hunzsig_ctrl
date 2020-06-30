import React, {Component} from 'react';
import {Row, Col, Table} from 'antd';
import {Api} from 'h-react';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stat: [],
    };
  }

  componentDidMount() {
    Api.query().post({PROJECT_INDEX: {}}, (res) => {
      if (res.code === 200) {
        this.setState({
          stat: res.data,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Row type="flex" justify="center" align="middle">
          <Col span={10}>
            {
              this.state.stat.length > 0 &&
              <Table
                size="small"
                dataSource={this.state.stat}
                pagination={false}
                rowKey="type"
                columns={[
                  {
                    title: 'Relation',
                    dataIndex: 'type',
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                  },
                ]}
              />
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default Index;
