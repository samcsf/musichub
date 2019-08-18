import * as vm from 'vm';
import * as _ from 'lodash';
import * as util from '../../util/format';
import { SearchResultItem, SearchOption, PurchaseType } from '../../typings/search';
const request = require('request-promise-native');

const source = 'kuwo';

export default class Kuwo {
  constructor() {}

  public async search(
    songName: string,
    options: SearchOption = {}
  ): Promise<Array<SearchResultItem>> {
    let result = await request({
      method: 'GET',
      url: 'http://www.kuwo.cn/api/www/search/searchMusicBykeyWord',
      qs: {
        key: songName,
        pn: options.page || 1,
        rn: options.limit || 30,
        // reqId: bcbd9890-c105-11e9-afec-c3e9ac4498c4
      },
      json: true,
    });
    let list = _.get(result, ["data", "list"]);
    let formatList: Array<SearchResultItem> = list.map(
      (item: KuwoSearchResultItem): SearchResultItem => {
        return {
          source,
          songName: item.name,
          duration: item.duration,
          purchaseType: PurchaseType.MEMBERSHIP,
          price: 0,
          albumName: item.album,
          singerName: item.artist,
          playLink: `http://www.kuwo.cn/play_detail/${item.rid}`,
        };
      }
    );
    return formatList;
  }
}

interface KuwoSearchResultItem {
  album: string;
  albumid: number;
  albumpic: string;
  artist: string;
  artistid: number;
  duration: number;
  hasLossless: boolean;
  hasmv: number;
  isListenFee: boolean;
  isstar: number;
  musicrid: string;
  name: string;
  online: number;
  pay: string;
  payInfo: PayInfo;
  cannotDownload: number;
  cannotOnlinePlay: number;
  pic: string;
  pic120: string;
  releaseDate: Date;
  rid: number;
  songTimeMinutes: string;
  track: number;
}

interface PayInfo {
  cannotOnlinePlay: number;
  cannotDownload: number;
}
