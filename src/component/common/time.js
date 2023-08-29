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