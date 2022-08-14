const config = {
  score: 0,
	step: 0,
	maxStep: 6,
	sizeCell: 16,
	sizeBerry: 6,
  snake: {
    x: 160,
    y: 160,
    dx: 16,
    dy: 0,
    tails: [],
    maxTails: 3
  },
  berry: {
    x: 0,
    y: 0
  }
};

const canvas = document.querySelector('#canvas');
const scoreBlock = document.querySelector('.score .count');
const context = canvas.getContext('2d');

const scoreUp = () => {
	config.score++;
	drawScore();
}

const drawScore = () => {
	scoreBlock.innerHTML = config.score;
}

const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}

const randomPositionBerry = () => {
	config.berry.x = getRandom(0, canvas.width / config.sizeCell) * config.sizeCell;
	config.berry.y = getRandom(0, canvas.height / config.sizeCell) * config.sizeCell;
}

const drawBerry = () => {
	context.beginPath();
	context.fillStyle = '#f74c55';
	context.arc(
    config.berry.x + (config.sizeCell / 2),
    config.berry.y + (config.sizeCell / 2),
    config.sizeBerry,
    0,
    2 * Math.PI
  );
	context.fill();
}

const collisionBorder = () => {
	if (config.snake.x < 0) {
		config.snake.x = canvas.width - config.sizeCell;
	} else if (config.snake.x >= canvas.width) {
		config.snake.x = 0;
	}

	if (config.snake.y < 0) {
		config.snake.y = canvas.height - config.sizeCell;
	} else if (config.snake.y >= canvas.height) {
		config.snake.y = 0;
	}
}

const refreshGame = () => {
	config.score = 0;
	drawScore();

	config.snake.x = 160;
	config.snake.y = 160;
	config.snake.tails = [];
	config.snake.maxTails = 3;
	config.snake.dx = config.sizeCell;
	config.snake.dy = 0;

	randomPositionBerry();
}

const drawSnake = () => {
	config.snake.x += config.snake.dx;
	config.snake.y += config.snake.dy;

	collisionBorder();

	config.snake.tails.unshift({x: config.snake.x, y: config.snake.y});

	if (config.snake.tails.length > config.snake.maxTails) {
		config.snake.tails.pop();
	}

	config.snake.tails.forEach((el, index) => {
    context.fillStyle = index === 0 ? '#66ca36' : '#85d55e';
		context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

		if (el.x === config.berry.x && el.y === config.berry.y) {
			config.snake.maxTails++;
			scoreUp();
			randomPositionBerry();
		}

		for (let i = index + 1; i < config.snake.tails.length; i++) {
			if (el.x === config.snake.tails[i].x && el.y === config.snake.tails[i].y) {
        alert(`Ты набрал очков: ${config.score}`);
				refreshGame();
			}
		}
	});
}

const gameLoop = () => {
	requestAnimationFrame(gameLoop);

	if (++config.step < config.maxStep) {
		return;
	}

	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawBerry();
	drawSnake();
}

drawScore();
requestAnimationFrame(gameLoop);

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp': {
      config.snake.dy = -config.sizeCell;
		  config.snake.dx = 0;
      break;
    }
    case 'KeyS':
    case 'ArrowDown': {
      config.snake.dy = config.sizeCell;
		  config.snake.dx = 0;
      break;
    }
    case 'KeyA':
    case 'ArrowLeft': {
      config.snake.dx = -config.sizeCell;
		  config.snake.dy = 0;
      break;
    }
    case 'KeyD':
    case 'ArrowRight': {
      config.snake.dx = config.sizeCell;
		  config.snake.dy = 0;
      break;
    }
    default:
      break;
  }
});
