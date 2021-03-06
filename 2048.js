const e = (sel) => document.querySelector(sel)

const es = (sel) => document.querySelectorAll(sel)

const arrayFormatByTds = function(table) {
    /*
        传入一个 table 标签，将 table 里 的 tds > span 生成一个 二维数组
    */
    var tds = es(table+' td > span')
    var trs = es(table+' tr')
    // console.log(tds, trs);
    var t = t2048.arrayInit(trs.length)
    for (var i = 0; i < trs.length; i++) {
        for (var j = 0; j < trs[i].children.length; j++) {
            t[i][j] = tds[i * trs.length + j]
        }
    }
    return t
}

const changeSingleView = function(td, value) {
    /*
        改变单个单元格 td 的 view
    */
    td.setAttribute('class', '')
    if (value != 0) {
        var className = 't' + value
        td.classList.add(className)
        td.innerHTML = value
    } else {
        td.innerHTML = ''
    }
}

const changeViewByArray = function(table, array) {
    /*
        table 是 包括 tds 的二维素组
        将 View 的 value 变成 array 中的值
    */
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            var value = array[i][j]
            var td = table[i][j]
            changeSingleView(td, value)
        }
    }
}

const showisSuccess = function(status) {
    // console.log('vix', status);
    if(status.false) {
        // console.log('game false');
        e('.false-eff').classList.remove('none')
        e('.false-eff').classList.add('warning')
        setTimeout.call(this, function(){
            e('.false-eff').classList.remove('warning')
        }, 400)
    }
    if(status.success) {
        e('.success-eff').classList.remove('none')
        e('.success-eff').classList.add('warning')
        setTimeout.call(this, function(){
            e('.success-eff').classList.remove('warning')
        }, 400)
    }
}

const showScore = function(score) {
    e('#id-score-now').innerHTML = score.now
    var nowMax = e('#id-score-max').innerHTML
    // if (score.now > nowMax) {
    //     e('#id-score-max').innerHTML = score.max
    // }
    e('#id-score-max').innerHTML = score.max

}

const showView = function(TZFE) {
    /*
        把 array 二维数组 和 分数 和 成功/失败 渲染成页面
    */
    var a = TZFE.copyArray(TZFE.value)
    var table = arrayFormatByTds('table')
    changeViewByArray(table, a)
    showScore(TZFE.score)
    showisSuccess(TZFE.status)
}

const showNew = function(i, j) {
    // console.log('new one', i, j);
    var t = arrayFormatByTds('table')
    // t[i][j].classList.remove('new-one')
    t[i][j].classList.add('new-one')
    setTimeout.call(this, function(){
        t[i][j].classList.remove('new-one')
    }, 500)
}

const leftActionToView = function() {
    /*
        向左滑动时视图的变化,并返回新元素的坐标
    */
    var r = t2048.handleLeftArray(t2048.value)
    t2048.value = r.value
    showView(t2048)
    // console.log(value2048);
    return r
}

const rightActionToView = function() {
    /*
        向右滑动时视图的变化,并返回新元素的坐标
    */
    var r = t2048.handleRightArray(t2048.value)
    t2048.value = r.value
    showView(t2048)
    // console.log(value2048);
    return r
}

const upActionToView = function() {
    /*
        向上滑动时视图的变化,并返回新元素的坐标
    */
    var r = t2048.handleUpArray(t2048.value)
    t2048.value = r.value
    showView(t2048)
    // console.log(value2048);
    return r
}

const downActionToView = function() {
    /*
        向下滑动时视图的变化,并返回新元素的坐标
    */
    var r = t2048.handleDownArray(t2048.value)
    // console.log(r);
    t2048.value = r.value
    showView(t2048)
    // console.log(value2048);
    return r
}

const resetData = function(length) {
    var max = t2048.score.max
    t2048 = new TZFE(length)
    t2048.score.max = max
    t2048.value = false
    save2048(t2048)
}

const save2048 = function(TZFE) {
    var t = {
        score: TZFE.score,
        status: TZFE.status,
        value: TZFE.value,
        length: TZFE.length,
    }
    var data = JSON.stringify(t)
    localStorage.t2048 = data
}

const load2048 = function(TZFE) {
    var t = localStorage.t2048
    if (t) {
        data = JSON.parse(t)
        TZFE.score = data.score
        TZFE.status = data.status
        TZFE.value = data.value
        TZFE.length = data.length
        return true
    } else {
        console.log('无储存数据');
        return false
    }
}

const init2048 = function(TZFE) {
    // console.log(TZFE);
    var flat = false
    if (!load2048(TZFE) || !TZFE.value) {
        flat = true
        var n = TZFE.init2048Array(TZFE.length)
        TZFE.value = n.initArray
    }
    // console.log(TZFE);
    showView(TZFE)
    if (flat) {
        showNew(n.f.i, n.f.j)
        showNew(n.s.i, n.s.j)
    }
}

const angleBySlide = function(dx, dy) {
    return Math.atan2(dy,dx) * 180 / Math.PI
}

const judgeDirection = function(sX, sY, eX, eY) {
    /*
        根据坐标判断 方向
        return: false 为判断不出
                'up' 为上
                'down'
                'right'
                'left'
    */
    var dx = eX - sX
    var dy = sY - eY
    var angle = angleBySlide(dx, dy);
    // 滑动距离太短 的情况
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        return false
    } else if (angle >= -45 && angle < 45) {
        return 'right'
    } else if (angle >= 45 && angle < 135) {
        return 'up'
    }else if (angle >= -135 && angle < -45) {
        return 'down'
    }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        return 'left'
    }
}

const bindSlideEvent = function() {
    var startX, startY

    e('table').addEventListener('touchstart', function(event){
        // console.log('touchstart', event);
        startX = event.touches[0].pageX
        startY = event.touches[0].pageY
    })

    e('.t2048-main').addEventListener('touchmove', function(event){
        // console.log('touchmove', event);
        // var endX = event.changedTouches[0].pageX;
        // var endY = event.changedTouches[0].pageY;
        event.preventDefault()
    })

    e('table').addEventListener('touchend', function(event){
        // console.log('touchend', event);
        var endX = event.changedTouches[0].pageX;
        var endY = event.changedTouches[0].pageY;

        var dire = judgeDirection(startX, startY, endX, endY)
        if (dire == 'up') {
            var r = upActionToView()
        } else if (dire == 'down') {
            var r = downActionToView()
        } else if (dire == 'left') {
            var r = leftActionToView()
        } else if (dire == 'right') {
            var r = rightActionToView()
        } else if (!dire) {
            return false
        }
        if (r.i !== false) {
            // 给 新增加的元素 添加 放大 的动画
            save2048(t2048)
            showNew(r.i, r.j)
        }
    })
}

const newGame = function(length) {
    // value2048 = arrayInit(4)
    // score.now = 0
    // statusSuc.success = false
    // statusSuc.false = false
    resetData(length)
    e('.false-eff').classList.add('none')
    e('.success-eff').classList.add('none')
    init2048(t2048)
}

const bindNewGame = function() {
    e('.new-game').addEventListener('touchend', function(event){
        newGame(t2048.length)
    })
}

const bindEvents = function() {
    bindSlideEvent()

    bindNewGame()
}

var t2048 = new TZFE(4)

const __main2048 = function() {
    init2048(t2048)

    bindEvents()
}
