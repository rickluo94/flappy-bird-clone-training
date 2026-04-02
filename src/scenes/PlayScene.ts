import Phaser from "phaser";
import type { SharedConfig } from "../types/sharedConfig";

class PlayScene extends Phaser.Scene {
  private config: SharedConfig;
  private bird?: Phaser.Physics.Arcade.Sprite;
  private pipes?: Phaser.Physics.Arcade.Group;
  private velocity = 200;
  private gravityY = 400;
  private flapVelocity = 250;
  private pipesToRender = 4;
  private pipeVerticalDistanceRange = [150, 250];
  private pipeHorizontalDistanceRange = [500, 550];

  constructor(config: SharedConfig) {
    super("PlayScene");
    this.config = config;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);

    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.setGravityY(this.gravityY);

    this.pipes = this.physics.add.group();

    for (let i = 0; i < this.pipesToRender; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);

      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-this.velocity);

    this.input.on("pointerdown", () => this.flap);
    this.input.keyboard?.on("keydown_SPACE", () => this.flap);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (!this.bird) {
      console.log("update bird", undefined);
      return;
    }

    if (this.bird.y > this.config.height || this.bird.y < -this.bird.height) {
      this.restartBirdPosition();
    }

    this.recyclePipes();
  }

  private placePipe(
    uPipe: Phaser.Physics.Arcade.Sprite,
    lPipe: Phaser.Physics.Arcade.Sprite,
  ) {
    const rightMostX = this.getRightMostPipe();
    const pipVerticalDistance = Phaser.Math.Between(
      this.pipeVerticalDistanceRange[0],
      this.pipeVerticalDistanceRange[1],
    );

    const pipVerticalPosition = Phaser.Math.Between(
      0 + 20,
      (this.config.height as number) - 20 - pipVerticalDistance,
    );

    const pipeHorizontalDistance = Phaser.Math.Between(
      this.pipeHorizontalDistanceRange[0],
      this.pipeHorizontalDistanceRange[1],
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipVerticalDistance;
  }

  private getRightMostPipe(): number {
    const pipeChildren = (this.pipes?.getChildren() ??
      []) as Phaser.Physics.Arcade.Sprite[];

    return pipeChildren.reduce((rightMostX, pipe) => {
      return Math.max(rightMostX, pipe.x);
    }, 0);
  }

  private restartBirdPosition(): void {
    if (!this.bird) {
      console.log("restartBirdPosition bird", undefined);
      return;
    }

    this.bird.setPosition(
      this.config.startPosition.x,
      this.config.startPosition.y,
    );
    this.bird.setVelocityY(0);
  }

  private recyclePipes(): void {
    let tempPipes = [] as Phaser.Physics.Arcade.Sprite[];
    const pipeChildren = (this.pipes?.getChildren() ??
      []) as Phaser.Physics.Arcade.Sprite[];

    pipeChildren.forEach((pip) => {
      if (pip.getBounds().right <= 0) {
        tempPipes.push(pip);
        if (tempPipes.length == 2) {
          this.placePipe(tempPipes[0], tempPipes[1]);
        }
      }
    });
  }

  private flap(): void {
    if (!this.bird) {
      console.log("flap bird", undefined);
      return;
    }

    this.bird.setVelocityY(-this.flapVelocity);
  }
}

export default PlayScene;
