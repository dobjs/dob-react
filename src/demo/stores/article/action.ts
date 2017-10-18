import { Action, observable } from 'dob'
import { injectFactory, inject } from 'dependency-inject';
import { ArticleStore } from './store'

export class ArticleAction {
  @inject(ArticleStore) private ArticleStore: ArticleStore;

  @Action addArticle() {
    this.ArticleStore.articles.push({
      title: '测试'
    })
  }

  @Action changeArticleTitle(index: number, title: string) {
    this.ArticleStore.articles[index].title = title
  }
}
