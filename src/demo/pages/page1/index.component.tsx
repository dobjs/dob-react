import { Connect } from '../../../';
import * as React from 'react';
import { PureComponent } from '../../utils/pure-render';
import { Props, State } from './index.type';

import Article from './article/index.component'

@Connect
export default class Page1 extends PureComponent<Props, State> {
  public static defaultProps = new Props();
  public state = new State();

  public render() {
    const Articles = this.props.ArticleStore.articles.map((article, index) => {
      return <Article key={article.id} index={index} article={article} />
    })

    return (
      <div>
        <button onClick={() => {
          this.props.ArticleAction.addArticle()
        }}>添加文章</button>

        <button onClick={() => {
          this.props.ArticleAction.multipleAction('123')
        }}>添加文章并修改文章名为123</button>

        <ul>
          {Articles}
        </ul>
      </div>
    );
  }
}