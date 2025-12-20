var game_container = document.getElementById("game-container");
var rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize); // px per rem
var score = 0;
var scoreMultiplier = 1;
var lives = 3;
//Ball
const ball = document.getElementById("ball");
var ballSpeedX = 3;
var ballSpeedY = 3;
//Paddle
var paddle = document.getElementById("paddle");
var paddleSpeed = 20;
//Bricks
var bricksMat=[];
var brickWidth = document.getElementById("brickExample").clientWidth;
var brickHeight = document.getElementById("brickExample").clientHeight;
var brickRows=5;
var brickColumns = 7;
var bricksGap = 0.25;//in rem units
var bricksGridTopGap = 2;//in rem units
document.getElementById("brickExample").style.display = "none";
//Time Intervals
var eletricEffect;
var ballMovement;
//Musics
var isMenuMuted = true; 
var menuMusicInterval;
var gameoverThemeMusics=['GameOver-Music/Theme1_byCleytonKauffman/No_Hope.mp3','GameOver-Music/Theme1_byCleytonKauffman/Retro_No_hope.mp3'];
var gameThemeMusic=['Theme-Music/Theme2_byTechnodono/breakout.mp3','Theme-Music/Theme3_byMopz/ctr_ingame.mp3','Theme-Music/Theme3_byMopz/ctr_title.mp3','Theme-Music/Theme4_bySpringSpring/night night.mp3'];
var menuThemeMusics=['Theme-Music/Theme1_byJan125/1.mp3','Theme-Music/Theme1_byJan125/2.mp3','Theme-Music/Theme1_byJan125/3.mp3','Theme-Music/Theme1_byJan125/4.mp3','Theme-Music/Theme1_byJan125/5.mp3','Theme-Music/Theme1_byJan125/6.mp3'];

window.onload = function() {
    setBackgroundStars(document.body);

    menuMusicInterval = setInterval(() => {
        if(!isMenuMuted){
        const musicPlaying = document.getElementById("generalAudio");
        musicPlaying.src = 'resources/sounds/'+menuThemeMusics[Math.round(Math.random()*(menuThemeMusics.length-1))];
        musicPlaying.loop=true;
        musicPlaying.volume=0.2;
        musicPlaying.play();  
        clearInterval(menuMusicInterval);  
        }
    }, 1000);

    // depois de 5 segundos, por o jogo a jogar sozinho ou com uma animacao relacionada enquanto ninguem esta a jogar
};

/**
 * Runs all the setup procedures and then starts the game.
 */
function startGame() {
    clearAllAudioElements();
    if(menuMusicInterval)clearInterval(menuMusicInterval);
    soundControl();//If added full sound control to the game, change this

    document.getElementById("menu-content").style.display = "none";
    document.getElementById("gameover-content").style.display = "none";
    document.getElementById("header").style.visibility = "visible";
    document.getElementById("left-panel").style.visibility = "visible";
    document.getElementById("countdown").style.display = "block";
    ball.style.opacity='1';
    for (let i = 0; i < lives; i++) document.getElementById(`heart${i+1}`).src="resources/imgs/menu/hearts_byArtBIT/heart1.png"; 
    score=0;
    document.getElementById("score").innerHTML=score;

    gameStartPositions();
    //maybe create an animation in the countdown interval for the bricks to come down
    var count = 2;
    var countdown = setInterval(function(){
        document.getElementById("countdown").src=`resources/imgs/countdown/${count}.png`;
        var beep = document.getElementById("generalAudio");
        beep.src = 'resources/sounds/Menu-Music/Beep_countdown.mp3';
        beep.currentTime = 0;
        beep.volume=1;
        beep.loop=false;
        beep.play();
        count--;
    }, 1000);

    setTimeout(function(){
        clearInterval(countdown);
        document.getElementById("countdown").style.display = "none";
        document.getElementById("countdown").src="resources/imgs/countdown/3.png";
        document.getElementById("menu").classList.add("hidden");

        const musicPlaying = document.getElementById("generalAudio");
        musicPlaying.src = 'resources/sounds/'+menuThemeMusics[Math.round(Math.random()*(menuThemeMusics.length-1))];
        musicPlaying.loop=true;
        musicPlaying.volume=0.2;
        musicPlaying.play();  

        bricksGenerator();
        enableGameControls();
        startBallMotion();
    }, 3500);
}

