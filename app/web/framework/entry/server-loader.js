module.exports = function () {
  this.cacheable();
  return `
  import React, { Component } from 'react';
  import Layout from 'framework/layout/layout.jsx';
  import {IntlProvider, addLocaleData} from "react-intl";
  import en from "react-intl/locale-data/en";
  import zh from "react-intl/locale-data/zh";
  import localeData from "asset/i18n/localeData.js";
  import App from '${this.resourcePath.replace(/\\/g, '\\\\')}';
  
  addLocaleData([...en, ...zh]);
  
  export default class Page extends Component {
    render() {
      let locale = this.props.locale || 'zh';
      let messages =  localeData[locale];
      
      return <IntlProvider locale={locale} messages={messages}><Layout {...this.props}><App {...this.props} /></Layout></IntlProvider>;
    }
  }
`;
};
