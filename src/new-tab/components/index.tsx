import React from 'react'

import https from 'https'
import url from 'url'

import Store from '../../stores/new-tab'
import { observer } from 'mobx-react'

import Preloader from '../Material/Preloader'

import NewTabHelper from '../../utils/new-tab'
import NewTabCard from './Card'

interface Props {

}

interface State {

}

@observer
export default class NewTab extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      cards: []
    };

    window.dictionary = window.dictionaryAPI.get();

    document.title = window.dictionary.pages.newTab.title;
  }

  public componentDidMount() {
    Store.newTab = this;

    this.loadData();
  }

  async loadData() {
    Store.loading = true;

    const news = await NewTabHelper.getNews();

    Store.news = news;
    Store.loading = false;
  }

  public render(): JSX.Element {
    const newsContainer = {
      opacity: Store.loading ? 0 : 1
    };

    const preloaderStyle = {
      display: Store.loading ? "block" : "none"
    };

    return (
      <div className="new-tab">
        <div className="new-tab-news" style={newsContainer}>
          <div className="sub-header">
            {window.dictionary.pages.newTab.news}
          </div>
          {Store.news.map((data: any, key: string) => {
            return <NewTabCard data={data} key={key} />;
          })}
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    );
  }
}