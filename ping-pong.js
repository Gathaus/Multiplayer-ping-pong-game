const canvas = document.querySelector("#pong");

const ctx = canvas.getContext('2d');

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let computerScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
computerScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

const ball = {
    x:canvas.width/2,
    y:canvas.height/2,
    radius: 15,
    velocityX: 7,
    velocityY: 7,
    speed: 10,
    color: "WHITE"
}

const user = {
    x: (canvas.width-100)/2,
    y: 0,
    width: 100,
    height: 10,
    score: 0,
    color: "WHITE"
}

const computer = {
    x: (canvas.width-100)/2,
    y: canvas.height-10,
    width: 100,
    height: 10,
    score: 0,
    color: "WHITE"
}

const line = {
    x: 0,
    y: (canvas.height-2)/2,
    height: 2,
    width: 10,
    color: "WHITE"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

function drawText(text, x, y){
    ctx.fillStyle = "#fff";
    ctx.font=  "50px arial"
    ctx.fillText(text,x,y);
}

function drawline(){
    for(let i = 0; i<= canvas.width; i+=15){
        drawRect(line.x + i, line.y, line.width, line.height, line.color);
    }
}

function drawArc(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityY = -ball.velocityY;
    ball.speed = 10;
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y+ p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.right > b.left && p.top < b.bottom && p.bottom > b.top;
}

function update(){
    if (ball.y - ball.radius<0){
        computer.score++;
        computerScore.play();
        resetBall();
    }
    else if (ball.y + ball.radius>canvas.height){
        user.score++;
        userScore.play();
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y +=ball.velocityY;

    computer.x += (ball.x - (computer.x + computer.width/2))*0.91;

        if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
            ball.velocityX = -ball.velocityX;
            wall.play();
        }
    
    let player = (ball.y + ball.radius >canvas.height/2) ? computer : user;

    if(collision(ball,player)){
        hit.play();
        
        let collidePoint = (ball.x - (player.x + player.width/2));

        collidePoint = (collidePoint / (player.width/2));

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.y + ball.radius<canvas.height/2) ? 1 : -1;
        ball.velocityY = direction * ball.speed * Math.cos(angleRad);
        ball.velocityX = ball.speed * Math.sin(angleRad);
        console.log(direction)
        ball.speed += 0.1;
    }
}
canvas.addEventListener("mousemove", getMousePosition);

function getMousePosition(e){
    let rect = canvas.getBoundingClientRect();

    user.x= e.clientX - rect.left - user.width/2;
}

function render(){
    drawRect(0,0,canvas.width, canvas.height, "#000");

    drawText(user.score,canvas.width/5,canvas.height-100);
    drawText(computer.score,canvas.width/5,4*canvas.height/5);
    drawline();
    //user1
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(computer.x,computer.y,computer.width,computer.height,computer.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color,false);
}

function game(){
    render();
    update();
}

let framePerSecond = 30;

let loop = setInterval(game,1000/framePerSecond);