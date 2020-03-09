module.exports = function () {
  this.cacheable();
  return `
  import React from 'react';
  import ReactDom from 'react-dom';
  import { AppContainer } from 'react-hot-loader';
  import {IntlProvider, addLocaleData} from "react-intl";
  import en from "react-intl/locale-data/en";
  import zh from "react-intl/locale-data/zh";
  import localeData from "asset/i18n/localeData.js";
  import Entry from '${this.resourcePath.replace(/\\/g, '\\\\')}';
  const state = window.__INITIAL_STATE__;

  addLocaleData([...en, ...zh]);

  const render = (App)=>{
    const locale = state.locale || 'en';
    const messages =  localeData[locale];
    
    const root = document.getElementById('app');
    const renderMode = root.children.length ? 'hydrate' : 'render';
    ReactDom[renderMode](EASY_ENV_IS_DEV ? <AppContainer><IntlProvider locale={locale} messages={messages}><App {...state} /></IntlProvider></AppContainer> : <IntlProvider locale={locale} messages={messages}><App {...state} /></IntlProvider>, root);
  };

  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept('${this.resourcePath.replace(/\\/g, '\\\\')}', () => { render(Entry) });
  }
  render(Entry);
`;
};
