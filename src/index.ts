import Phaser from "phaser";

const gameWidth = 800;
const gameHeight = 600;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const flapVelocity = 250;
const initialBirdPosition = { x: gameWidth * 0.1, y: gameHeight / 2 };

const VELOCITY = 200;
// const GRAVITY_Y = 400;
const GRAVITY_Y = 0;
const PIPES_TO_RENDER = 4;

let bird: Phaser.Physics.Arcade.Sprite;
let pipes: Phaser.Physics.Arcade.Group | null = null;

const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [500, 550];

function preload(this: Phaser.Scene) {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create(this: Phaser.Scene): void {
  this.add.image(0, 0, "sky").setOrigin(0);

  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.setGravityY(GRAVITY_Y);

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);

    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-VELOCITY);

  this.input.on("pointerdown", flap);
  this.input.keyboard?.on("keydown_SPACE", flap);
}

function update(): void {
  if (bird.y > gameHeight || bird.y < -bird.height) {
    restartBirdPosition();
  }

  recyclePipes();
}

function placePipe(
  uPipe: Phaser.Physics.Arcade.Sprite,
  lPipe: Phaser.Physics.Arcade.Sprite,
) {
  const rightMostX = getRightMostPipe();
  const pipVerticalDistance = Phaser.Math.Between(
    // @ts-ignore
    ...pipeVerticalDistanceRange,
  );

  const pipVerticalPosition = Phaser.Math.Between(
    0 + 20,
    (config.height as number) - 20 - pipVerticalDistance,
  );

  const pipeHorizontalDistance = Phaser.Math.Between(
    // @ts-ignore
    ...pipeHorizontalDistanceRange,
  );

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipVerticalDistance;
}

function getRightMostPipe(): number {
  const pipeChildren = (pipes?.getChildren() ??
    []) as Phaser.Physics.Arcade.Sprite[];

  return pipeChildren.reduce((rightMostX, pipe) => {
    return Math.max(rightMostX, pipe.x);
  }, 0);
}

function restartBirdPosition(): void {
  bird.setPosition(initialBirdPosition.x, initialBirdPosition.y);
  bird.setVelocityY(0);
}

function recyclePipes(): void {
  let tempPipes = [] as Phaser.Physics.Arcade.Sprite[];
  const pipeChildren = (pipes?.getChildren() ??
    []) as Phaser.Physics.Arcade.Sprite[];

  pipeChildren.forEach((pip) => {
    if (pip.getBounds().right <= 0) {
      tempPipes.push(pip);
      if (tempPipes.length == 2) {
        placePipe(tempPipes[0], tempPipes[1]);
      }
    }
  });
}

function flap(): void {
  bird.setVelocityY(-flapVelocity);
}

new Phaser.Game(config);
