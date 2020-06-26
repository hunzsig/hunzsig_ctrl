import {useState} from "react";
import {Input, Button, Form, DatePicker} from 'antd';
import * as moment from 'moment';
import {I18n, I18nConfig, Parse} from "h-react";

const {RangePicker} = DatePicker;

export default (props) => {

  const params = {};
  for (let i in props.params) {
    if (!props.params[i] || i === 'auth_user_id') {
      continue;
    }
    if (i === 'log_time') {
      params[i] = [moment.unix(props.params[i][0]), moment.unix(props.params[i][1])];
    } else {
      params[i] = props.params[i];
    }
  }

  const [form] = Form.useForm();

  const onSearch = values => {
    let log_time;
    if (values.log_time) {
      log_time = values.log_time[0].unix().valueOf() + ',' + values.log_time[1].unix().valueOf()
    }
    const data = {
      ...params,
      key: values.key,
      type: values.type,
      log_time: log_time
    };
    history.replaceState(data, document.title, Parse.urlEncode(data));
    props.onFilter(data);
  };

  const onClear = () => {
    const data = {
      ...params,
      key: '',
      type: '',
      log_time: '',
    };
    form.setFieldsValue(data);
    history.replaceState(data, document.title, Parse.urlEncode(data));
    props.onFilter(data);
  };

  return (
    <div className="filter">
      <Form
        layout="inline"
        form={form}
        name="log-db"
        initialValues={params}
        onFinish={onSearch}
      >
        <Form.Item name="key">
          <Input addonBefore={I18n("source")} allowClear={true}/>
        </Form.Item>
        <Form.Item name="type">
          <Input addonBefore={I18n("type")} allowClear={true}/>
        </Form.Item>
        <Form.Item name="log_time">
          <RangePicker
            locale={I18nConfig.antd()}
            showTime={{format: 'HH:mm'}}
            format="YYYY-MM-DD HH:mm:00"
            ranges={{
              [I18n('Today')]: [moment(), moment()],
              [I18n(['This', 'Month'])]: [moment().startOf('month'), moment().endOf('month')],
            }}
            onChange={(dates, dateString) => dateString}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{I18n('SEARCH')}</Button>
          <Button style={{marginLeft: 5}} onClick={onClear}>{I18n('CLEAR')}</Button>
        </Form.Item>
      </Form>
    </div>
  );

};