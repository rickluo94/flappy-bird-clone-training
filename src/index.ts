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
const pipeX = 400;
const pipeGap = 100;

let bird: Phaser.Physics.Arcade.Sprite;
let upperPipe: Phaser.Physics.Arcade.Sprite;
let lowerPipe: Phaser.Physics.Arcade.Sprite;

const pipeVerticalDistanceRange = [150, 250];
// @ts-ignore
let pipVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
let pipVerticalPosition = Phaser.Math.Between(
  0 + 20,
  (config.height as number) - 20 - pipVerticalDistance,
);

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
  bird.setGravityY(400);

  upperPipe = this.physics.add
    .sprite(pipeX, pipVerticalPosition, "pipe")
    .setOrigin(0, 1);
  lowerPipe = this.physics.add
    .sprite(pipeX, upperPipe.y + pipVerticalDistance, "pipe")
    .setOrigin(0, 0);

  this.input.on("pointerdown", flap);
  this.input.keyboard?.on("keydown_SPACE", flap);
}

function update(): void {
  if (bird.y > gameHeight || bird.y < -bird.height) {
    restartBirdPosition();
  }
}

function restartBirdPosition(): void {
  bird.setPosition(initialBirdPosition.x, initialBirdPosition.y);
  bird.setVelocityY(0);
}

function flap(): void {
  bird.setVelocityY(-flapVelocity);
}

new Phaser.Game(config);
