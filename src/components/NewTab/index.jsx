import React from 'react'

import https from 'https'
import url from 'url'

import Store from '../../stores/new-tab'
import { observer } from 'mobx-react'

import Preloader from '../Preloader'

import NewTabHelper from '../../utils/new-tab'
import NewTabCard from './Card'

@observer
export default class NewTab extends React.Component {
  constructor() {
    super()

    this.state = {
      cards: []
    }

    window.dictionary = window.dictionaryAPI.get()

    document.title = window.dictionary.pages.newTab.title
  }

  componentDidMount() {
    Store.newTab = this

    this.loadData()
  }

  async loadData() {
    Store.loading = true

    const news = await NewTabHelper.getNews()

    Store.news = news
    Store.loading = false
  }

  render() {
    const newsContainer = {
      opacity: Store.loading ? 0 : 1
    }
    
    const preloaderStyle = {
      display: Store.loading ? 'block' : 'none'
    }

    return (
      <div className='new-tab'>
        <div className='new-tab-news' style={newsContainer}>
          <div className='sub-header'>{window.dictionary.pages.newTab.news}</div>
          {
            Store.news.map((data, key) => {
              return <NewTabCard data={data} key={key} />
            })
          }
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    )
  }
}