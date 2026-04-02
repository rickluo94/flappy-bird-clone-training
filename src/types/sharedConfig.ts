export type SharedConfig = {
  width: number;
  height: number;
  startPosition: {
    x: number;
    y: number;
  };
  velocity: number;
  gravityY: number;
  flapVelocity: number;
  bird?: Phaser.Physics.Arcade.Sprite | null;
};
