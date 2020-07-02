import React, {Component} from 'react';
import {Row, Col} from 'antd';
import Chart from './flagment/chart';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row type="flex" justify="center" align="middle">
          <Col span={24}>
            <Chart/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
