/**
 * 用于格式化货币
 * @author liph
 * @param data 货币值
 * @param symbol 货币前缀（符号）
 * @param thousand
 * @param decimal
 * @returns {string}
 */
export function currencyFormat(data, symbol, thousand, places) {
  if (isNaN(data)) {
    return '--'
  }
  if (isNaN(places)) {
    places = 2
  } else if (places < 2) {
    places = 2
  } else if (places > 4) {
    places = 4
  }
  symbol = symbol !== undefined ? symbol : ''
  thousand = thousand !== undefined ? thousand : ','
  var decimal = '.'
  var number = data
  var negative = number < 0 ? '-' : ''
  var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
  var j = (j = i.length) > 3 ? j % 3 : 0
  return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
}
