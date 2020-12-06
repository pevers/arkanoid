// 0. Creating a paddle and an empty map
// 1. Moving the paddle with the mouse within world bounds
// 2. Adding a ball

var Breakout = new Phaser.Class({
  Extends: Phaser.Scene,
  onPaddle: false,

  initialize: function Breakout() {
    Phaser.Scene.call(this, { key: "breakout" });
    this.paddle;
  },

  preload: function () {
    // Load the paddle
    this.load.image({
      key: "paddle1",
      url: "../assets/paddle1.png",
    });

    // Load the ball
    this.load.image({
      key: "ball1",
      url: "../assets/ball1.png",
    });
  },

  create: function () {
    // Lower bottom should not collide
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Add the paddle
    this.paddle = this.physics.add.image(400, 550, "paddle1");

    // Should not be moved by other objects (try turning it off!)
    this.paddle.setImmovable(true);

    // Should stay within our "world"
    this.paddle.setCollideWorldBounds(true);

    // Add the ball
    this.ball = this.physics.add
      .image(400, 500, "ball1")
      .setCollideWorldBounds(true)
      .setBounce(1);

    // Add physics between paddle and ball
    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Factory.html
    // Arguments:
    // 1. First object
    // 2. Second object
    // 3. collideCallback (method to call)
    // 4. processCallback
    // 5. callbackContext (scope)
    this.physics.add.collider(
      this.ball,
      this.paddle,
      this.hitPaddle,
      null,
      this
    );

    //  Input events
    this.input.on(
      "pointermove",
      function (pointer) {
        //  Keep the paddle within the game
        this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

        if (this.onPaddle) {
          this.ball.x = this.paddle.x;
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      function (pointer) {
        if (this.onPaddle) {
          this.ball.setVelocity(-75, -300);
          this.onPaddle = false;
        }
      },
      this
    );
  },

  hitPaddle: function (ball, paddle) {
    var diff = 0;

    if (ball.x < paddle.x) {
      //  Ball is on the left-hand side of the paddle
      diff = paddle.x - ball.x;
      ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
      //  Ball is on the right-hand side of the paddle
      diff = ball.x - paddle.x;
      ball.setVelocityX(10 * diff);
    } else {
      //  Ball is perfectly in the middle
      //  Add a little random X to stop it bouncing straight up!
      ball.setVelocityX(2 + Math.random() * 8);
    }
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
