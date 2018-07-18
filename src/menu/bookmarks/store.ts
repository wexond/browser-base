import { observable } from 'mobx';

class Store {
  @observable
  data: any = {
    folders: [
      {
        title: 'Folder',
        folders: [
          {
            title: 'Subfolder',
            folders: [],
            items: [
              {
                title: 'YouTube',
                url: 'https://www.youtube.com',
              },
            ],
          },
        ],
        items: [
          {
            title: 'Facebook',
            url: 'https://www.facebook.com',
          },
        ],
      },
    ],
    items: [
      {
        title: 'wexond/wexond: An extensible web browser with Material UI and built-in ad blocker.',
        url: 'https://www.github.com/Wexond/Wexond',
      },
    ],
  };
}

export default new Store();
