import React, {useState, useEffect} from "react";
import {Table, Button, Modal} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import {Api, I18n, I18nConfig} from "h-react";
import filterDropdown from "./filter";

export default () => {

  const [uniqueInfo, setUniqueInfo] = useState({});
  const [visible, setVisible] = useState(false);

  const tableFix = 'i18n_';
  const col = [
    {
      width: 300,
      title: I18n('UNIQUE_KEY'),
      dataIndex: tableFix + 'unique_key',
      key: tableFix + 'unique_key',
      ...filterDropdown(tableFix + 'unique_key'),
      render: (text, record) => {
        return (
          <Button icon={<EditOutlined/>} onClick={() => {
            const info = {};
            for (let r in record) {
              info[r.replace(tableFix, '')] = record[r];
            }
            setUniqueInfo(info);
            setVisible(true);
          }}>
            {text.length > 25 ? text.substr(0, 25) + '...' : text}
          </Button>);
      }
    },
  ];
  I18nConfig.support.forEach((v) => {
    col.push({
      title: v,
      dataIndex: tableFix + v,
      key: tableFix + v,
      ellipsis: true,
      ...filterDropdown(tableFix + v)
    });
  });

  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(col);

  const getI18nData = () => {
    Api.query('post').real('I18N_ALL', {}, (res) => {
      if (res.code === 200) {
        setDataSource(res.data);
        setColumns(columns);
      } else {
        setDataSource([]);
      }
    });
  };

  useEffect(() => {
    getI18nData();
  }, []);

  const onChange = (pagination, filters, sorter) => {
    console.log(pagination);
    console.log(filters);
    console.log(sorter);
  };

  return (
    <div>
      <Modal
        title={I18n('TRANSLATE') + uniqueInfo.unique_key}
        visible={visible}
        footer={null}
        onOk={() => {
          setUniqueInfo({});
          setVisible(false);
        }}
        onCancel={() => {
          setUniqueInfo({});
          setVisible(false);
        }}
      >
        {
          uniqueInfo.unique_key && <I18nForm data={uniqueInfo} callback={() => {
            getI18nData();
            setVisible(false);
          }}/>
        }
      </Modal>
      <Table
        rowKey={tableFix + 'unique_key'}
        pagination={{position: ["bottomCenter"]}}
        dataSource={dataSource}
        columns={columns}
        onChange={onChange}
      />
    </div>
  );
};