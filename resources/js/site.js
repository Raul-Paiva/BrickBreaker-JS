var game_container = document.getElementById("game-container");
var ball = document.getElementById("ball");
var ballSpeedX = 2;
var ballSpeedY = 2;
var paddle = document.getElementById("paddle");
var eletricEffect;
var ballMovement;

window.onload = function() {
    setBackgroundStars(document.body);

    // depois de 5 segundos, por o jogo a jogar sozinho ou com uma animacao relacionada enquanto ninguem esta a jogar
};

function startGame() {
    document.getElementById("menu-content").style.display = "none";
    document.getElementById("header").style.visibility = "visible";
    document.getElementById("left-panel").style.visibility = "visible";
    document.getElementById("countdown").style.display = "block";

    gameStartPositions();

    var count = 2;
    var countdown = setInterval(function(){
        document.getElementById("countdown").src=`resources/imgs/countdown/${count}.png`;
        var beep = document.getElementById("countdown-beep");
        beep.currentTime = 0;
        beep.play();
        count--;
    }, 1000);

    setTimeout(function(){
        clearInterval(countdown);
        document.getElementById("countdown").style.display = "none";
        document.getElementById("menu").classList.add("hidden");

        enableGameControls();
        startBallMotion();
    }, 3500);
}

function returnToMenu() {//revisar---------------------------------------------
    stopAnimation();
    clearInterval(ballMovement);
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("header").style.visibility = "hidden";
    document.getElementById("left-panel").style.visibility = "hidden";
    document.getElementById("menu-content").style.display = "flex";
    ball.style.display = "none";
    paddle.style.display = "none";
}

function gameStartPositions() {
    // definir as posicoes iniciais dos blocos, barra e bola

    //Activate ball and paddle\\
    ball.style.display = "inline";
    paddle.style.display = "inline";

    //Set default position for the ball\\
    ball.style.left = (game_container.clientWidth / 2) - (ball.clientWidth/2) + "px";
    var rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize); // px per rem
    ball.style.top = (31*rootFontSize - paddle.clientHeight/2) + "px";

    //Set default position for the paddle\\
    paddle.style.left = (game_container.clientWidth / 2) - (paddle.clientWidth/2) + "px";

    startAnimation(50,52);
}

function startAnimation(startN, endN) {
    var count = startN;
    eletricEffect = setInterval(function(){
        document.getElementById("paddle").src=`resources/imgs/breakout_tile_set_1/png/${count}-Breakout-Tiles.png`;
        count++;
        if (count == endN+1) count = startN;
    }, 50);
}
function stopAnimation(){clearInterval(eletricEffect);}

function movePaddle(deltaX) {
    var newLeft = paddle.offsetLeft + deltaX;
    var containerWidth = game_container.clientWidth;
    var paddleWidth = paddle.clientWidth;
    
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft + paddleWidth > containerWidth) {
        newLeft = containerWidth - paddleWidth;
    }

    paddle.style.left = newLeft + "px";
}

function enableGameControls() {
    document.addEventListener("keydown", function(event) {
        if(event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
            movePaddle(-20);
        }
        else if(event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
            movePaddle(20);
        }
    });
}

function startBallMotion() {
    var angle;
    do {angle = Math.random() * Math.PI / 2 + Math.PI / 4;} while(angle==Math.PI/2); // Angle between 45 and 135 degrees
    var lastCoordX = ball.offsetLeft;
    var lastCoordY = ball.offsetTop;
    ballMovement = setInterval(function() {
        var newLeft;
        var newTop;
        if(ball.offsetTop>=game_container.clientHeight-20){
            //returnToMenu();//substituir por gameover screen -------------------------------
            //ball.offsetTop>=game_container.clientHeight-20 || ball.offsetLeft>=game_container.clientWidth-20
        }
        //else{
            var hittenSide = colisionsDetection(lastCoordX, lastCoordY, angle);
            if(hittenSide!=""){
                angle = calcNewAngle(lastCoordX, lastCoordY, hittenSide);
                lastCoordX = ball.offsetLeft;
                lastCoordY = ball.offsetTop;
            }
            
        //}

        if(angle < Math.PI && angle > Math.PI/2) {
            newLeft = ball.offsetLeft - ballSpeedX * Math.cos(Math.PI - angle);
            newTop = ball.offsetTop - ballSpeedY * Math.sin(Math.PI - angle);
        }else if(angle > 0 && angle < Math.PI/2){
            newLeft = ball.offsetLeft + ballSpeedX * Math.cos(angle);
            newTop = ball.offsetTop - ballSpeedY * Math.sin(angle);
        }else if(angle > Math.PI && angle < 3*Math.PI/2){
            newLeft = ball.offsetLeft - ballSpeedX * Math.cos(angle - Math.PI);
            newTop = ball.offsetTop + ballSpeedY * Math.sin(angle - Math.PI);
        }else{
            newLeft = ball.offsetLeft + ballSpeedX * Math.cos(2*Math.PI - angle);
            newTop = ball.offsetTop + ballSpeedY * Math.sin(2*Math.PI - angle);
        }
        
        ball.style.left = newLeft + "px";
        ball.style.top = newTop + "px";      
    }, 10);
}

