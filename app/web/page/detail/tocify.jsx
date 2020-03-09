import React, { Component } from 'react';
import { Anchor } from 'antd';

const { Link } = Anchor;


export default class Tocify extends Component {
  constructor(props) {
    super(props);

    this.tocItems = [];
    this.index = 0;

    this.add = this.add.bind(this)
  }

  add(text, level) {
    const anchor = `toc${level}${++this.index}`;
    const item = { anchor, level, text };
    const items = this.tocItems;

    if (items.length === 0) { // 第一个 item 直接 push
      items.push(item);
    } else {
      let lastItem = items[items.length - 1]; // 最后一个 item

      if (item.level > lastItem.level) { // item 是 lastItem 的 children
        for (let i = lastItem.level + 1; i <= 2; i++) {
          const { children } = lastItem;
          if (!children) { // 如果 children 不存在
            lastItem.children = [item];
            break;
          }

          lastItem = children[children.length - 1]; // 重置 lastItem 为 children 的最后一个 item

          if (item.level <= lastItem.level) { // item level 小于或等于 lastItem level 都视为与 children 同级
            children.push(item);
            break;
          }
        }
      } else { // 置于最顶级
        items.push(item);
      }
    }

    return anchor;
  }

  reset () {
    this.tocItems = [];
    this.index = 0;
  };

  renderToc(items) { // 递归 render
    return items.map(item => (
      <Link key={item.anchor} href={`#${item.anchor}`} title={item.text}>
        {item.children && this.renderToc(item.children)}
      </Link>
    ));
  }

  render() {
    return (
      <Anchor affix showInkInFixed offsetTop={64}>
        {this.renderToc(this.tocItems)}
      </Anchor>
    );
  }
}