const prefectureInfo = {}
const prefectureNames = []

// main.js を保存しないまま進めると，console.log で main.js 404 が出てくるので注意（当たり前）
const init = () => {
    const svg = document.getElementsByTagName('svg')
    const groups = document.getElementsByTagName('g')

    console.log(svg);
    console.log(groups);

    for (const group of groups) {
        prefectureNames.push(group.id)
    }
    console.log(prefectureNames);
    // ここから何をすればいいかわからない
    // 愛知県だけを表示したいので，それ以外を消せばいいのだが
    // 同時に大きさとかもとっていきたいという話
}

window.onload = () => {
    init()
}