/**
 * Checks if the ball collided and, if so, on which side.
 * @returns "t" for top, "b" for bottom, "r" for right, "l" for left and "" for nothing hitten
 */
function colisionsDetection(startCoordX, startCoordY, angle){
    var hittenCoordX = ball.offsetLeft;
    var hittenCoordY = ball.offsetTop;

    //Game-Container Colisions
    if(hittenCoordY<=0)return "t";
    else if(hittenCoordX<=0)return "l";
    else if(hittenCoordX>=game_container.clientWidth-20)return "r";
    //if(hittenCoordY>=game_container.clientHeight-20)return "b";

    //Paddle Colisons
    var paddleCoordX = paddle.offsetLeft;
    var paddleCoordY = paddle.offsetTop;

    if((paddleCoordY+paddle.clientHeight)>=hittenCoordY && (paddleCoordY-ball.clientHeight)<=hittenCoordY && (paddleCoordX<hittenCoordX) && (hittenCoordX<(paddleCoordX+paddle.clientWidth))){

        console.log("Colided with paddle");
        if(true){//se bater por baixo devia  ir para baixo
            return "b";
        }else{ //if(){//sinal deve estar errado
            return "t";
        }
    }

    return "";

    var hip=Math.sqrt(Math.pow(Math.abs(startCoordX-hittenCoordX),2) + Math.pow(Math.abs(hittenCoordY-startCoordY),2));
    var co = Math.abs(hittenCoordY-startCoordY);
    var rawAngle=Math.asin(co/hip);
}

/**
 * Calculates the angle at which the ball collides with a side.
 * @returns The calculated angle
 */
function calcNewAngle(startCoordX, startCoordY, hittenSide){
    var angle;
    var hittenCoordX = ball.offsetLeft;
    var hittenCoordY = ball.offsetTop;
    
    if(hittenSide=="t" || hittenSide=="b"){//top or bottom
        var hip=Math.sqrt(Math.pow(Math.abs(startCoordX-hittenCoordX),2) + Math.pow(Math.abs(hittenCoordY-startCoordY),2));
        var co = Math.abs(hittenCoordY-startCoordY);
        var rawAngle=Math.asin(co/hip);

        if(hittenSide=="t"){//top
            if(Math.abs(startCoordX-hittenCoordX)<10){
                angle=Math.random()>0.5?((3*Math.PI/2)-(Math.random()/2)):((3*Math.PI/2)+(Math.random()/2));//verificar em todos
            }
            else if(startCoordX>hittenCoordX){
                angle=Math.PI + rawAngle;
            }else{
                angle=(2*Math.PI)-rawAngle;
            }
        }else{//bottom
            if(Math.abs(startCoordX-hittenCoordX)<10){
                angle=Math.random()>0.5?((Math.PI/2)-(Math.random()/4)):((Math.PI/2)+(Math.random()/4));//verificar em todos
            }
            else if(startCoordX>hittenCoordX){
                angle=(Math.PI)-rawAngle;
            }else{
                angle=rawAngle;
            }
        }
        
    }else{//right or left
        var hip=Math.sqrt(Math.pow(Math.abs(hittenCoordX-startCoordX),2) + Math.pow(Math.abs(startCoordY-hittenCoordY),2));
        var co = Math.abs(hittenCoordX-startCoordX);
        var rawAngle=Math.asin(co/hip);

        if(hittenSide=="r"){//right
            if(Math.abs(startCoordY-hittenCoordY)<10){
                angle=Math.random()>0.5?(Math.PI-(Math.random()/4)):(Math.PI+(Math.random()/4));//verificar em todos
            }
            else if(startCoordY>hittenCoordY){
                angle=Math.PI/2 + rawAngle;
            }else{
                angle=((3*Math.PI)/2)-rawAngle;
            }
        }else{//left
            if(Math.abs(startCoordY-hittenCoordY)<10){
                angle=Math.random()>0.5?(Math.random()/4):((2*Math.PI)-(Math.random()/4));//verificar em todos
            }
            else if(startCoordY>hittenCoordY){
                angle=Math.PI/2 - rawAngle;
            }else{
                angle=((3*Math.PI)/2)+rawAngle;
            }
        }
    }   
    return angle;
}

/**
 * Creates a black SVG image with white dots to mimic a starry background.
 */
function setBackgroundStars(element) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color: black;">';
    for (let i = 0; i < Math.floor((Math.random() * 700) + 300); i++) {
        svg += `<circle cx="${Math.random() * 100}%" cy="${Math.random() * 100}%" r="${(Math.random() * 2) + 1}" fill="white" opacity="${(Math.random() * 0.5) + 0.2}"/>`;
    }
    svg += '</svg>';
    var encoded = encodeURIComponent(svg);
    element.style.backgroundImage = `url('data:image/svg+xml,${encoded}')`;
}