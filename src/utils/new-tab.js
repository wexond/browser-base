export default class NewTab {
  static getNews (data, newsCount = 10) {
    const news = []

    for (var i = 0; i < newsCount; i++) {
      if (data.articles[i].urlToImage == null) newsCount++
      else news.push(data.articles[i])
    }

    return news
  }
}