import Phaser from "phaser";
import type { SharedConfig } from "../types/sharedConfig";

class PlayScene extends Phaser.Scene {
  private config: SharedConfig;

  constructor(config: SharedConfig) {
    super("PlayScene");
    this.config = config;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);

    this.config.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.config.bird.setGravityY(this.config.gravityY);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}

export default PlayScene;
