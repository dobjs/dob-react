import { observable } from 'dob'

@observable
export class ArticleStore {
  articles: Array<{
    title: string
  }> = []
}