import * as vm from 'vm';
import * as _ from 'lodash';
import * as util from '../../util/format';
import {
  SearchResultItem,
  SearchOption,
  PurchaseType,
} from '../../typings/search';
const request = require('request-promise-native');

const source = 'xiami';

export default class Xiami {
  constructor() {}

  public async search(
    songName: string,
    options: SearchOption = {}
  ): Promise<Array<SearchResultItem>> {
    let result = await request({
      method: 'GET',
      url: 'https://www.xiami.com/api/search/searchSongs',
      qs: {
        _q: {
          key: songName,
          pagingVO: { page: options.page || 1, pageSize: options.limit || 60 },
        },
        // _s: '4d9735317f2d1b77430ddba31add8da2'
      },
      json: true,
    });
    let list = _.get(result, ['result', 'data', 'songs']);
    let formatList: Array<SearchResultItem> = list.map(
      (item: XiamiSearchItem): SearchResultItem => {
        return {
          source,
          songName: item.songName,
          duration: item.length / 1e3,
          purchaseType: PurchaseType.OTHER,
          price: item.price || 0,
          albumName: item.albumName,
          singerName: item.artistName,
          playLink: `https://www.xiami.com/song/${item.songStringId}`,
        };
      }
    );
    return formatList;
  }
}

export interface XiamiSearchItem {
  relatedLyric: string;
  scm: string;
  songId: number;
  songStringId: string;
  songName: string;
  subName: string;
  newSubName: string;
  translation: string;
  albumId: number;
  albumStringId: string;
  albumLogo: string;
  albumName: string;
  artistId: number;
  artistName: string;
  artistLogo: string;
  singers: string;
  length: number;
  mvId: string;
  flag: number;
  songStatus: number;
  cdSerial: number;
  track: number;
  pinyin: string;
  thirdpartyUrl: string;
  needPayFlag: number;
  price: null;
  albumPrice: null;
  bakSongId: number;
  panFlag: number;
  musicType: number;
  albumLogoS: string;
  albumSongCount: number;
  artistAlbumCount: number;
  songwriters: string;
  composer: string;
  arrangement: string;
  boughtCount: number;
  pace: number;
  albumSubName: string;
  artistAlias: string;
  gmtCreate: number;
  albumLanguage: string;
  playCount: null;
  shareCount: null;
  favCount: null;
  offline: boolean;
  offlineType: number;
  downloadCount: boolean;
  originOffline: boolean;
  exclusive: boolean;
  canReward: boolean;
  isFavor: boolean;
  recommendSongs: null;
  purviewRoleVOs: PurviewRoleVO[];
  bakSong: null;
  lyricInfo: LyricInfo;
  listenFiles: null;
  singerVOs: Vo[];
  artistVOs: Vo[];
  bizTags: string[];
  tags: null;
  thirdSongs: null;
  freeAudioInfo: FreeAudioInfo;
}

export interface Vo {
  artistId: number;
  artistStringId: string;
  artistName: string;
  alias: string;
  artistLogo: null | string;
  isMusician: boolean | null;
  countLikes: null;
  isFavor: null;
  rewardSchemaUrl: null;
  companyVO: null;
}

export interface FreeAudioInfo {
  allowFreeAudition: boolean;
  freeAuditionStart: null;
  freeAuditionEnd: null;
}

export interface LyricInfo {
  lyricId: number;
  lyricType: number;
  lyricFile: string;
  isOfficial: boolean;
  userId: number;
  userName: null;
  gmtModified: number;
}

export interface PurviewRoleVO {
  quality: string;
  filesize: number;
  isExist: boolean;
  operationVOs: OperationVO[];
}

export interface OperationVO {
  purpose: number;
  upgradeRole: number;
  needVip: boolean;
  needPay: boolean;
  needSvip: boolean;
}
