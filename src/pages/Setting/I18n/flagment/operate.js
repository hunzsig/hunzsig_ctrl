import React, {useState} from "react";
import {message, Button} from 'antd';
import {Api, I18n} from "h-react";

const btn = {
  marginRight: '10px',
};

export default () => {

  const [backuping, setBackuping] = useState(false);

  const backup = () => {
    setBackuping(true);
    Api.query().post({I18N_BACKUP: {}}, (res) => {
      setBackuping(false);
      if (res.code === 200) {
        message.success(I18n(['BACKUP', 'SUCCESS']));
      } else {
        message.error(res.msg);
      }
    })
  };

  return (
    <div>
      <Button
        type="default"
        size="small"
        style={btn}
        danger
        onClick={backup}
        loading={backuping}
        disabled={backuping}
      >
        {I18n(['BACKUP', 'TRANSLATE', 'DATA'])}
      </Button>
    </div>
  );
};