function returnToMenu() {//revisar---------------------------------------------
    clearAllAudioElements();

    const musicPlaying = document.getElementById("generalAudio");
    musicPlaying.src = 'resources/sounds/'+menuThemeMusics[Math.round(Math.random()*(menuThemeMusics.length-1))];
    musicPlaying.loop=true;
    musicPlaying.volume=0.2;
    musicPlaying.play();    
    
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("gameover-content").style.display = "none";
    document.getElementById("header").style.visibility = "hidden";
    document.getElementById("left-panel").style.visibility = "hidden";
    document.getElementById("menu-content").style.display = "flex";
    ball.style.display = "none";
    paddle.style.display = "none";

    stopAnimation(eletricEffect);
    removeBricks();
}

function gameOver(){
    clearAllAudioElements();
    const menu = document.getElementById("menu");
    const gameoverMenu = document.getElementById("gameover-content");
    var menuFade;

    Array.from(gameoverMenu.getElementsByTagName('button')).forEach(element => {
        element.disabled = "disabled";
    });

    const step = 0.05;
    ball.style.opacity='1';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    gameoverMenu.style.opacity = '0';

    clearInterval(ballMovement); 
    disableGameControls();

    menu.classList.remove("hidden");
    gameoverMenu.style.display="flex";
    var gameover_strong = document.getElementById("generalAudio");
    gameover_strong.src = 'resources/sounds/GameOver-Music/Theme2_byJosephPueyo/ThisGameIsOver.mp3';
    gameover_strong.currentTime = 0;
    gameover_strong.loop=false;
    gameover_strong.volume=1;
    gameover_strong.play();
    gameover_strong.onended=function(){
        const musicPlaying = document.getElementById("generalAudio");
        musicPlaying.src = 'resources/sounds/'+gameoverThemeMusics[Math.round(Math.random()*(gameoverThemeMusics.length-1))];
        musicPlaying.loop=true;
        musicPlaying.currentTime=0;
        musicPlaying.volume=0.2;
        musicPlaying.play();
    };

    var currentOpacity = 1; 
    var ballFade = setInterval(() => {
        if (currentOpacity <= step) {
            clearInterval(ballFade); 
            ball.style.opacity = '0';

            currentOpacity = 0;
            menuFade = setInterval(() => {
                if (currentOpacity >= 0.7-step) {
                    clearInterval(menuFade); 
                    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';    
                    gameoverMenu.style.opacity = '1';          
                    return; 
                }
                
                currentOpacity += step;
                menu.style.backgroundColor = 'rgba(0, 0, 0, '+currentOpacity.toString()+')';    
                gameoverMenu.style.opacity = (currentOpacity+0.3).toString();
            }, 100);             
            return; 
        }
        
        currentOpacity -= step;
        ball.style.opacity = currentOpacity.toString();
    }, 50);

    setTimeout(() =>{
        Array.from(gameoverMenu.getElementsByTagName('button')).forEach(element => {
            element.disabled = "";
        });
    },6500);
}

/**
 * Positions the game elements in their default starting positions.
 */
function gameStartPositions() {
    
    //Activate ball and paddle\\
    ball.style.display = "inline";
    paddle.style.display = "inline";

    //Set default position for the ball\\
    ball.style.left = (game_container.clientWidth / 2) - (ball.clientWidth/2) + "px";
    ball.style.top = (31*rootFontSize - paddle.clientHeight/2) + "px";

    //Set default position for the paddle\\
    paddle.style.left = (game_container.clientWidth / 2) - (paddle.clientWidth/2) + "px";

    //Assure there are no doubled bricks\\
    removeBricks();

    //Start Effects/Animations\\
    eletricEffect=startAnimation(50,52);
}

/**
 * Creates an timeInterval that alternates between images to play an animation.(The image must be of the type X-Breakout-Tiles.png)
 * @param {int} startN - Is the first image
 * @param {int} endN - Is the last image
 * @returns The created timeInterval
 */
