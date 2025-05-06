const prefInfoMap = {}
// 変数名にデータ構造を入れておくことによって，後からわかりやすい！！
const prefNamesList = []

let svg = null
// main.js を保存しないまま進めると，console.log で main.js 404 が出てくるので注意（当たり前）

let inputResolve = (pref) => {
    return pref
}

const init = () => {
    svg = document.getElementsByTagName('svg')[0]
    const groups = document.getElementsByTagName('g')

    console.log(svg);
    console.log(groups);

    const svgRect = svg.getBoundingClientRect()
    console.log(svgRect);

    for (const group of groups) {
        if (!group.id || group.id === 'Hopporyodo') {
            continue
        }
        const rect = group.getBoundingClientRect()
        const left = rect.left - svgRect.left
        const top = rect.top - svgRect.top
        const info = { left, top, width: rect.width, height: rect.height, element: group }

        const input = document.createElement('input')
        input.type = 'button'
        input.value = group.id
        // この辺の，ブラウザの環境依存っぽいデザインを，全てのブラウザでいい感じに揃える方法はあるんだろうか
        // まあそもそも将来はブラウザなんてものの存在がなくなるような気がしなくもないんだが
        input.style.borderRadius = '5px'
        input.style.margin = '.1em .1em .1em 0'
        input.style.backgroundColor = ' #fff'
        input.style.borderColor = ' #aaa'

        input.onclick = (e) => {
            inputResolve(group.id)
        }

        document.getElementById('inputArea').appendChild(input)

        // prefectureInfo.push(info)  これだと後から参照しづらい
        prefInfoMap[group.id] = info
        prefNamesList.push(group.id)
    }
    console.log(prefNamesList);
    // ここから何をすればいいかわからない
    // 愛知県だけを表示したいので，それ以外を消せばいいのだが
    // 同時に大きさとかもとっていきたいという話
}

const showPref = (id, angle) => {
    for (const name of prefNamesList) {
        prefInfoMap[name].element.style.opacity = 0
        prefInfoMap[name].element.style.transition = `none`
    }
    console.log(id);

    //prefInfoMap[id] = {top:0, left:0, height:300, width:300, element:prefInfoMap[id]}
    // これだと愛知県は動いてくれなかった・・・，translate を使うのがいいらしい？（なぜ動かないかはわからない）
    const { left, top, width, height, element } = prefInfoMap[id]
    element.style.opacity = 1
    element.parentElement.style.transform = `translate(${-left}px, ${-top}px)`
    console.log(left, top);

    // なぜこの viewBox をいじると表示がデカくなるのかがわからない
    svg.setAttribute("viewBox", `0,0,${width},${height}`)
    svg.setAttribute("width", '300')
    svg.setAttribute("height", '300')
    // ここに translate だっけ？を突っ込めば，アニメーションみたいなのをつけられるんだろう
    // で，transform の指定方法は，translate, scale, rotate の三銃士であることを覚えておこう
    // これを覚えておけば，レーシングゲームももう少しわかってくる雰囲気がある（あれは 3D とか指定してたっけ？？）
    // また答え表示の時にいじるだろうので，その時に学ぼう

    svg.style.transition = `none`
    svg.style.transform = `scale(0.8) rotate(${angle}deg)`
}

const game = async () => {
    //let message = null こんなもん書かなくても，html に指定してそこから DOM をとってこい
    const message = document.getElementById('message')
    while (true) {
        const angle = Math.random() * 360 - 180
        // これで 47個本当に出てくるのか？って思ったけど，0~46 なのでちょうど出てくるはずだよね
        // 流石に沖縄が出てくるまでデバッグする根性はないな
        const pref = prefNamesList[Math.trunc(Math.random() * prefNamesList.length)]
        showPref(pref, angle)
        // ここの書き方がマジでわからん，というか Promise がわかってない
        // Promise に拒否反応を持ち過ぎていますね, 別言語でもやってみろ
        // t-kihira と同じようにやると，inputResolve is not function が出る，まあ当たり前といえばそうな気がするが
        const answer = await new Promise(resolve => {
            inputResolve = resolve
        })
        console.log(answer, pref);
        if (answer === pref) {
            //message = "正解！"
            message.textContent = '正解！なかなかやるやん！'
        } else {
            //message = ``
            message.textContent = `不正解！ ${answer}ではなくて，${pref}でした！`
        }
        for (const prefName of prefNamesList) {
            prefInfoMap[prefName].element.style.transition = 'all 2s ease-out'
            prefInfoMap[prefName].element.style.opacity = 1
        }
        svg.style.transition = 'all 2s ease-out'
        svg.style.transform = 'scale(0.3) rotate(0)'

        await new Promise(r => setTimeout(r, 2000))
        await new Promise(r => setTimeout(r, 2000))
        message.textContent = ``
    }
}


window.onload = () => {
    init()
    // ここに while を入れると重くなって落ちた（なんでや）
    game()
}
