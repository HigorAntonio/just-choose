import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export const fromNow = (date, withoutSuffix) => {
  return dayjs(date).fromNow(withoutSuffix);
};