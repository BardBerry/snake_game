class Game {
  constructor() {
    this.canvas = /** @type {HTMLCanvasElement} */ document.querySelector('#main-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasSize = 600;
    this.tileSize = 20;
    this.gameMap = new Array(this.canvasSize / this.tileSize).fill('').map(() => new Array(this.canvasSize / this.tileSize).fill('.'));
    this.snake = [];
    this.lastX = 0;
    this.lastY = 0;
    this.score = 0;
  }

  init() {
    this.scoreDiv = document.querySelector('.score');
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyA':
          if (this.lastMove !== 'D') { this.lastMove = 'A'; }
          break;
        case 'KeyW':
          if (this.lastMove !== 'S') { this.lastMove = 'W'; }
          break;
        case 'KeyD':
          if (this.lastMove !== 'A') { this.lastMove = 'D'; }
          break;
        case 'KeyS':
          if (this.lastMove !== 'W') { this.lastMove = 'S'; }
          break;

        default:
          break;
      }
    });
  }

  getCoordinates(position) {
    return [position[0] * this.tileSize, position[1] * this.tileSize];
  }

  getRandomPosition() {
    const y = Math.round(Math.random() * (this.gameMap.length - 0.5) - 0.5);
    const x = Math.round(Math.random() * (this.gameMap.length - 0.5) - 0.5);
    return [y, x];
  }

  showGrid() {
    for (let i = 1; i < (this.canvas.width / this.tileSize); i += 1) {
      this.ctx.strokeStyle = '#FF0000';
      this.ctx.moveTo(0, this.tileSize * i);
      this.ctx.lineTo(this.canvas.width, this.tileSize * i);
      this.ctx.stroke();
      this.ctx.moveTo(this.tileSize * i, 0);
      this.ctx.lineTo(this.tileSize * i, this.canvas.width);
      this.ctx.stroke();
    }
  }

  drawApple() {
    const position = this.getCoordinates(this.apple);
    this.ctx.fillStyle = '#4a604f';
    this.ctx.fillRect(position[0] + 1, position[1] + 1, this.tileSize - 2, this.tileSize - 2);
    this.ctx.clearRect(position[0], position[1], 7, 7);
    this.ctx.clearRect(position[0], position[1] + 13, 7, 7);
    this.ctx.clearRect(position[0] + 13, position[1], 7, 7);
    this.ctx.clearRect(position[0] + 13, position[1] + 13, 7, 7);
  }

  drawSnake() {
    this.snake.forEach((snakeTile, index) => {
      const position = this.getCoordinates(snakeTile);
      if (index === 0) {
        this.ctx.fillStyle = '#4a604f';
        this.ctx.fillRect(position[0] + 1, position[1] + 1, this.tileSize - 2, this.tileSize - 2);
        this.ctx.clearRect(position[0] + 3, position[1] + 3, this.tileSize - 6, this.tileSize - 6);
      } else {
        this.ctx.fillStyle = '#4a604f';
        this.ctx.fillRect(position[0] + 1, position[1] + 1, this.tileSize - 2, this.tileSize - 2);
      }
    });
  }

  clearMap() {
    // const position = this.getCoordinates(this.lastTile);
    // this.ctx.clearRect(position[0], position[1], this.tileSize, this.tileSize);
    this.ctx.clearRect(0, 0, 900, 900);
  }

  moveTop() {
    this.lastY = this.snake[this.snake.length - 1][0]; 2
    this.lastX = this.snake[this.snake.length - 1][1] - 1;
    this.snake[this.snake.length - 1][0] = this.snake[0][0];
    this.snake[this.snake.length - 1][1] = this.snake[0][1];
    this.snake.unshift(this.snake.pop());
    this.snake[0][1] -= 1;
  }

  moveDown() {
    this.lastY = this.snake[this.snake.length - 1][0];
    this.lastX = this.snake[this.snake.length - 1][1] + 1;
    this.snake[this.snake.length - 1][0] = this.snake[0][0];
    this.snake[this.snake.length - 1][1] = this.snake[0][1];
    this.snake.unshift(this.snake.pop());
    this.snake[0][1] += 1;
  }

  moveLeft() {
    this.lastY = this.snake[this.snake.length - 1][0] - 1;
    this.lastX = this.snake[this.snake.length - 1][1];
    this.snake[this.snake.length - 1][0] = this.snake[0][0];
    this.snake[this.snake.length - 1][1] = this.snake[0][1];
    this.snake.unshift(this.snake.pop());
    this.snake[0][0] -= 1;
  }

  moveRight() {
    this.lastY = this.snake[this.snake.length - 1][0] + 1;
    this.lastX = this.snake[this.snake.length - 1][1];
    this.snake[this.snake.length - 1][0] = this.snake[0][0];
    this.snake[this.snake.length - 1][1] = this.snake[0][1];
    this.snake.unshift(this.snake.pop());
    this.snake[0][0] += 1;
  }

  checkBounds() {
    if (this.snake[0][0] >= this.gameMap[0].length || this.snake[0][1] >= this.gameMap[0].length) {
      alert('game over');
      window.location.replace('file:///home/bardberry/BardBerry/projects/snake/index.html');
    }
    if (this.snake[0][0] < 0 || this.snake[0][1] < 0) {
      alert('game over');
      window.location.replace('file:///home/bardberry/BardBerry/projects/snake/index.html');
    }
  }

  checkApple() {
    if (JSON.stringify(this.snake[0]) === JSON.stringify(this.apple)) {
      this.snake.push([this.lastY, this.lastY]);
      this.score += 1;
      this.scoreDiv.innerText = `your score: ${this.score}`;
      this.counter = 0;

      while (true) {
        this.apple = this.getRandomPosition();
        this.snake.forEach((snakeTile) => {
          if (this.apple[0] === snakeTile[0] && this.apple[1] === snakeTile[1]) {
            this.counter += 1;
          }
        });
        if (this.counter === 0) {
          break;
        }
        this.counter = 0;
      }
    }
  }

  checkSnake() {
    const snakeHead = JSON.stringify(this.snake[0]);
    this.snake.forEach((snakeTile, index) => {
      if (snakeHead === JSON.stringify(snakeTile) && index !== 0) {
        alert('game over');
        window.location.replace('file:///home/bardberry/BardBerry/projects/snake/index.html');
      }
    });
  }

  start() {
    this.init();
    // this.showGrid();
    this.apple = this.getRandomPosition();
    this.snake.push(this.getRandomPosition());

    while (this.apple[0] === this.snake[0][0] && this.apple[1] === this.snake[0][1]) {
      this.apple = this.getRandomPosition();
    }
    setInterval(() => {
      switch (this.lastMove) {
        case 'A':
          this.moveLeft();
          break;
        case 'W':
          this.moveTop();
          break;
        case 'D':
          this.moveRight();
          break;
        case 'S':
          this.moveDown();
          break;

        default:
          break;
      }
      this.clearMap();
      this.drawApple();
      this.drawSnake();
      this.checkBounds();
      this.checkApple();
      this.checkSnake();
    }, 100);
  }
}

const game = new Game();
game.start();
