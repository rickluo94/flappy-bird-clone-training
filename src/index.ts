import Phaser from "phaser";

import PlayScene from "./scenes/PlayScene";
import type { SharedConfig } from "./types/sharedConfig";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BIRD_POSITION = { x: GAME_WIDTH * 0.1, y: GAME_HEIGHT / 2 };
const VELOCITY = 200;
const GRAVITY_Y = 0;
const FLAP_VELOCITY = 250;

const SHARED_CONFIG: SharedConfig = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: BIRD_POSITION,
  velocity: VELOCITY,
  gravityY: GRAVITY_Y,
  flapVelocity: FLAP_VELOCITY,
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [new PlayScene(SHARED_CONFIG)],
};

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
    .sprite(BIRD_POSITION.x, BIRD_POSITION.y, "bird")
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
  if (bird.y > GAME_HEIGHT || bird.y < -bird.height) {
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
  bird.setPosition(BIRD_POSITION.x, BIRD_POSITION.y);
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
  bird.setVelocityY(-FLAP_VELOCITY);
}

new Phaser.Game(config);