function startAnimation(startN, endN) {
    var count = startN;
    return setInterval(function(){
        document.getElementById("paddle").src=`resources/imgs/breakout_tile_set_1/png/${count}-Breakout-Tiles.png`;
        count++;
        if (count == endN+1) count = startN;
    }, 50);
}
/**
 * Stops the animation (it just clears the given timeInterval).
 * @param {number} animation - The animation timeInterval
 */
function stopAnimation(animation){clearInterval(animation);}

/**
 * Moves the paddle according to the given speed.
 * @param {number} deltaX 
 */
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

/**
 * Handles the controls that the user needs to play(WASD or Arrows).
 */
function handleGameControlls(event) {
    if(event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        movePaddle(-paddleSpeed);
    }
    else if(event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        movePaddle(paddleSpeed);
    }
}
/**
 * Enables the controls that the user needs to play(WASD or Arrows).
 */
function enableGameControls() {
    document.addEventListener("keydown", handleGameControlls)
}
/**
 * Disables the controls that the user needs to play(WASD or Arrows).
 */
function disableGameControls(){
    document.removeEventListener("keydown", handleGameControlls);
}

/**
 * Generates the bricks in their default positions one by one
 */
function bricksGenerator(){
    var bricksHTML=[];
    bricksMat=[];
    for (let i = 0; i < brickRows; i++) {
        var row = []
        var topMeasure = (bricksGridTopGap*rootFontSize) + (i*brickHeight)+ (i*bricksGap*rootFontSize);
        for (let k = 0; k < brickColumns; k++) {
            var leftMeasure = (k*brickWidth) + (k*bricksGap*rootFontSize) + (game_container.clientWidth - ((brickColumns*brickWidth) + (brickColumns*bricksGap*rootFontSize)))/2;

            var brickImg = Math.ceil(Math.random()*20);//Gets a random brick
            brickImg=brickImg%2==0?(Math.ceil(Math.random()*4)<4?brickImg-1:brickImg):brickImg;//Reduces the chances of the brick needing to be hit twice to break
            row.push([(i+"-"+k),(brickImg%2==0?2:1),(brickImg%2==0?brickImg-1:brickImg)]);//1->Will break immediately;2->Will change the image to Semi-Breaked in the first hit;(Nº of Hits needed to break)
            bricksHTML.push('<img id="'+i+'-'+k+'" class="brick" src="resources/imgs/breakout_tile_set_1/png/'+(brickImg%2==0?brickImg-1:brickImg)+'-Breakout-Tiles.png" alt="Brick" style="display:inline;top:'+topMeasure+'px;left:'+leftMeasure+'px;"/>');//Every brick will start equal, then it may break immediately or not
        }
        bricksMat.push(row);    
    }

    bricksHTML.reverse();
    bricksHTML.forEach(element => {
        var bricksContainer = document.createElement("div");
        bricksContainer.innerHTML = element;
        game_container.insertBefore(bricksContainer.firstElementChild, game_container.firstChild);
    }); 
}

/**
 * Removes all bricks from the page
 */
function removeBricks(){
    for (let i = 0; i < brickRows; i++) {
        for (let k = 0; k < brickColumns; k++) {
            var brick = document.getElementById(i+"-"+k);
            if(brick){
                brick.parentNode.removeChild(brick);
            }
        }
        
    }     
}

/**
 * Starts the Ball Motion creating an timeInterval
 */
function startBallMotion() {
    var angle;
    do {angle = Math.random() * Math.PI / 2 + Math.PI / 4;} while(angle==Math.PI/2); // Angle between 45 and 135 degrees

    var lastCoordX = ball.offsetLeft;
    var lastCoordY = ball.offsetTop;
    var count=0;
    ballMovement = setInterval(function() {
        count+=10;
        var newLeft;
        var newTop;
        var hittenSide = colisionsDetection();
        if(hittenSide!=""){
            angle = calcNewAngle(lastCoordX, lastCoordY, hittenSide);
            lastCoordX = ball.offsetLeft;
            lastCoordY = ball.offsetTop;
        }


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
        
        //Score
        document.getElementById("score").innerHTML=score;
    }, 10);
}

