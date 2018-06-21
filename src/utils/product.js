// 格式化element ui 获得的日期为yyyy-mm-dd
export function formatDate(paramDate) {
  const year = paramDate.getFullYear()
  const month = paramDate.getMonth() + 1
  const date = paramDate.getDate()
  return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (date >= 10 ? date : '0' + date)
}
// 格式化键值下拉数据
export function formatDropDownData(list, id, name) {
  const arr = []
  list.forEach(ele => {
    arr.push({
      value: ele[id],
      label: ele[name]
    })
  })
  return arr
}
// 格式化数组形式的下拉
export function formatDropdownArr(list) {
  const arr = []
  list.forEach(ele => {
    arr.push({
      value: ele[0],
      label: ele[1]
    })
  })
  return arr
}
// 分割数组
export function splitArr(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function debounce(key, delay) {
  var timer = null
  return function() {
    var context = this
    clearTimeout(timer)
    timer = setTimeout(function() {
      context[key]()
    }, delay)
  }
}

