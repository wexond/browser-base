import { ISettings } from '~/interfaces';
import { remote, app } from 'electron';

const pkg = require('../../package.json');

export const DEFAULT_SETTINGS: ISettings = {
  theme: 'wexond-light',
  darkContents: false,
  shield: true,
  multrin: true,
  animations: true,
  bookmarksBar: false,
  suggestions: true,
  themeAuto: true,
  searchEngines: [],
  searchEngine: 0,
  startupBehavior: {
    type: 'empty',
  },
  warnOnQuit: true,
  version: pkg.version,
  downloadsDialog: false,
  downloadsPath: remote
    ? remote.app.getPath('downloads')
    : app
    ? app.getPath('downloads')
    : '',
};

export const DEFAULT_SEARCH_ENGINES = [
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
    keywordsUrl: '',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAv5JREFUOI1tk19oW3UcxT+/m5ubepP0bmFZSlK9s03nv6bbCA4VnYgvvuqQtfZB8UknhTkHFqSITLDCSufLZIJDfGnGoD7WB1EU/4BtV83ajXZZbdL1tmnpatYkvX+Se30IZFP7ff6ewzmccwT/Oa83HieUGCZ+MF1uS+oAobVcHmNhmvLKoMgYxv3/ogk8dQQ2zLHtV870si+GVfgLe3EWgECyB0XvgKJBeHwkQzTQJ87P3CPwTh2Bv6Vs9fSF1NaVi/hCe7HmJ3EKfyBpD4Ln4lkVAt3HiPQPoI6+dQ2NHnF+BgmADXOsevpCau2j13E3iwSfehH9yx9p//wXJFkCz0MKR7Fv/Unx7JtU372YYsMcAxBebzy+/erZldLv32PPT6F0pWn/9GsQvqbP4rkzVH6bQCgP4NVslM5DaEdfIHxlKCERSgwTi2PN/YznVIidHOJGodQEV8wavjc+AHOz4VlWsGZ/glgcQolhifgjaTu/iFBUqDvIWgS/8Lg6twxAsEXmk8uztD59HLdSw92REP4gdn4R4gfTUrmtU7dyWZD84FOwiwaaFiSyJ9hUMfLOk0iJEtETqzz0/hzyHrBuZim3JXX5X5nKCjtLt4g+epio1gJ2Ae+mjr0KwYehcqOT25+14zk1ZNHIUAqt5fKBZA+4DsgtmNlf72N0cU3Y/PYJ1i+nqN31oaZ28GoOgWQPodVcXsJYmFb0Djyr0lBw9bt7BP4DLH34OFLIIXy0jBAe1awK9WqjWMbCtER5ZZCiQaD7GF69hru1jFu52+QIH34GeypA6ZsI25ManmsT6H4OigaUVwYlkTGM8Pi5TKR/ACFcEH7qiznGcl/ww+0Jpp8/wMRLKl+9pqFYJkK4RPoHCI+PZETGMBpNjLb0qaMnr8WGLqE89izm/HU2nTt8PPU2o06GeV1lx9lC6TpEbOhSo8rRQN/uY3r5vV5/VzeFhEqbfy+t4XZqM5PYpSL1rfXdx/S/Oav7h9nXmS7v79Bd6rTeWc6zvrTrnP8Bts5CMBEjpA4AAAAASUVORK5CYII=',
  },
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAglJREFUOI2Nk99L02EUxj/vNkthRdToFxLNJqaJESYVXtSN3ZS1CqMM6qKLQKJ/oPsF3eV1F1HRBrVcGV4FdRPeJUK0oeYaUmyzRbOxpvtuTxd+v7atIA+ci/e8z3nOe57zHmgwSQFJEUkzksq2z9ixtkZ8bSKSxvR/i0r6Z3LCQRRfxZS7claZ7u3KHPApd3lQxfE67rhDYmyCMSCo5RLfh89QSc6A2w1WebWCZwNaLtLU08fWxy+cus+NMRecniVJi+dOKtPfrUzPLhUij2TNz8lKzqkQfqjs0XZV8j8a2/FjiyPrQ1iZI61Kd+yUtZBahxSSpDC2wrImA1qZQMXo6HqTJSnhAfwAys9h3NA80FsnsLn1kw6vWTv/qkCwy829ay0AbZ46sMBUGkZUY9uaDW4DtQgXkATwbG6nBEwsxOtHPLqJRMhLIuTl4mEPhbLY53M51/Mu4D1AevcdDi6e4NRUhM9LX/6qns3D/UmLchX6O9cePmW0+j0/AQzErvO1mOVbpcjdQyMca+3FZVxMp6e5/SaFL32DPT6LJzdbHAK/85GiwPlSdYXg+Agfl1J4jJuyKghoMi5kCuzQcd4OhWjZCMAzY8yQQwAQB/YDvJx9zYPZGO9ycapA35YAVwOnudQ56FSOA13G/JmOsw/Rdcz+qRqXqU51yS8prNXlWrE9Ycf2NuJ/A6uf5JCErH2FAAAAAElFTkSuQmCC',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    keywordsUrl: '',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAANlBMVEUAfX3k8/MAiop7trYAgoL6//8AdXULhIT///+exMQ4l5ew0dFLoaG929v0+/vQ5+eVwsIcjo4kKiufAAAAZElEQVQYlY2QyQ6AMAhEpy0Fuqr//7NWo108OQcSHsMSICJEMoSWR8sLQNCCD/A/AEALYFMy3+wFQdWkg0aLNaoaMM3gbQaV3eVww9HKajL60KbqmJ61QrvXBPQ7WrCRp0vXB5xZ6wZZjwmZbQAAAABJRU5ErkJggg==',
  },
  {
    name: 'Ekoru',
    url: 'https://www.ekoru.org/?ext=wexond&q=%s',
    keywordsUrl: 'http://ac.ekoru.org/?ext=wexond&q=%s',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAABTVBMVEVHcEwGoc4fq68HodEirbQ/v78RmcxNsqIupbJOsVAZocIHntchqb0KoNgZqL0LoNk2r38HoNYaq71Ss0VVt1BZtEJUsj+fyjtuwGUXms8Poc0HnNMFpM8JotISoMgRn9UQn9EInNVdulhyuUIYqLMHp8p4vUAZo8mKxD4Gn9YNpcsGoNSMxj8Wq751uj8Fpdo0r3sFpNwsrotUtEiTyk1SsjtSskVQtWJItGmMxTyHxUgmsLAsqaI0q4kOmNQ9sG4yr4Jvu0krsakcpbRjuk6Dwz0KqMtBsm4Upr6AwkBCsW4NqMcurpM9sHaUyFhwvEdIsVSSylUwsKWizkqkzkBdt0lct0Iqrq5fuER/wT6Bwj8lrbNwwHC21UNPt4cPpMRIt49Zu38Up7szspglrKdEtHc8solGt5BavH5OuIB3xFqAxVMFp9hAsn9lv3FSuK/uAAAAaHRSTlMA/P6dPgQPCxUwIcYubZRWYLpdQthwTGn6GlGl9O6AOefX9SDzzpbvtqz54uCdRvjxyfuV2Thg9+166sJzeVmu3Mrw2tqi27Xz0W+p6aJdu4mYolKqrX+WyVqKgrEqx/bYvP///////rhNcOkAAAD4SURBVBiVJY9VQ8IAGAC/jSUrxpKUkO4uu7u7XQPq/3904r3dvR0AACGUKghSKQkkLFgS3612s9lG47HgwtPosKPSPfViw2D8QomoLFFhvpbE6HUjQAJXHqrsxPU8d4un9w8EaFm3wcnPuFiszs2adCJCw1HCXrWOQ3Z3hoZPy/Bl9+9nT+T1GZk9dI+PDD8oV/PHV+3mEs9Pc6FlaHx3nvURgNal8tM9P7TMB+xjPNK6L9S5mQttA2dk+tibrn+y9YwRWOUhwpgyTWAYQW+a8egKCxBNOLLSk+52HCRAEv4LziUsezCwLSQW+b/F15hUoZBKJ6k/+wXyrSm5N9MsrwAAAABJRU5ErkJggg==',
  },
  {
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search?q=%s',
    keywordsUrl: '',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAylJREFUOI1Nk01sVFUYhp9z7r1zO1NK25ShtkxmSqE0VisWf0KbatkQ0USnEhPiwh+SGgkkLowQ6EKKWGgTNi4ICxtQMNFEMG1iMBqURKNMgtYwtKkUq20tFFoYxjudmc7ce+5xgdZ+2zfPu3m/R7Ds9P44oGOoYg9uoQ2IACaaG1jWMDJwDNNMiCODS4xYgg90gqFP4nk7/a1dyOZWCFffD527MDYMX5+CRecCwtr6X4lYgnEv6ujGLeKNwzjeON/+keTjiTBKCxrLVxBfH+Op2jD68+OIy0NTWKV14sgghu7uBJMPdHXjDrGnj/6fL1NMvc71tM25+QaigRlGnRzvX5tjau4W255/CSPtVIjZa+097U1nhD4Qh0VH03uexO2zdP+imSpGsKTHm2suEK89Q8EvI6dWEJJTmIEXWBs7idnzMixmn5Yo9yjtO/hLC1p/qCCjwqw0XJ4ovcGW8DdkvBqUH8IWPp6Oks0P8fdCAv+ZLvAKb0vcQhvNm/ny+gwNpkQIjRQeu+pPYwnNWKYJV5sAGMJDimrS6S/QjY+DKrZItFrtV0boqBxgQ/Aeed8iaqeIhS4hhKZ5ZRJLuBS1yW+ZjdhGDuVeRVeWAyIi0WitIWQoDj/4Hg+HZpnIV7MnOcBsPgZA0EzRO/4Wxye3c2pyF8l0C4YGwJdI4yZz09glLVhinptuGbZUjOVqmMnHsKXDuZmdjGZrcVSQT+ceQ5mPIu7eBpiWBEouyl+/Y1XVc7wz2o/jBZFoTOFTai6QV2Us+JqQ9JBocn6OhppnYeRHMAOJ+zPm04p3z8rTsw77hq8SswMoLVgXvIMpFFeyayiVLvOuxyt1EQ5tfgS644C5VuJrKK/az4l9vNpUz7FNDzFRcMn6HqPZKq4srEbrAr8XinSti3KorQX94UEwjU+QYvLfV34RDP8jQlWvsbufW8EKvhr/k5FUGuVrNlSUsW19HfW2RA/0IKaTCQi0ir7BZTJ1d4L291LI9PFkp2RTB6yqASnh3h0YuQTffwYloRN47BZHl8n0v87bQShwCwdRbgdaPQBCIEQKI/ATpr0XA0Tv0BLzDxefVnicNn0wAAAAAElFTkSuQmCC',
  },
  {
    name: 'Yahoo!',
    url: 'https://search.yahoo.com/search?p=%s',
    keywordsUrl: '',
    icon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAABnklEQVQokZWSPUyTYRSFn/t+rTX9EFp/SICwqIumMUwaJxdlYHAgBJwMCa5sLMaITizGARYSNTGROOAAokMHYggLBBIGCIHESBggwfJTQGgLL/3e61CxVWOa3ukO59xz7z1HOmWBSspUhAZCZREZdSfoGSQqprzCgQa945dHT5qef7mSVVdUCFQtapCICGBVAzSE1MUjibvngOSrrTDyixCoXm+P3u6Ipb7akcdbBlp6LzQ2nZ14nW7uugjsb+Qnh/fOSwiQTllQRZC3mgAeyWIO915vAA9l8Z0mgKEn68m+dEE8BIiQ0WD20+7N+/HWwUu5Hw6YGdu99zSmeeyh+9i3U316rRR8cKqx2nB/6lomHdicizeEu2X5zoua/e/5Dy+36ynsX/JWI7K2efxtJnP1lu/jrc5lE93Rtp56YH36eGUq550yim/1McPPNgr9WH9q6XPWHuj2ql2ZOjK/5/9lXN4qkE0HE0N7MbwH1fMGqvCkiC8hHKFdA41A8s2mjzEiNXj/Wiml4TtUZ3E+JiL/TcAfK1WJKRuWitP6EzoWnEvW4UekAAAAAElFTkSuQmCC',
  },
];
