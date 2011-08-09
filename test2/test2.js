/* 
 * TORP - Test #2
 * Better Collision Detection and overall game feel.
 * By Ryan Sandor Richards and Thomas Alexander O'Neil
 */
var Test2 = (function(WIDTH, HEIGHT) {
  // Sprite Maps
  var sprites, blockSprites;
  
  
  
  
  // Create the Gury instance
  var g = $g().size(WIDTH, HEIGHT).background('black url(background.png) top left');
  
  /**
   * The player model
   */
  var Player = {
    // Position
    x: 0, y: 0,
    dx: 0, dy: 0,
    dx2: 0, dy2: 0,
    
    // Dimension
    w: 32, h: 32,
    
    // Rendering
    draw: function(ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  };
  
  /**
   * Platforms
   * @param x X-coordinate in pixels.
   * @param y Y-coordinate in pixels.
   * @param w Width in pixels;
   * @param h Height in pixels;
   */
  function Platform(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  Platform.prototype.draw = function(ctx, canvas) {
    var sx;
    for (var x = 0; x < this.w/32; x++) {
      if (x == 0)               sx = 0;
      else if (x == this.w - 1) sx = 3;
      else if (x % 2 == 1)      sx = 1;
      else                      sx = 2;
      ctx.drawImage(blockSprites, sx*32, 0, 32, 32, this.x + x*32, this.y, 32, 32);
    }
  };
  
  /**
   * Handles the game's physics calculations.
   */
  var Physics = (function() {
    // Velocity & Accelleration Constants
    var MAX_X_ACC = 0.77,
        MAX_X_DEC = 1.5 * MAX_X_ACC,
        MAX_X_VEL = 8;
    
    function collision(a, b) {
    }
    
    /**
     * Handle user input and horizontal character movement.
     */
    function horizontalPlayerMovement() {
      // Compute accelleration
      if (Keyboard.down(Key.LEFT)) {
        Player.dx2 = -MAX_X_ACC;
      }
      else if (Keyboard.down(Key.RIGHT)) {
        Player.dx2 = MAX_X_ACC;
      }
      else {
        if (Player.dx < MAX_X_DEC && Player.dx > -MAX_X_DEC) {
          Player.dx2 = 0;
          Player.dx = 0;
        }
        else if (Player.dx > 0)
          Player.dx2 = -MAX_X_DEC;
        else if (Player.dx < 0)
          Player.dx2 = MAX_X_DEC;
        else
          Player.dx2 = 0;
      }
      
      // Compute & cap velocity
      Player.dx += Player.dx2;
            
      if (Player.dx > MAX_X_VEL) {
        Player.dx = MAX_X_VEL;
      }
      else if (Player.dx < -MAX_X_VEL) {
        Player.dx = -MAX_X_VEL
      }
    }
    
    /**
     * Main Physics Update Loop.
     */
    function update() {
      horizontalPlayerMovement();
      
        
      Player.x += Player.dx;  
    }
    
    // Public interface
    return { update: update };
  })();
  
  
  /**
   * Initalizes and runs the game.
   */
  function init(maps) {
    sprites = maps['SpriteMapBlobGuy.png'];
    blockSprites = maps['BlockTime.png'];
    
    // Add the player
    g.add('player', Player);
    
    // Add some platforms
    g.add('platform', new Platform(320, 320, 320, 32));
    g.add('platform', new Platform(64, 160, 160, 32));
    g.add('platform', new Platform(500, 80, 96, 32));
    g.add('platform', new Platform(0, HEIGHT-32, WIDTH, 32));
        
    // Physics Magic
    g.add('physics', Physics);
    
    // Begin the game loop
    g.place('#game_container').play(32);
  }
  
  // Load spritemap and begin the game
  Torp.loadImages(['SpriteMapBlobGuy.png', 'BlockTime.png'], init);
})(800, 480);


