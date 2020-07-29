
export function fuzzyMatch(search, text) {
  var hlen = text.length;
  var nlen = search.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return search === text;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = search.charCodeAt(i);
    while (j < hlen) {
      if (text.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
