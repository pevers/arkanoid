// 0. Creating a paddle and an empty map

var Breakout = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function Breakout() {
    Phaser.Scene.call(this, { key: "breakout" });
    this.paddle;
  },

  preload: function () {
    this.load.image({
      key: "paddle1",
      url: "../assets/paddle1.png",
    });
  },

  create: function () {
    // Doc: https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Factory.html
    // Add the paddle to the world
    // add.image(x, y, texture)
    this.paddle = this.physics.add.image(400, 550, "paddle1");
  },
});

var config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: "phaser-example",
  scene: [Breakout],
  physics: {
    default: "arcade",
  },
};

var game = new Phaser.Game(config);
