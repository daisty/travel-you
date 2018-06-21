export function c(value) {
  return value === undefined ? '' : (value + '')
}

export function isPrice(str) {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(str)
}

/**
 * 校验正整数
 * @param str
 * @returns {boolean}
 */
export function isPInteger(str) {
  return /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(str)
}

/**
 * 匹配指定正则
 * @param pattern
 * @param str
 */
export function isMatche(pattern, str) {
  return pattern.test(str)
}
export function strIsNull(str) {
  return str + ''.replace(/\s/g, '').length === 0
}
export function strIsPhone(str) {
  return /^1[34578]\d{9}$/.test(str)
}
export function strIsEmail(str) {
  return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(str)
}
export function matchRes(resArr, value) {
  for (let i = 0; i < resArr.length; i++) {
    if (resArr[i].value === value) {
      return resArr[i].label
    }
  }
}
export function dealRes(resArr, ovale, olabel) {
  const arr = []
  if (resArr instanceof Array) {
    for (let i = 0; i < resArr.length; i++) {
      const ele = {
        value: resArr[i][ovale] + '',
        label: resArr[i][olabel]
      }
      arr.push(ele)
    }
  }
  return arr
}
// 返回几天前后  如dayAgoFn(-4)4天前    dayAgoFn(4)4天后       dayAgoFn(20) 20天后
export function dayAgoFn(day) {
  var dd = new Date()
  dd.setDate(dd.getDate() + day)// 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1// 获取当前月份的日期
  var d = dd.getDate()
  return y + '-' + m + '-' + d + ' 00:00:00'
}
// 返回 2015-10-10 10:10:1
export function dateFormat(time) {
  //  时间戳格式化
  var datetime = new Date(time)
  var format = datetime.getFullYear()
  format += '-'
  format += (datetime.getMonth() + 1 < 10) ? ('0' + (datetime.getMonth() + 1)) : (datetime.getMonth() + 1)
  format += '-'
  format += (datetime.getDate() < 10) ? ('0' + datetime.getDate()) : datetime.getDate()
  format += ' '
  format += (datetime.getHours() < 10) ? ('0' + datetime.getHours()) : datetime.getHours()// X < 10 ? 0X : X
  format += ':'
  format += (datetime.getMinutes() < 10) ? ('0' + datetime.getMinutes()) : datetime.getMinutes()
  format += ':'
  format += (datetime.getSeconds() < 10) ? ('0' + datetime.getSeconds()) : datetime.getSeconds()
  return format
}
// 返回 2015-10-10
export function dateFormatShort(time) {
  //  时间戳格式化
  var datetime = new Date(time)
  var format = datetime.getFullYear()
  format += '-'
  format += (datetime.getMonth() + 1 < 10) ? ('0' + (datetime.getMonth() + 1)) : (datetime.getMonth() + 1)
  format += '-'
  format += (datetime.getDate() < 10) ? ('0' + datetime.getDate()) : datetime.getDate()
  return format
}
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
export function _clone(o) {
  var type = o === null ? null : o.constructor
  var res = null
  if (type === Array || type === Object) {
    if (type === Array) {
      res = []
      for (var i = 0; i < o.length; i++) {
        res[i] = _clone(o[i])
      }
    } else {
      res = {}
      for (const i in o) {
        res[i] = _clone(o[i])
      }
    }
  } else {
    res = o
  }
  return res
}

/* 延迟执行 */
export function debounce(func, wait) {
  var timeout
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      func.call(context, args)
    }, wait)
  }
}

/**
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：6位地区编码
 * yymmdd: 出生年(两位年)月日，如：910215
 * xx: 顺序编码，系统产生，无法确定
 * p: 性别，奇数为男，偶数为女
 *
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：6位地区编码
 * yyyymmdd: 出生年(四位年)月日，如：19910215
 * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 *
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 * return 返回值为空则校验通过，否则返回值为错误原因
 */
export function validateIdCard(idCard) {
  // 先校验长度，友好提示
  if (!idCard || idCard.length !== 18 && idCard.length !== 15) {
    return '请输入18或15位身份证号'
  }

  // 15位和18位身份证号码的正则表达式
  const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

  // 如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regIdCard.test(idCard)) {
    // 将15位号码转18位
    if (idCard.length === 15) {
      idCard = transIDCard15to18(idCard)
    }
    const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
    const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
    let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和

    for (let i = 0; i < 17; i++) {
      idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
    }
    var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
    var idCardLast = idCard.substring(17) // 得到最后一位身份证号码

    // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
    if (idCardMod === 2) {
      if (idCardLast === 'X' || idCardLast === 'x') {
        console.log('通过验证')
        return ''
      } else {
        console.log('身份证号码有误')
        return '身份证号码有误'
      }
    } else {
      // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
      if (idCardLast === idCardY[idCardMod]) {
        console.log('通过验证')
        return ''
      } else {
        console.log('身份证号码错误')
        return false
      }
    }
  } else {
    console.log('身份证格式不正确')
    return '身份证格式不正确'
  }
}

/**
 * 将15位身份证转18位
 * @param newCardId
 * @returns {string}
 */
function transCardLastNo(newCardId) {
  const ch = newCardId.toArray()
  let m = 0
  const co = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const verCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  for (let i = 0; i < newCardId.length; i++) {
    m += ch[i] * co[i]
  }
  const residue = m % 11
  return verCode[residue]
}

/**
 * 将15位身份证转18位
 * @param newCardId
 * @returns {string}
 */
function transIDCard15to18(idCardNO) {
  const idCardNOArr = idCardNO.toArray()
  idCardNOArr.splice(6, 0, '19') // 在索引6处插入19
  let cardNo = idCardNOArr.toString()
  cardNo += transCardLastNo(cardNo)
  return cardNo
}

