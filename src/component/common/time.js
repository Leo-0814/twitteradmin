export const timeDifferent = (lastTime) => {
  const nowTime = new Date()
  const timeReduce = nowTime.getTime() - lastTime

  if (timeReduce / 1000 < 60) {
    const sec = Math.floor(timeReduce / 1000)
    return `${sec}秒前`
  } else if (timeReduce / 1000 / 60 < 60) {
    const min = Math.floor(timeReduce / 1000 / 60)
    return `${min}分鐘前`
  } else if (timeReduce / 1000 / 60 / 60 < 24) {
    const hour = Math.floor(timeReduce / 1000 / 60 / 60)
    return `${hour}小時前`
  } else {
    const day = Math.floor(timeReduce / 1000 / 60 / 60 / 24)
    return `${day}天前`
  } 
}

export const tranTime = (time) => {
  let mouthStr = ( time.$M + 1 ).toString()
  let dayStr = time.$D.toString()
  let hourStr = time.$H.toString()
  let minStr = time.$m.toString()
  let secStr = time.$s.toString()
  if (mouthStr.length === 1) {
    mouthStr = '0' + mouthStr
  }
  if (dayStr.length === 1) {
    dayStr = '0' + dayStr
  }
  if (hourStr.length === 1) {
    hourStr = '0' + hourStr
  }
  if (minStr.length === 1) {
    minStr = '0' + minStr
  }
  if (secStr.length === 1) {
    secStr = '0' + secStr
  }
  
  return( `${time.$y}-${mouthStr}-${dayStr} ${hourStr}:${minStr}:${secStr}`)
}