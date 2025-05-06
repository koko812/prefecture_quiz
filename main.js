const prefInfoMap = {}
const prefNames = []

let svg = null
// main.js を保存しないまま進めると，console.log で main.js 404 が出てくるので注意（当たり前）
const init = () => {
    svg = document.getElementsByTagName('svg')[0]
    const groups = document.getElementsByTagName('g')

    console.log(svg);
    console.log(groups);

    const svgRect = svg.getBoundingClientRect()
    console.log(svgRect);

    for (const group of groups) {
        if(!group.id || group.id === 'Hopporyodo'){
            continue
        }
        const rect = group.getBoundingClientRect()
        const left = rect.left - svgRect.left
        const top = rect.top - svgRect.top
        const info = { left, top, width: rect.width, height: rect.height, element: group }

        // prefectureInfo.push(info)  これだと後から参照しづらい
        prefInfoMap[group.id] = info
        prefNames.push(group.id)
    }
    console.log(prefNames);
    // ここから何をすればいいかわからない
    // 愛知県だけを表示したいので，それ以外を消せばいいのだが
    // 同時に大きさとかもとっていきたいという話
}

const showPref = (id) => {
    for (const name of prefNames) {
        prefInfoMap[name].element.style.opacity = 0
    }
    console.log(id);

    //prefInfoMap[id] = {top:0, left:0, height:300, width:300, element:prefInfoMap[id]}
    // これだと愛知県は動いてくれなかった・・・，translate を使うのがいいらしい？（なぜ動かないかはわからない）
    const {left, top, width, height, element} = prefInfoMap[id]
    element.style.opacity = 1
    element.style.transform = `translate(${-left}px, ${-top}px)`
    console.log(left, top);

    // なぜこの viewBox をいじると表示がデカくなるのかがわからない
    svg.setAttribute("viewBox", `0,0,${width},${height}`)
    svg.setAttribute("width", '300')
    svg.setAttribute("height",'300')
}


window.onload = () => {
    init()
    showPref('Aichi')
}