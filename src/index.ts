import Kugou from './kugou';
import * as util from './util/format';

async function main(): Promise<void> {
  let kg = new Kugou();
  let list = await kg.search('出现又离开');
  console.log(list.map(util.formatResultItem));
}

main();
