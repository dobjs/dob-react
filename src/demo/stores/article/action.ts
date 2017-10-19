import { Action, observable } from 'dob'
import { injectFactory, inject } from 'dependency-inject';
import { ArticleStore } from './store'

export class ArticleAction {
  @inject(ArticleStore) private ArticleStore: ArticleStore;

  @Action addArticle() {
    return this.ArticleStore.articles.push({
      id: Math.random(),
      title: '测试',
      author: 'ascoders'
    })
  }

  @Action changeArticleTitle(index: number, title: string) {
    this.ArticleStore.articles[index].title = title

  }

  @Action removeArticle(index: number) {
    this.ArticleStore.articles.splice(index, 1)
  }

  @Action multipleAction(title: string) {
    const index = this.addArticle()
    this.changeArticleTitle(index - 1, title)
  }
}
