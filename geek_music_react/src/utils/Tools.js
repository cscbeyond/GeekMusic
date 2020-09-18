function transformSecondsToMinutes(seconds) {
    let min = Math.floor((seconds / 60));
    let second = (seconds - min * 60).toFixed(0);
    if (second < 10) {
        return `${min}:0${second}`
    } else {
        return `${min}:${second}`
    }
}

function throttle(callback, time) {
    var canDo = true
    return function () {
        if (canDo) {
            canDo = false
            setTimeout(function () {
                callback && callback()
                canDo = true
            }, time || 300)
        }
    }
}

function debouce(callback, time) {
    var timer;
    return () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            console.log('debouce触发');
            callback && callback()
        }, time || 300)
    }
}
export {
    transformSecondsToMinutes,
    throttle,
    debouce
}