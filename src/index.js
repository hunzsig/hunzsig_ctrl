import ReactDOM from 'react-dom';

import {BrowserRouter as Router} from 'react-router-dom';

import {Api, Auth, I18nConfig, Image} from 'h-react';
import hRouter from './Router';
import Error from "./Error";

const CONTAINER = document.getElementById('h-container');

if (!CONTAINER) {
  throw new Error('Not <div id="h-container"></div> Element.');
}

Auth.setLoginUrl('/sign/in');
Image.set('404', './../../public/img/logo.png');

I18nConfig.setLang('zh_cn');
I18nConfig.setSupport(['zh_cn', 'zh_tw', 'zh_hk', 'en_us', 'ja_jp', 'ko_kr']);

// 载入远端i18n数据
Api.config(Router, 'def', '/api/ajax', null /*{ mode: 'des-cbc', secret: 'iod13kxx' }*/, {});
Api.query().post({I18N_ALL: {}}, (res) => {
  if (res.code === 200) {
    I18nConfig.setData(res.data);
    hRouter.setRouter(Router);
    hRouter.setIsAsync(true);
    hRouter.setConfig(require('./routerConfigAsync').default);
    ReactDOM.render(hRouter.build(), CONTAINER);
  } else {
    ReactDOM.render(<Error msg={res.msg}/>, CONTAINER);
  }
});
