(function(){
  self.Board = function(width, height){
  	//Caractetísticas generales del campo de juego
 	this.width = width;
 	this.height = height;
 	this.plating = false;
 	this.gameOver = false;
 	this.bars = [];
 	this.ball = null;
 	this.playing = false;
 }

 	self.Board.prototype = {
 		//El campo de juego obtiene los elementos
 	get elements(){
 		var elements = this.bars.map(function(bar){return bar;});
 		elements.push(this.ball);
 		return elements;
 	}
 	
 }

})();
(function(){
	self.Ball = function(x, y, radius, board){
		//Característiacas de la pelota
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speedY = 0;
		this.speedX = 3;
		this.board = board;
		this.direction = 1;
		this.bounceAngle = 0;
		this.maxBounceAngle = Math.PI / 12;
		this.speed = 5;

		board.ball = this;
		this.kind = "circle";

	}
	self.Ball.prototype = {
		//Permite que la pelota se mueva de lado a lado simulando la realidad con el rebote
			move: function(){
				this.x += (this.speedX * this.direction);
				this.y += (this.speedY * this.direction);
			},

			get width(){
				return this.radius * 2;
			},
			get height(){
				return this.radius * 2;
			},

			
			collision: function(bar){
				//Reacciona a la colisión con una barra que recibe como parámetro
				var relativeIntersectY = (bar.y + (bar.height / 2)) - this.y;
				var normalizedIntersectY = relativeIntersectY / (bar.height / 2);
				this.bounceAngle = normalizedIntersectY * this.maxBounceAngle;
				this.speedY = this.speed * -Math.sin(this.bounceAngle);
				this.speedX = this.speed * Math.cos(this.bounceAngle);

				if (this.x > (this.board.width / 2)) this.direction = -1;
				else this.direction = 1;

			}
		}
})();

(function(){
	self.Bar = function(x, y, width, height, board){
		//Características de las barras
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.board = board;

		this.board.bars.push(this);

		this.kind = "rectangle";
		this.speed = 10;
	}

	self.Bar.prototype = {
		//Permite que las barras subas y bajen
		down: function(){
			this.y += this.speed;
		},

		up: function(){
			this.y -= this.speed;
		},
		toString: function(){
			return "x: " + this.x + " y: " + this.y;
		}
	}
})();

(function(){
	//permite la visualización del juego
	self.BoardView = function(canvas, board){
		this.canvas = canvas;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.board = board;
		this.ctx = canvas.getContext("2d");
	}

	self.BoardView.prototype = {
		//Propiedad clean para limpiar el dibujado y simular la animación
		clean: function(){
			this.ctx.clearRect(0, 0, this.board.width, this.board.height);
		}, 
		//Propiedad draw para dibujar los elementos 
		draw: function(){
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];

				draw(this.ctx, el);
			};
		},
		checkCollision: function(){
			// Verifica la colision
			for (var i = this.board.bars.length - 1; i >= 0; i--) {
				var bar = this.board.bars[i];
				if (hit(bar, this.board.ball)) {
					this.board.ball.collision(bar);
				}
			};
		},

		play: function(){
			//Inicia el juego
			if (this.board.playing) {
			this.clean();
			this.draw();
			this.checkCollision();
			this.board.ball.move();
			}
			
		}
	}

	function hit(a, b){
		//Revisa si la pelota colisiona con alguna de las barras 
		var hit = false;

		if (b.x + b.width >= a.x && b.x < a.x + a.width) {
			if (b.y + b.height >= a.y && b.y < a.y + a.height) 
				hit = true;
		}
		if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
			if (b.y <= a.y && b.y + b.height >= a.y + a.height) 
				hit = true;
		}
		if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
			if (a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;
		}
		return hit;

	}

	function draw(ctx, element){
			// Dibuja las barras y la pelota
			switch(element.kind){
			case "rectangle":
			ctx.fillRect(element.x, element.y, element.width, element.height);
			break;
			case "circle":
			ctx.beginPath();
			ctx.arc(element.x, element.y, element.radius, 0, 7);
			ctx.fill();
			ctx.closePath();
			break;

		}
		
	}

})();

//Características de la pelota y las barras
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var boardView = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);


document.addEventListener("keydown", function(ev){
	// Comandos de teclado para manipular el juego
	if (ev.keyCode == 87) {
		ev.preventDefault();
		bar.up();
	}
	else if(ev.keyCode == 83){
		ev.preventDefault();
		bar.down();
		
	}
	else if(ev.keyCode == 38){
		ev.preventDefault();
		bar2.up();
		
	}
	else if(ev.keyCode == 40){
		ev.preventDefault();
		bar2.down();
		
	}
	else if(ev.keyCode == 32){
		ev.preventDefault();
		board.playing = !board.playing;
	}
	
});



boardView.draw();
window.requestAnimationFrame(main);

function main() {
	boardView.play();
	window.requestAnimationFrame(main);

}