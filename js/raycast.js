const CONFIG = {
	ROWS: 15,
	COLS: 15,
	TILE_SIZE: 32
};

const WINDOW_WIDTH = CONFIG.COLS * CONFIG.TILE_SIZE;
const WINDOW_HEIGHT = CONFIG.ROWS * CONFIG.TILE_SIZE;

const GameMap = () => {
	const isWall = (x, y) => MAP_GRID[y][x] === 1;

	const render = () => {
		for (let y = 0; y < CONFIG.ROWS; y++) {
			for (let x = 0; x < CONFIG.COLS; x++) {
				const tileX = x * CONFIG.TILE_SIZE;
				const tileY = y * CONFIG.TILE_SIZE;

				const tileColor = isWall(x, y) ? 'black' : 'white';

				stroke('black');
				fill(tileColor);
				rect(tileX, tileY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
			}
		}
	}

	return ({
		render,
		isWall
	});
};

const Player = (x, y) => {
	let posX = x;
	let posY = y;
	let turnDirection = 0;
	let walkDirection = 0;
	let rotationAngle = Math.PI / 2;
	const radius = 10;
	const moveSpeed = 3.0;
	const rotationSpeed = 3 * (Math.PI / 180);

	const walkForward = () => walkDirection = 1;
	const walkBackwards = () => walkDirection = -1;
	const walkStop = () => walkDirection = 0;

	const turnRight = () => turnDirection = 1;
	const turnLeft = () => turnDirection = -1;
	const turnStop = () => turnDirection = 0;

	const updateRotationAngle = () => {
		rotationAngle += turnDirection * rotationSpeed;
	};

	const updatePosition = () => {
		const step = walkDirection * moveSpeed;

		const newPosX = posX + Math.cos(rotationAngle) * step;
		const newPosY = posY + Math.sin(rotationAngle) * step;

		const gridPosX = Math.trunc((newPosX / CONFIG.TILE_SIZE));
		const gridPosY = Math.trunc((newPosY / CONFIG.TILE_SIZE));

		if (map.isWall(gridPosX, gridPosY)) return;

		posX = newPosX;
		posY = newPosY;
	};

	const update = () => {
		if (turnDirection) updateRotationAngle();
		if (walkDirection) updatePosition();
	};

	const render = () => {
		noStroke();
		fill('red');
		circle(posX, posY, radius);
		stroke('red');
		line(
			posX,
			posY,
			posX + Math.cos(rotationAngle) * 20,
			posY + Math.sin(rotationAngle) * 20,
		);
	};

	return ({
		render,
		update,
		walkForward,
		walkBackwards,
		walkStop,
		turnRight,
		turnLeft,
		turnStop
	});
};

const map = GameMap();
const player = Player(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);

function keyPressed() {
	if (keyCode == UP_ARROW) player.walkForward();
	if (keyCode == DOWN_ARROW) player.walkBackwards();
	if (keyCode == RIGHT_ARROW) player.turnRight();
	if (keyCode == LEFT_ARROW) player.turnLeft();
}

function keyReleased() {
	const upOrDownReleased = [UP_ARROW, DOWN_ARROW].includes(keyCode);
	const leftOrRightReleased = [LEFT_ARROW, RIGHT_ARROW].includes(keyCode);

	if (upOrDownReleased) player.walkStop();
	if (leftOrRightReleased) player.turnStop();
}

function setup() {
	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
};

function updateState() {
	player.update();
}

function draw() {
	updateState();

	map.render();
	player.render();
};
