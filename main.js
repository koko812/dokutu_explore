// とりあえず黒い画面を作りましょう
// この書き方じゃ多分，onload で呼び出せって怒られるはず
width = 300
height = 300
canvas = null
ctx = null

playerX = width / 5;
playerY = height / 2;
playerV = 0
playerA = 0

playerScore = 0
score = null

wallSpace = height/2
wallTop = wallSpace/2
wallMove = 20

const render = () => {
    ctx.drawImage(canvas, -1, 0)

    const currentPixel = ctx.getImageData(playerX, playerY, 1, 1).data
    // ここの判定方法がちょっと本家と違う
    // やや判定が緩いので，改善の余地がある
    // 今思ったんだが，描画の位置を，黄色の四角形分ずらしてないから，うまくいかない説はある
    // まあやる気が出たらそこを改善してみよう，すぐできるはずではある（じゃあ今やれよ）
    if(currentPixel[2] !== 0){
        console.log(currentPixel);
        return false
    }
    // canvas と ctx を間違えて動かなかった（一敗）
    ctx.fillStyle = '#ff0'
    ctx.fillRect(playerX, playerY, 3, 3)

    ctx.fillStyle = '#fff'
    ctx.fillRect(width-1, 0, 1, height)

    ctx.fillStyle = '#000'
    ctx.fillRect(width-1, wallTop, 1, wallSpace)

    score.textContent = `score: ${playerScore}`

    playerScore++;
    if (playerY < 0 || playerY > height) {
        return false 
    }
    return true

}

const init = () => {
    canvas = document.createElement('canvas')
    // canvas の width や height は css タグではないことに注意
    // すなわち，canvas.style とかでは指定できないということ
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    document.onpointerdown = (e) => {
        e.preventDefault();
        playerA = -1
    }
    document.onpointerup = (e) => {
        e.preventDefault();
        playerA = +1
    }
    document.ondblclick = (e) => {
        e.preventDefault();
    }

    score = document.createElement('div')
    document.body.appendChild(score)
}

const gameover = async () => {
    ctx.strokeStyle = '#f00'
    for (let i = 0; i < width / 5; i++) {
        ctx.beginPath()
        ctx.arc(playerX, playerY, i, 0, 2 * Math.PI)
        ctx.stroke()
        await new Promise(r => setTimeout(r, 16))
    }
}

window.onload = async () => {
    init()
    while (true) {
        await new Promise(r => setTimeout(r, 16))
        if (!render()) {
            gameover()
            console.log('gameover') 
            return;
        };
        // 本来はrequestAnimationFrame を使うべきだが，frame の数が環境依存になり，
        // そのコードを書くのが面倒だとのこと

        // ここが，v と y であることに気づかず，v を変えるだけで，勝手に y が連動すると思ってた
        // playerV が元から用意されているプロパティと思って検索してしまった（一敗）
        playerV += playerA / 10;
        playerY += playerV;

        if(wallTop < 0){
            wallTop = 0;
        }else if(wallTop+wallSpace> height){
            wallTop= height - wallSpace
        }

        wallSpace = height/2 - playerScore/10
        wallTop += wallMove * (Math.random()-0.5)
    }
}