import * as vm from 'vm';
import * as _ from 'lodash';
import * as util from '../../util/format';
import { SearchResultItem, SearchOption, PurchaseType } from '../../typings/search';
const request = require('request-promise-native');

const source = 'qq-music';

export default class QQMusic {
  constructor() {}

  public async search(
    songName: string,
    options: SearchOption = {}
  ): Promise<Array<SearchResultItem>> {
    let result = await request({
      method: 'GET',
      url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
      qs: {
        ct: 24,
        qqmusic_ver: 1298,
        new_json: 1,
        remoteplace: 'txt.yqq.song',
        // searchid: 58065836199668432,
        t: 0,
        aggr: 1,
        cr: 1,
        catZhida: 1,
        lossless: 0,
        flag_qc: 0,
        p: options.page || 1,
        n: options.limit || 10,
        w: songName,
        // g_tk: 1438444775,
        // loginUin: 101060053,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
      },
      json: true,
    });
    let list = _.get(result, ['data', 'song', 'list']);
    let formatList: Array<SearchResultItem> = list.map(
      (item: QQMusicSearchItem): SearchResultItem => {
        return {
          source,
          songName: item.title,
          duration: item.interval,
          purchaseType: PurchaseType.ONE_OFF,
          price: item.pay.price_track,
          albumName: item.album.title,
          singerName: item.singer.map(s => s.title).join(' '),
          playLink: `https://y.qq.com/n/yqq/song/${item.file.media_mid}.html`,
        };
      }
    );
    return formatList;
  }
}

interface QQMusicSearchItem {
    action:        Action;
    album:         Album;
    chinesesinger: number;
    desc:          string;
    desc_hilight:  string;
    docid:         string;
    file:          File;
    fnote:         number;
    genre:         number;
    grp:           any[];
    id:            number;
    index_album:   number;
    index_cd:      number;
    interval:      number;
    isonly:        number;
    ksong:         Ksong;
    language:      number;
    lyric:         string;
    lyric_hilight: string;
    mid:           string;
    mv:            Mv;
    name:          string;
    newStatus:     number;
    nt:            number;
    pay:           Pay;
    pure:          number;
    singer:        Singer[];
    status:        number;
    subtitle:      string;
    t:             number;
    tag:           number;
    time_public:   Date;
    title:         string;
    title_hilight: string;
    type:          number;
    url:           string;
    ver:           number;
    volume:        Volume;
}

interface Action {
    alert:  number;
    icons:  number;
    msg:    number;
    switch: number;
}

interface Album {
    id:            number;
    mid:           string;
    name:          string;
    subtitle:      string;
    title:         string;
    title_hilight: string;
}

interface File {
    b_30s:       number;
    e_30s:       number;
    media_mid:   string;
    size_128:    number;
    size_128mp3: number;
    size_320:    number;
    size_320mp3: number;
    size_aac:    number;
    size_ape:    number;
    size_dts:    number;
    size_flac:   number;
    size_ogg:    number;
    size_try:    number;
    strMediaMid: string;
    try_begin:   number;
    try_end:     number;
}

interface Ksong {
    id:  number;
    mid: string;
}

interface Mv {
    id:  number;
    vid: string;
}

interface Pay {
    pay_down:    number;
    pay_month:   number;
    pay_play:    number;
    pay_status:  number;
    price_album: number;
    price_track: number;
    time_free:   number;
}

interface Singer {
    id:            number;
    mid:           string;
    name:          string;
    title:         string;
    title_hilight: string;
    type:          number;
    uin:           number;
}

interface Volume {
    gain: number;
    lra:  number;
    peak: number;
}

