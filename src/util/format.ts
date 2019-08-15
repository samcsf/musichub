import { SearchResultItem } from '../typings/search';

export function formatPrice(price: number): string {
  return `${(price / 100).toFixed(2)}元`;
}

export function formatDuration(duration: number): string {
  let min = Math.floor(duration / 60);
  let sec = duration - min * 60;
  return `${min}:${sec.toFixed(2)}`;
}

export function formatResultItem(item: SearchResultItem): object {
  return {
    source: item.source,
    songName: item.songName,
    duration: formatDuration(item.duration),
    price: formatPrice(item.price),
    albumName: item.albumName,
    singerName: item.singerName,
    playLink: item.playLink,
  };
}
