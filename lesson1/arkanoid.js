// 0. Creating a paddle and an empty map
// 1. Moving the paddle with the mouse within world bounds

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
    // Add the paddle
    this.paddle = this.physics.add.image(400, 550, "paddle1");
    this.paddle.setCollideWorldBounds(true);

    //  Input events
    this.input.on(
      "pointermove",
      function (pointer) {
        //  Keep the paddle within the game
        this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);
      },
      this
    );
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
