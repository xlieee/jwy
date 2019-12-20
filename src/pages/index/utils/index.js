
export const utilBackTo = (targetPos = 0, duration = 500) => {
  /*
   * t: current time（当前时间）
   * b: beginning value（距离的初始值）
   * c: change in value（距离的变化量）
   * d: duration（持续时间）
   */
  const Tween = {
    Linear: function (t, b, c, d) {
      return c * t / d + b
    },
    Quart: {
      easeOut: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
      }
    },
    Expo: {
      easeOut: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
      }
    }
  }
  // let targetPos = 700
  let currentPos = document.body.scrollTop || document.documentElement.scrollTop
  let diff = Math.abs(currentPos - targetPos)
  let symbol = currentPos > targetPos ? 1 : -1
  if (currentPos === 0 && symbol > 0) {
    return
  }
  let startTime = new Date()
  let nowTime
  let lastTime = 0
  let v = 0
  function step () {
    if (lastTime >= duration) {
      document.body.scrollTop = document.documentElement.scrollTop = targetPos
      return
    }
    v = Math.round(Tween.Linear(lastTime, 0, diff, duration))
    document.body.scrollTop = document.documentElement.scrollTop =  currentPos - symbol * v
    nowTime = new Date()
    lastTime += Math.max(17, nowTime - startTime)
    startTime = nowTime
    
    window.requestAnimationFrame = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60) }
    window.requestAnimationFrame(step)
  }
  step()
}
