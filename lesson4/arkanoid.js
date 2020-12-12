// 0. Creating a paddle and an empty map
// 1. Moving the paddle with the mouse within world bounds
// 2. Adding a ball
// 3. Adding bricks (maybe organize code a bit better?)
// 4. Adding scores

var Breakout = new Phaser.Class({
  Extends: Phaser.Scene,
  lives: 3,
  score: 0,
  onPaddle: true,

  initialize: function Breakout() {
    Phaser.Scene.call(this, { key: "breakout" });
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

    this.load.image({
      key: "blue1",
      url: "../assets/blue1.png",
    });
  },

  create: function () {
    // Lower bottom should not collide
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Add the paddle
    this.paddle = this.physics.add.image(400, 550, "paddle1");

    // Add bricks
    this.bricks = this.physics.add.staticGroup({
      key: "blue1",
      frameQuantity: 30,
      gridAlign: {
        width: 10,
        height: 3,
        cellWidth: 64,
        cellHeight: 32,
        x: 112,
        y: 100,
      },
    });

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

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitBricks,
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

    this.liveText = this.add.text(0, 0, "Lives: " + this.lives);
    this.scoreText = this.add.text(0, 15, "Score: " + this.score);
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

  hitBricks: function (ball, brick) {
    brick.disableBody(true, true);
    this.score += 10;

    if (this.bricks.countActive() === 0) {
      this.resetLevel();
    }
  },

  resetBall: function () {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, 500);
    this.onPaddle = true;
  },

  resetLevel: function () {
    this.resetBall();

    this.bricks.children.each(function (brick) {
      brick.enableBody(false, 0, 0, true, true);
    });
  },

  update: function () {
    // Update text on the screen
    this.liveText.setText("Lives: " + this.lives);
    this.scoreText.setText("Score: " + this.score);

    if (this.ball.y > 600) {
      console.log("You lost a live!");

      this.resetBall();

      // Update score
      this.lives--;

      // Check if the game is done
      if (this.lives === 0) {
        // Game over!
        alert("Game over! Your score: " + this.score);
        this.resetLevel();
        this.lives = 3;
        this.score = 0;
      }
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
