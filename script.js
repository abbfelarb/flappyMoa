const canvas = document.getElementById('flappymoa')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

let moa_width = canvas.height * 0.15
let moa_height = moa_width * 1
let pos = [((canvas.width / 3) - (moa_width / 2)), ((canvas.height / 2) - (moa_height / 2))]
let v = 0
let pipes = []
var moa = new Image()
moa.src = "moa.png"
var dobby = new Image()
dobby.src = "dobby.png"

let score = 0

const g = 1500
const dt = 0.03
const jump = 400
const pipe_time = 1800
const pipe_width = 98
const pipe_height = 795
const speed = 200
const gap_height = 3.0 * moa_height
const margin = moa_width * 0.1


const gameOverRect = {
    x: 30,
    y: canvas.height / 2 + (118 / 2) - 30,
    width: canvas.width - 60,
    height: 40,
  };

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        v = jump
    }
})

document.addEventListener('touchstart', event => {
    v = jump
})


function clear (ctx) {
}

function update_moa (p) {
    ctx.drawImage(moa, p[0], p[1], moa_width, moa_height)
}

function update_pos (pos) {
    let new_pos = [pos[0], pos[1] - (dt * (v - g * dt))]
    return (new_pos)
}

function check_collision (p) {
    // aabb bool
    let collision = false
    for (n = 0; n < pipes.length; n++) {
        if ((pos[0] + moa_width - margin > pipes[n][0] && pos[0] + moa_width + margin < pipes[n][0] + pipe_width) || (pos[0] - margin > pipes[n][0] && pos[0] + margin < pipes[n][0] + pipe_width)) {
            if (pos[1] + moa_height - margin > pipes[n][1] || pos[1] + margin < pipes[n][1] - gap_height) {
                collision = true
                break
            }
        }
    }

    if (p[1] < canvas.height + 2 * moa_height && !collision) {
        return (false)
    } else {
        return (true)
    }
}

function spawn_pipe () {
    let height = (1 - (Math.random() / 2)) * canvas.height
    pipes.push([canvas.width, height])
    setTimeout(spawn_pipe, pipe_time)
}

function update_pipes () {
    for (n = 0; n < pipes.length; n++) {
        // update pipe position
        pipes[n][0] -= speed * dt
        if (pipes[n][0] + pipe_width < 0) {
            pipes.splice(n, 1)
        }

        // draw pipe
        ctx.drawImage(dobby, pipes[n][0], pipes[n][1])// , pipe_width, canvas.height - pipes[n][1]

        let sy = pipe_height - (pipes[n][1] - gap_height)
        ctx.drawImage(dobby, 0, sy, pipe_width, pipe_height - sy,
            pipes[n][0], 0, pipe_width, pipe_height - sy)
    }
}


function game () {
    while (true) {
        // clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // check collision
        if (!check_collision(update_pos(pos))) {
            // update moa
            pos = update_pos(pos)
            update_moa(pos)

            v -= g * dt
            pos[1] -= dt * v

            // update pipes
            update_pipes()

        } else {
            break
        }
    }
}

function game_over () {

    let height = canvas.height / 3
    let width = height * 2

    ctx.fillStyle = "pink"
    ctx.font = "bold 70px tahoma"
    ctx.textAlign = "center"

    ctx.fillText("DU DOG :(", canvas.width / 2, canvas.height / 2 - 48)
    ctx.strokeText("DU DOG :(", canvas.width / 2, canvas.height / 2 - 48)

    ctx.font = "48px tahoma"
    ctx.fillText("poäng: " + score.toString(), canvas.width / 2, canvas.height / 2)
    ctx.strokeText("poäng: " + score.toString(), canvas.width / 2, canvas.height / 2)

    ctx.fillRect(gameOverRect.x, gameOverRect.y, gameOverRect.width, gameOverRect.height)
    ctx.fillStyle = "black"
    ctx.font = "30px tahoma"
    ctx.fillText("försök igen", canvas.width / 2, canvas.height / 2 + (118 / 2))
    canvas.addEventListener('click', function (event) {
        let mousePos = getMousePos(canvas, event)   
    
        if(isInside(mousePos, gameOverRect)) {
            location.reload()
        } 
    
    })
    document.addEventListener('touchstart', event => {
        let touchPos = getMousePos(canvas, event)
        if (isInside(touchPos, gameOverRect)) {
            location.reload()
        }
    })
    

}

spawn_pipe()
setInterval(main, 33)

function main () {

    // check collision
    if (!check_collision(update_pos(pos))) {

        // clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // update moa
        pos = update_pos(pos)
        update_moa(pos)

        v -= g * dt
        pos[1] -= dt * v

        // update pipes
        update_pipes()

    } else {

        game_over()
    }

}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
  }
