/* 
 * TORP - Test #2
 * Better Collision Detection and overall game feel.
 * By Ryan Sandor Richards and Thomas Alexander O'Neil
 */
var Test2 = (function(WIDTH, HEIGHT) {
  // Create the Gury instance
  var g = $g().size(WIDTH, HEIGHT).background('black');
  
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
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  };
  
  /**
   * Platforms
   * @param x X-coordinate in pixels.
   * @param y Y-coordinate in pixels.
   * @param w Width of platform in blocks (32x32 pixels)
   * @param h Height of platform in blocks (32x32 pixels)
   */
  function Platform(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  Platform.prototype.draw = function(ctx, canvas) {
    var sx;
    for (var x = 0; x < this.w; x++) {
      if (x == 0)               sx = 0;
      else if (x == this.w - 1) sx = 3;
      else if (x % 2 == 1)      sx = 1;
      else                      sx = 2;
      ctx.drawImage(blockSprites, sx*32, 0, 32, 32, this.x + x*32, this.y, 32, 32);
    }
  }
  
  /**
   * Handles the game's physics calculations.
   */
  var Physics = (function() {
    
    function update() {
      
    }
    
    // Public interface
    return { update: update };
  })();
  
  
  /**
   * Initalizes and runs the game.
   */
  function init() {
    // Add the player
    //g.add('player', Player);
    
    // Add some platforms
    g.add('platform', new Platform(320, 320, 10, 1));
    g.add('platform', new Platform(64, 160, 5, 1));
    g.add('platform', new Platform(500, 80, 3, 1));
    g.add('platform', new Platform(0, HEIGHT-32, WIDTH/32, 1));
        
    // Physics Magic
    //g.add('physics', Physics);
    
    // Begin the game loop
    g.place('#game_container').play(32);
  }
  
  // Load spritemap and begin the game
  var sprites = new Image(),
    blockSprites = new Image();
  
  sprites.onload = function() {
    blockSprites.src = "BlockTime.png";
  }
  
  blockSprites.onload = init;
  
  sprites.src = 'SpriteMapBlobGuy.png';
})(800, 480);


