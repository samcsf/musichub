import * as vm from 'vm';
import * as util from '../../util/format';
import { SearchResultItem, SearchOption, PurchaseType } from '../../typings/search';
const request = require('request-promise-native');

const source = 'kugou';

export default class Kugou {
  constructor() {}

  public async search(
    songName: string,
    options: SearchOption = {}
  ): Promise<Array<SearchResultItem>> {
    let result = await request({
      method: 'GET',
      url: 'https://songsearch.kugou.com/song_search_v2',
      header: {
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      qs: {
        callback: 'eval',
        keyword: songName,
        page: options.page || 1,
        pagesize: options.limit || 30,
        userid: -1,
        clientver: '',
        platform: 'WebFilter',
        tag: '',
        filter: 2,
        iscorrection: 1,
        privilege_filter: 0,
      },
    });
    let ctx = vm.createContext({});
    vm.runInContext(`this.res = ${result}`, ctx);
    let res = ctx['res'];
    let list = res.data && res.data.lists;
    let formatList: Array<SearchResultItem> = list.map(
      (item: KugouSearchResultItem): SearchResultItem => {
        return {
          source,
          songName: item.SongName,
          duration: item.Duration,
          purchaseType: PurchaseType.ONE_OFF,
          price: item.Price,
          albumName: item.AlbumName,
          singerName: item.SingerName,
          playLink: `https://www.kugou.com/song/#hash=${item.FileHash}&album_id=${item.AlbumID}`,
        };
      }
    );
    return formatList;
  }
}

interface KugouSearchResultItem {
  A320Privilege: number;
  ASQPrivilege: number;
  Accompany: number;
  AlbumID: string;
  AlbumName: string;
  AlbumPrivilege: number;
  AudioCdn: number;
  Audioid: number;
  Auxiliary: string;
  Bitrate: number;
  Duration: number;
  ExtName: string;
  FailProcess: number;
  FileHash: string;
  FileName: string;
  FileSize: number;
  FoldType: number;
  Grp: object;
  HQBitrate: number;
  HQDuration: number;
  HQExtName: string;
  HQFailProcess: number;
  HQFileHash: string;
  HQFileSize: number;
  HQPayType: number;
  HQPkgPrice: number;
  HQPrice: number;
  HQPrivilege: number;
  HasAlbum: number;
  HiFiQuality: number;
  ID: string;
  IsOriginal: number;
  M4aSize: number;
  MixSongID: string;
  MvHash: string;
  MvTrac: number;
  MvType: number;
  OldCpy: number;
  OriOtherName: string;
  OriSongName: string;
  OtherName: string;
  OwnerCount: number;
  PayType: number;
  PkgPrice: number;
  Price: number;
  Privilege: number;
  Publish: number;
  PublishAge: number;
  QualityLevel: number;
  ResBitrate: number;
  ResDuration: number;
  ResFileHash: string;
  ResFileSize: number;
  SQBitrate: number;
  SQDuration: number;
  SQExtName: string;
  SQFailProcess: number;
  SQFileHash: string;
  SQFileSize: number;
  SQPayType: number;
  SQPkgPrice: number;
  SQPrice: number;
  SQPrivilege: number;
  Scid: number;
  SingerId: number[];
  SingerName: string;
  SongLabel: string;
  SongName: string;
  Source: string;
  SourceID: number;
  SuperBitrate: number;
  SuperDuration: number;
  SuperExtName: string;
  SuperFileHash: string;
  SuperFileSize: number;
  TopicRemark: string;
  TopicUrl: string;
  Type: string;
  mvTotal: string;
  [propName: string]: any;
}
