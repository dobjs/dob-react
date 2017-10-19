import { observable } from 'dob'

@observable
export class ArticleStore {
  articles: Array<{
    id: number
    title: string
    author: string
  }> = []
}