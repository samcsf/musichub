import Kugou from './provider/kugou';
import QQMusic from './provider/qq';
import Kuwo from './provider/kuwo';
import * as util from './util/format';

async function main(): Promise<void> {
  // let kg = new Kugou();
  // let list = await kg.search('出现又离开');
  // console.log(list.map(util.formatResultItem));
  // let qq = new QQMusic();
  // let list = await qq.search('出现又离开');
  // console.log(list.map(util.formatResultItem));
  let kw = new Kuwo();
  let list = await kw.search('出现又离开');
  console.log(list.map(util.formatResultItem));
}

main();
