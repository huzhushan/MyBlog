import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return <html>
      <head>
        <title>{this.props.title}</title>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
        <meta name="keywords" content={this.props.keywords}></meta>
        <meta name="description" content={this.props.description}></meta>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></link>
      </head>
      <body>
        <div id="app">{this.props.children}</div>
        <script src="/public/jquery-3.4.1.min.js"></script>
        <script src="/public/bootstrap.min.js"></script>
        <script src="//at.alicdn.com/t/font_1545842_kazs376bet.js"></script>

      </body>
    </html>;
  }
}