/**
 * Checks if the ball collided and, if so, on which side.
 * @returns "t" for top, "b" for bottom, "r" for right, "l" for left and "" for nothing hitten
 */
function colisionsDetection(){
    var hittenCoordX = ball.offsetLeft;
    var hittenCoordY = ball.offsetTop;

    //Game-Container Colisions
    if(hittenCoordY<=0)return "t";
    else if(hittenCoordX<=0)return "l";
    else if(hittenCoordX>=game_container.clientWidth-20)return "r";

    if(ball.offsetTop>=game_container.clientHeight-20){
        if (lives==1) {
            lives=3;
            document.getElementById("heart1").src="resources/imgs/menu/hearts_byArtBIT/heart3.png"; 
            gameOver();
        }else{
            document.getElementById(`heart${lives}`).src="resources/imgs/menu/hearts_byArtBIT/heart3.png";
            lives-=1  

            //Set default position for the ball\\
            ball.style.left = (game_container.clientWidth / 2) - (ball.clientWidth/2) + "px";
            ball.style.top = (31*rootFontSize - paddle.clientHeight/2) + "px";

            //Set default position for the paddle\\
            paddle.style.left = (game_container.clientWidth / 2) - (paddle.clientWidth/2) + "px";

            clearInterval(ballMovement);
            disableGameControls();
            var cleaner = new AbortController();
            document.addEventListener("keydown", (event) => {
                if(event.key === " "){
                    startBallMotion();
                    enableGameControls();
                    cleaner.abort();
                }
            }, { signal: cleaner.signal }); 
            return "b";
        }
            
    }

    //Paddle Colisons
    var paddleCoordX = paddle.offsetLeft;
    var paddleCoordY = paddle.offsetTop;

    if((paddleCoordY+paddle.clientHeight)>=hittenCoordY && (paddleCoordY-ball.clientHeight)<=hittenCoordY && (paddleCoordX-ball.clientWidth<=hittenCoordX) && (hittenCoordX<=(paddleCoordX+paddle.clientWidth))){
        //left side of the paddle has some pixels of hitbox not working

        if((paddleCoordY+(paddle.clientHeight/2))>=(hittenCoordY+ball.clientHeight)){
            return "b";
        }else{ //not sure if this can create new bugs(remove if it is causing problems)
            return "t";
        }
    }

    //Bricks Colisions
    var bricksGridWidth = (brickColumns*brickWidth) + (brickColumns*bricksGap*rootFontSize)-bricksGap;
    var bricksGridHeight = (brickRows*brickHeight)+ (brickRows*bricksGap*rootFontSize)-bricksGap;

    if((game_container.clientWidth - bricksGridWidth)/2<hittenCoordX+ball.clientWidth && (game_container.clientWidth - bricksGridWidth)/2 +bricksGridWidth>hittenCoordX && (bricksGridTopGap*rootFontSize) + bricksGridHeight>hittenCoordY && (bricksGridTopGap*rootFontSize)<hittenCoordY+ball.clientHeight){
        var ballCenterCoordY=hittenCoordY+ball.clientHeight/2
        var ballCenterCoordX=hittenCoordX+ball.clientWidth/2
        for (let i = 0; i < brickRows; i++) {
            //Checks Row
            if((bricksGridTopGap*rootFontSize) + (i*brickHeight) + (i*bricksGap*rootFontSize)<hittenCoordY+ball.clientHeight && hittenCoordY<(bricksGridTopGap*rootFontSize) + ((i+1)*brickHeight) + (i*bricksGap*rootFontSize)){               
                for (let k = 0; k < brickColumns; k++) {
                    //Check Column
                    if(bricksMat[i][k][1]!=0 && (game_container.clientWidth - bricksGridWidth)/2 + (k*brickWidth) + (k*bricksGap*rootFontSize)<hittenCoordX+ball.clientWidth && hittenCoordX<(game_container.clientWidth - bricksGridWidth)/2 + ((k+1)*brickWidth) + (k*bricksGap*rootFontSize)){
                        if (bricksMat[i][k][1]==1) {
                            document.getElementById(bricksMat[i][k][0]).style.display="none";
                        }else{
                            bricksMat[i][k][2]++;
                            document.getElementById(bricksMat[i][k][0]).src='resources/imgs/breakout_tile_set_1/png/'+bricksMat[i][k][2]+'-Breakout-Tiles.png';
                        }
                        bricksMat[i][k][1]--;
                        console.log("Colided with: "+i+"-"+k);

                        //Detect hitten side
                        brickCenterCoordY=(bricksGridTopGap*rootFontSize) + (i*brickHeight) + (i*bricksGap*rootFontSize)+brickHeight/2;
                        brickCenterCoordX=(game_container.clientWidth - bricksGridWidth)/2 + (k*brickWidth) + (k*bricksGap*rootFontSize)+brickWidth/2;
                        line1=(ballCenterCoordY-brickCenterCoordY)*((game_container.clientWidth - bricksGridWidth)/2 + (k*brickWidth) + (k*bricksGap*rootFontSize)-brickCenterCoordX)-(ballCenterCoordX-brickCenterCoordX)*((bricksGridTopGap*rootFontSize) + (i*brickHeight) + (i*bricksGap*rootFontSize)+brickHeight-brickCenterCoordY);
                        line2=(ballCenterCoordY-brickCenterCoordY)*((game_container.clientWidth - bricksGridWidth)/2 + (k*brickWidth) + (k*bricksGap*rootFontSize)-brickCenterCoordX)-(ballCenterCoordX-brickCenterCoordX)*((bricksGridTopGap*rootFontSize) + (i*brickHeight) + (i*bricksGap*rootFontSize)-brickCenterCoordY);
                        if((line1>=0 && line2>=0)||(line1<=0 && line2<=0)){
                            if (brickCenterCoordY>ballCenterCoordY) {
                                score+=50*scoreMultiplier;
                                return "b";
                            }else{
                                score+=50*scoreMultiplier;
                                return "t";
                            }                           
                        }else{
                            if (brickCenterCoordX>ballCenterCoordX) {
                                score+=50*scoreMultiplier;
                                return "r";
                            }else{
                                score+=50*scoreMultiplier;
                                return "l";
                            }
                        }
                    }                          
                }
            }
        }           
    }
    return "";
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
                angle=Math.random()>0.5?((3*Math.PI/2)-(Math.random()/2)):((3*Math.PI/2)+(Math.random()/2));
            }
            else if(startCoordX>hittenCoordX){
                angle=Math.PI + rawAngle;
            }else{
                angle=(2*Math.PI)-rawAngle;
            }
        }else{//bottom
            if(Math.abs(startCoordX-hittenCoordX)<10){
                angle=Math.random()>0.5?((Math.PI/2)-(Math.random()/4)):((Math.PI/2)+(Math.random()/4));
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
                angle=Math.random()>0.5?(Math.PI-((Math.random()*Math.PI)/4)):(Math.PI+((Math.random()*Math.PI)/4));
            }
            else if(startCoordY>hittenCoordY){
                angle=Math.PI/2 + rawAngle;
            }else{
                angle=((3*Math.PI)/2)-rawAngle;
            }
        }else{//left
            if(Math.abs(startCoordY-hittenCoordY)<10){
                angle=Math.random()>0.5?((Math.random()*Math.PI)/4):((2*Math.PI)-((Math.random()*Math.PI)/4));
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

/**
 * Stops playing all audios
 */
function clearAllAudioElements() {
    const mediaElements = document.querySelectorAll('audio, video');

    mediaElements.forEach(element => {
        element.pause();
        element.currentTime = 0; 
    });
}

/**
 * Controls if the sound is muted or not(for now just to work with new chrome policies)
 */
function soundControl(){
    var mute = document.getElementById("mute");
    if(isMenuMuted){
        mute.classList.remove('fa-volume-xmark');
        mute.classList.add('fa-volume-high');
        isMenuMuted=false;
        mute.style.display="none";
    }else{
        mute.style.display="none";
        //This is just because of the new chrome policies, maybe in the feature implement full sound control
        //mute.classList.remove('fa-volume-high');
        //mute.classList.add('fa-volume-xmark');
        //isMenuMuted=true;
    }
}