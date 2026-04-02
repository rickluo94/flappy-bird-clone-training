import Phaser from "phaser";

import PlayScene from "./scenes/PlayScene";
import type { SharedConfig } from "./types/sharedConfig";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BIRD_POSITION = { x: GAME_WIDTH * 0.1, y: GAME_HEIGHT / 2 };

const SHARED_CONFIG: SharedConfig = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: BIRD_POSITION,
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

new Phaser.Game(config);
