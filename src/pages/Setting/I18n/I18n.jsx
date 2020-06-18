import React, {Component} from 'react';
import Operate from './flagment/operate';
import Table from './flagment/table';

class I18n extends Component {

  render() {
    return (
      <div>
        <Operate/>
        <Table/>
      </div>
    );
  }
}

export default I18n;
