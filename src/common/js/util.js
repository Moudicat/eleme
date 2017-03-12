/**
 * Created by Moudi on 2017/3/12.
 */
/**
 * 解析url参数
 * @example  ?id=123&a=3456
 * @return Object {id: 123, a: 3456}
 */

export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&]([^?&]+)=([^?&]+)/g;
  url.replace(reg, ($0, $1, $2) => {
    obj[$1] = $2;
  });
  return obj;
}
