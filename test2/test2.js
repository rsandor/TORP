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
    
    // Various state variables
    grounded: false,
    
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
    this.hit = false;
  }
  
  Platform.prototype.draw = function(ctx, canvas) {
    if (this.hit) {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      return;
    }
    
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
    var // Horizontal Movement constants
        MAX_X_ACC = 0.77,
        MAX_X_DEC = 1.5 * MAX_X_ACC,
        MAX_X_VEL = 8,
        // Vertical movement constants
        MAX_Y_ACC = 1,
        MAX_Y_VEL = 20,
        MAX_Y_JUMP = 17.8;
    
    // Used to prevent auto-jumping upon landing
    var jumpFlag = true;
    
    
    /**
     * Checks to see if a collision will occur.
     *
     * TODO Needs to work for two moving objects, yo.
     *
     * @param a Moving object.
     * @param b Stationary object.
     */
    function collision(a, b) {
      var // Moving object's bounding points
          nx = a.x + a.dx,
          ny = a.y + a.dy,
          nz = nx + a.w,
          nt = ny + a.h,
          // Stationary object's bounding points 
          px = b.x,
          py = b.y,
          pz = b.x + b.w,
          pt = b.y + b.h;
      
      var hitX = (nx >= px && nx <= pz) || (nz >= px && nz <= pz),
          hitY = (ny >= py && ny <= pt) || (nt >= py && nt <= pt),
          surroundX = (nx < px && nz > pz),
          surroundY = (ny < py && nt > pt);
      
      return (hitX && hitY) || (hitX && surroundY) || (surroundX && hitY);
    }
    
    /**
     * Handle user input and horizontal character movement.
     */
    function playerX() {
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
          
        // Friction due to air should be much less
        if (!Player.grounded) {
          Player.dx2 /= 8;
        }
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
     * Handle vertical movement for the player along with user input.
     */
    function playerY() {
      // Calculate gravity and integrate vertical velocity
      Player.dy2 = MAX_Y_ACC;
      Player.dy += Player.dy2;
      
      if (Player.dy > MAX_Y_VEL) {
        Player.dy = MAX_Y_VEL;
      }
      else if (Player.dy < -MAX_Y_VEL) {
        Player.dy = -MAX_Y_VEL; 
      }
      
      // Check for jump input
      if (Player.grounded && Keyboard.down(Key.Z) && jumpFlag) {
        Player.dy = -MAX_Y_JUMP;
      }
      else if (!Player.grounded && Player.dy < 0 && !Keyboard.down(Key.Z)) {
        Player.dy += MAX_Y_ACC * 1.5;
      }
      jumpFlag = !Keyboard.down(Key.Z);
    }
    
    /**
     * Main Physics Update Loop.
     */
    function update() {
      playerX();
      playerY();
      
      // Assume the player is flailing trough the air
      Player.grounded = false;
      
      // Check for collisions
      g.each('platform', function(platform) {
        var hit = collision(Player, platform);
        platform.hit = hit;
        
        if (!hit) return;
        
        if (Player.y + Player.h <= platform.y) {
          Player.dy = 0;
          Player.y = platform.y - Player.h;
          Player.grounded = true;
        }
        else if (Player.y > platform.y + platform.h) {
          Player.dy = 0;
          Player.y = platform.y + platform.h;
        }
        else if (Player.x + Player.w <= platform.x) {
          Player.dx = 0;
          Player.x = platform.x - Player.w;
        }
        else if (Player.x >= platform.x + platform.w) {
          Player.dx = 0;
          Player.x = platform.x + platform.w;
        }
        
      });
      
      
      // "Ground" (lowest possible point)
      /*
      if (Player.y + Player.dy > 420) {
        Player.dy = 0;
        Player.y = 420;
        Player.grounded = true;
      }
      else {
        Player.grounded = false;
      }
      */
      
      // Update Player's Position
      Player.x += Player.dx;  
      Player.y += Player.dy;
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
    g.add('platform', new Platform(320, 320, 320, 16));
    g.add('platform', new Platform(64, 160, 160, 16));
    g.add('platform', new Platform(500, 80, 96, 16));
    g.add('platform', new Platform(0, HEIGHT-32, WIDTH, 16));
        
    // Physics Magic
    g.add('physics', Physics);
    
    // Begin the game loop
    g.place('#game_container').play(32);
  }
  
  // Load spritemap and begin the game
  Torp.loadImages(['SpriteMapBlobGuy.png', 'BlockTime.png'], init);
})(800, 480);


