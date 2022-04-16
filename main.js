const canvas = document.getElementById("pongGame");
const context = canvas.getContext("2d");
canvas.width = 650;
canvas.height = 400;

let scoreOne = 0;
let scoreTwo = 0;


//Teclas de movimiento.
document.addEventListener("keydown", function(ev){
    console.log(ev.keyCode);

	if (ev.keyCode == 87 && playerOne.y - playerOne.gravity > 0) {
		playerOne.y -= playerOne.gravity *4;
	}
	else if(ev.keyCode == 83 && playerOne.y + playerOne.height + playerOne.gravity < canvas.height){
        playerOne.y += playerOne.gravity *4;
		
	}
	else if(ev.keyCode == 38 && playerTwo.y - playerTwo.gravity > 0){
        playerTwo.y -= playerTwo.gravity *4;
		
	}
	else if(ev.keyCode == 40 && playerTwo.y + playerTwo.height + playerTwo.gravity < canvas.height){
		playerTwo.y += playerTwo.gravity *4;
		
	}

	else if(ev.keyCode == 80){
        ball.x = 650/2;
        ball.y = 400/2;
		ball.speed = 0;
        ball.gravity = 0;
        playerOne.gravity = 0;
        playerTwo.gravity = 0;
        
	}

    else if(ev.keyCode == 67){
		ball.speed = 1;
        ball.gravity = 1;
        playerOne.gravity = 3;
        playerTwo.gravity = 3;
        
	}

    else if(ev.keyCode == 82){
        scoreOne = 0;
        scoreTwo = 0;
        ball.x = 650/2;
        ball.y = 400/2;
		ball.speed = 1;
        ball.gravity = 1;
        playerOne.x = 5;
        playerOne.y = 200;
        playerTwo.x = 630
        playerTwo.y = 200
        playerOne.gravity = 3;
        playerTwo.gravity = 3       
        
	}
	
});
//Clase que representa los elementos del juego. 
class Element{
    constructor(options){
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.speed = options.speed || 2;
        this.gravity = options.gravity;
        
    }
}

//Primera barra.
const playerOne = new Element({
    x:5,
    y:200,
    width:15,
    height:80,
    color:"#FF0000",
    gravity: 3
})

//Segunda barra.
const playerTwo = new Element({
    x:630,
    y:200,
    width:15,
    height:80,
    color:"#0000FF",
    gravity: 3
})

//Bola.
const ball = new Element({
    x:650/2,
    y:400/2,
    width:15,
    height:15,
    color:"#009900",
    speed: 1,
    gravity: 1,
})


 // Dibuja el elemento.
function drawElement(element){
    context.fillStyle = element.color;
    context.fillRect(element.x , element.y, element.width, element.height);
}

//Record del juegador uno.
function displayScoreOne(){
    context.font = "18px Arial";
    context.fillStyle = "#FF0000";
    context.fillText(scoreOne, canvas.width / 2 - 60, 30);
}

//Record del jugador dos.
function displayScoreTwo(){
    context.font = "18px Arial";
    context.fillStyle = "#0000FF";
    context.fillText(scoreTwo, canvas.width / 2 + 60, 30);
}

//Hace que la bola rebote.
function ballBounce(){
    if(ball.y + ball.gravity <= 0 || ball.y + ball.gravity >= canvas.height){
        ball.gravity = ball.gravity * -1;
        ball.y += ball.gravity;
        ball.x += ball.speed;
    }
    else{
        ball.y += ball.gravity;
        ball.x += ball.speed;
    }
    ballCollision();
}

//Detecta el choque.
function ballCollision(){

    if((ball.y + ball.gravity <= playerTwo.y + playerTwo.height && ball.x + ball.width + ball.speed >= playerTwo.x && ball.y + ball.gravity > playerTwo.y) || 
        (ball.y + ball.gravity > playerOne.y && ball.x + ball.speed <= playerOne.x + playerOne.width)
        ){
            ball.speed = ball.speed * -1.4;
        }
        else if(ball.x + ball.speed < playerOne.x){
            scoreTwo += 1;
            ball.speed = 1;
            ball.x = 650/2;
            ball.y += ball.gravity;
        }
        else if(ball.x + ball.speed > playerTwo.x + playerTwo.width){
            scoreOne += 1;
            ball.speed = 1;
            ball.x = 650/2;
            ball.y += ball.gravity;
        }

    
    drawElements();
}

//Dibuja los elementos.
function drawElements(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawElement(playerOne);
    drawElement(playerTwo);
    drawElement(ball);
    displayScoreOne();
    displayScoreTwo();
}

function loop(){
    ballBounce();
    window.requestAnimationFrame(loop);
}
loop();