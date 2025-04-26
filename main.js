// とりあえず黒い画面を作りましょう
// この書き方じゃ多分，onload で呼び出せって怒られるはず
width = 300
height = 300
canvas = document.getElementById("canvas")
ctx = canvas.getContext('2d')

const init = () => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0,width,height)
}

