(function () {
	const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
	
	let difficulties = 12;

	const config = {
		cellsHorizontal: difficulties,
		cellsVertical: difficulties,
		wallWidth: 8,
		outerWallWidth: 20,
		backgroundColor: "#ede6e3",
		ballColor: "#ff8e40",
		goalColor: "red",
		wallColor: "#36382e"
	};

	const unit = 24;
	const width = config.cellsHorizontal * unit;
	const height = config.cellsVertical * unit;

	const engine = Engine.create();
	engine.world.gravity.y = 0;
	const { world } = engine;
	const render = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width,
			height,
			background: config.backgroundColor,
			wireframes: false
		}
	});

	Render.run(render);
	Runner.run(Runner.create(), engine);

	const body = document.querySelector("body");
	body.style.backgroundColor = config.backgroundColor;
	// Board walls
	const walls = [
		Bodies.rectangle(width / 2, 0, width, config.outerWallWidth, {
			isStatic: true,
			render: {
				fillStyle: config.wallColor
			}
		}),
		Bodies.rectangle(width / 2, height, width, config.outerWallWidth, {
			isStatic: true,
			render: {
				fillStyle: config.wallColor
			}
		}),
		Bodies.rectangle(0, height / 2, config.outerWallWidth, height, {
			isStatic: true,
			render: {
				fillStyle: config.wallColor
			}
		}),
		Bodies.rectangle(width, height / 2, config.outerWallWidth, height, {
			isStatic: true,
			render: {
				fillStyle: config.wallColor
			}
		})
	];
	World.add(world, walls);

	// Maze generation
	const shuffle = (arr) => {
		for (let counter = arr.length - 1; counter > 0; counter--) {
			const index = Math.floor(Math.random() * (counter + 1));
			[arr[counter], arr[index]] = [arr[index], arr[counter]];
		}

		return arr;
	};

	const grid = Array(config.cellsVertical)
		.fill(null)
		.map(() => Array(config.cellsHorizontal).fill(false));

	const verticals = Array(config.cellsVertical)
		.fill(null)
		.map(() => Array(config.cellsHorizontal - 1).fill(false));

	const horizontals = Array(config.cellsVertical - 1)
		.fill(null)
		.map(() => Array(config.cellsHorizontal).fill(false));

	const startRow = Math.floor(Math.random() * config.cellsVertical);
	const startColumn = Math.floor(Math.random() * config.cellsHorizontal);

	const stepThroughCell = (row, column) => {
		// If I have visited the cell at [row, column], then return
		if (grid[row][column]) {
			return;
		}
		// Mark this cell as being visisted
		grid[row][column] = true;
		// Assemble random-ordered list of neighbors
		const neighbors = shuffle([
			[row - 1, column, "up"], // Above
			[row, column + 1, "right"], // Right
			[row + 1, column, "down"], // Below
			[row, column - 1, "left"] // Left
		]);
		// For each neighbor...
		for (let neighbor of neighbors) {
			const [nextRow, nextColumn, direction] = neighbor;
			// See if that neighbor is out of bounds
			if (
				nextRow < 0 ||
				nextRow >= config.cellsVertical ||
				nextColumn < 0 ||
				nextColumn >= config.cellsHorizontal
			) {
				continue;
			}
			// If we have visited that neighbor, continure to next neighbor
			if (grid[nextRow][nextColumn]) {
				continue;
			}
			// Remove a wall from either horizontals or verticals
			switch (direction) {
				case "left":
					verticals[row][column - 1] = true;
					break;
				case "right":
					verticals[row][column] = true;
					break;
				case "up":
					horizontals[row - 1][column] = true;
					break;
				case "down":
					horizontals[row][column] = true;
					break;
			}
			// Visit the next cell
			stepThroughCell(nextRow, nextColumn);
		}
	};

	stepThroughCell(startRow, startColumn);

	horizontals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if (open) {
				return;
			}

			const wall = Bodies.rectangle(
				columnIndex * unit + unit / 2,
				rowIndex * unit + unit,
				unit,
				config.wallWidth,
				{
					label: "wall",
					isStatic: true,
					render: {
						fillStyle: config.wallColor
					}
				}
			);
			World.add(world, wall);
		});
	});

	verticals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if (open) {
				return;
			}

			const wall = Bodies.rectangle(
				columnIndex * unit + unit,
				rowIndex * unit + unit / 2,
				config.wallWidth,
				unit,
				{
					label: "wall",
					isStatic: true,
					render: {
						fillStyle: config.wallColor
					}
				}
			);
			World.add(world, wall);
		});
	});

	const radius = Math.min(unit, unit) / 4;
	// Goal
	const goal = Bodies.rectangle(
		width - unit / 2,
		height - unit / 2,
		Math.min(unit, unit) / 2,
		Math.min(unit, unit) / 2,
		{
			label: "goal",
			isStatic: true,
			render: {
				fillStyle: config.goalColor
			}
		}
	);
	World.add(world, goal);

	// Ball
	const ball = Bodies.circle(unit / 2, unit / 2, radius, {
		label: "ball",
		render: {
			fillStyle: config.ballColor
		}
	});
	World.add(world, ball);

	document.addEventListener("keydown", (event) => {
		const { x, y } = ball.velocity;
		const speedLimit = 5;

		if (
			event.key.toLocaleLowerCase() === "a" ||
			(event.key === "ArrowLeft" && x > -speedLimit)
		) {
			Body.setVelocity(ball, { x: x - 3, y });
		} else if (
			(event.key.toLocaleLowerCase() === "w" || event.key === "ArrowUp") &&
			y > -speedLimit
		) {
			Body.setVelocity(ball, { x, y: y - 3 });
		} else if (
			(event.key.toLocaleLowerCase() === "d" || event.key === "ArrowRight") &&
			x < speedLimit
		) {
			Body.setVelocity(ball, { x: x + 3, y });
		} else if (
			(event.key.toLocaleLowerCase() === "s" || event.key === "ArrowDown") &&
			y < speedLimit
		) {
			Body.setVelocity(ball, { x, y: y + 3 });
		}
	});

	document.addEventListener("keyup", (event) => {
		const { x, y } = ball.velocity;
		Body.setVelocity(ball, { x: 0, y: 0 });
	});

	// Win Condition
	Events.on(engine, "collisionStart", (event) => {
		event.pairs.forEach((collision) => {
			const labels = ["ball", "goal"];

			if (
				labels.includes(collision.bodyA.label) &&
				labels.includes(collision.bodyB.label)
			) {
				document.querySelector(".winner").classList.remove("hidden");
				world.gravity.y = 1;
				world.bodies.forEach((body) => {
					if (body.label === "wall") {
						Body.setStatic(body, false);
					}
				});
			}
		});
	});
	
	// Adjust game difficulties
	
})();
