/* 
 * TORP - Test 4
 * Bitmap Collision Detection
 *
 * Run in the project directory:
 * python -m SimpleHTTPServer 8000
 *
 * Test via:
 * http://localhost:8000/test4/
 *
 */
var Test2 = (function(WIDTH, HEIGHT) {
  // Sprite Maps
  var blockSprites, playerSprites, hitmapImage;
  
  // Create the Gury instance
  var g = $g().size(WIDTH, HEIGHT).background('black');
  
  
  
  var Hitmap = (function() {
    var image, canvas, ctx, map;
    
    function init(hmi) {
      image = hmi;
      
      canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      map = ctx.getImageData(0, 0, image.width, image.height);
    }  
    
    
    function hit(x, y, w, h) {
      //x = Math.round(x);
      //y = Math.round(y);
      
      for (var ix = x|0; ix < x + w; ix++)
      for (var iy = y|0; iy < y + h; iy++) {
        if (map.data[4*(image.width*iy+ix)|0] == 255)
          return true;
      }
      return false;
    }
    
    
    function checkHit(player) {
      var x = player.x,
        y = player.y,
        w = player.w,
        h = player.h,
        dx = player.dx,
        dy = player.dy;
      
      
      
      
      if ( hit(x + dx, y + dy, w, h) ) {
      
        var ndx = dx,
            ndy = dy;
        
        //console.log(ndx + ", " + ndy);
        
        
        /*
        for (var w = 0; w < 100; w++) {
          ndy += (dy < 0) ? 1 : -1;
          console.log(ndy);
          if (!hit(x + dx, y + ndy, w, h)) {
            console.log('we are out!');
            player.y = y + Math.round(ndy);
            player.dy = 0;
            player.grounded = (dy > 0);
            break;
          }
        } 
        */ 
        
        
        
        // "Kinda" works
        while (Math.abs(dy) > 0 || Math.abs(dx) > 0) {
          dy /= 2;
          if (Math.abs(dy) < 1)
            dy = 0;
          dx /= 2;
          if (Math.abs(dx) < 1)
            dx = 0;
          //dy -= dy > 0 ? Math.min(0.5, dy) : Math.max(-0.5, dy);
          if (!hit(x + dx, y + dy, w, h)) {
            player.y = y + dy;
            player.x = x + dx;
            player.dy = 0;
            player.dx = 0;
            player.grounded = true;
            break;
          }
        }
        
        
        /*
        while (Math.abs(dx) >= 1 && Math.abs(dy) >= 1) {
          
          dx += (dx > 0) ? -1 : 1;
          dy += (dy > 0) ? -1 : 1;
          
          if (!hit(x + dx, y+dy, w, h)) {
            console.log('holyshit');
          }
        }
        */
       
        
        
      }
      
      /*
      if ( hit(x + dx, y + dy, w, h) ) {
        var ndx = (dx / 2)|0, 
            ndy = (dy / 2)|0, 
            k = 4,
            iters = 40;
        
        while (iters > 0) {
          iters--;
          
          console.log('fuuuck');
          
          var nx = x + ndx,
              ny = y + ndy;
          
          if ( hit(nx, ny, w, h) ) {
            ndx -= (dx / k) | 0;
            ndy -= (dy / k) | 0;
          }
          else {
            ndx += (dx / k) | 0;
            ndy += (dy / k) | 0;
            
            if (ndx <= 1 || ndy <= 1) {
              player.x = nx;
              player.y = ny;
              
              player.dx = 0;
              player.dy = 0;
              player.grounded = true;
            }
            
          }
          
          k *= 2;
        }
  
    
      }
      */
      
      return false;
    }
    
    return {
      draw: function(ctx) {
        ctx.drawImage(image, 0, 0);
      },
      init: init,
      hit: checkHit
    };
  })();
  
  
  
  /**
   * The player model
   */
  var Player = {
    // Position
    x: 48, y: 192,
    dx: 0, dy: 0,
    dx2: 0, dy2: 0,
    
    // Various state variables
    grounded: false,
    
    // Dimension
    w: 8, h: 16,
    
    // Sprite animation
    frame: 0,
    direction: 0,
    maxFrame: 16,
    
    // Rendering
    draw: function(ctx) {
      var sx = 0, sy = 0;
      
      // Determine direction
      if (Keyboard.down(Key.LEFT))
        this.direction = 1;
      else if (Keyboard.down(Key.RIGHT))
        this.direction = 0;
      
    
      // Walking / Standing
      if (this.grounded && this.dx != 0) {
        if        (this.frame < 4)  sx = 0;
        else if   (this.frame < 8)  sx = 1;
        else if   (this.frame < 12) sx = 0;
        else if   (this.frame < 16)  sx = 2;
      }
      else if (this.grounded && Keyboard.down(Key.UP)) {
        sx = 3;
      }
      else if (this.grounded && Keyboard.down(Key.DOWN)) {
        sx = 6;
      }
      
      // Jumping 
      if (!this.grounded) {
        sx = Keyboard.down(Key.UP) ? 5 : 1;
      }
      
      ctx.drawImage(playerSprites, 16*sx, 16*this.direction, 16, 16, this.x-(this.w / 2), this.y, 16, 16);
      
      //ctx.fillStyle = 'red';
      //ctx.fillRect(this.x, this.y, this.w, this.h);
      
      // Increment the frame counter
      this.frame = (this.frame + 1) % this.maxFrame;
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
    
    for (var x = 0; x < this.w; x += 16)
    for (var y = 0; y < this.h; y += 16) {
      ctx.drawImage(blockSprites, 0, 0, 16, 16, this.x + x, this.y + y, 16, 16);
    }
  };
  
  function Background(x, y, w, h, s) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sprite = typeof s == "undefined" ? 32 : s;
  }
  
  Background.prototype.draw = function(ctx, canvas) {
    for (var x = 0; x < this.w; x += 16) {
      for (var y = 0; y < this.h; y += 16) {
        ctx.drawImage(blockSprites, this.sprite, 0, 16, 16, this.x + x, this.y + y, 16, 16);
      }
    }
  };
  
  
  /**
   * Handles the game's physics calculations.
   */
  var Physics = (function() {
    var // Horizontal Movement constants
        MAX_X_ACC = 0.37,
        MAX_X_DEC = 1.5 * MAX_X_ACC,
        MAX_X_VEL = 4,
        // Vertical movement constants
        MAX_Y_ACC = 0.5,
        MAX_Y_VEL = 10,
        MAX_Y_JUMP = 8.2;
    
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
        Player.dx = -MAX_X_VEL;
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
      
      // Check for platform collisions
      g.each('platform', function(platform) {
        var hit = collision(Player, platform);
        //platform.hit = hit;
        
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
      
      
      // Check for hitmap collisions
      if (Hitmap.hit(Player)) {
        console.log('hit');
      }
      
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
    playerSprites = maps['player.png'];
    blockSprites = maps['blocks.png'];
    hitmapImage = maps['test_hitmap.png'];
    
    // initalize the hitmap
    Hitmap.init(hitmapImage);
    
    // Add some background pillars
    
    /*
    g.add('background', new Background(272, 48, 32, 106));
    g.add('background', new Background(176, 176, 128, 32));
    g.add('background', new Background(80, 106, 64, 106));
    
    
    
    // Add some platforms and backgrounds
    g.add('platform', new Platform(160, 160, 160, 16));
    g.add('platform', new Platform(64, 90, 96, 16));
    g.add('platform', new Platform(256, 32, 64, 16));
    
    g.add('platform', new Platform(272, 96, 32, 47));
    */
    
    
    g.add('hitmap', Hitmap);
    g.add('player', Player);
    g.add('platform', new Platform(0, 240-32, 400, 16));
      
      
        
    // Physics Magic
    g.add('physics', Physics);
    
    // Holy Shit Scale that bitch!
    g.addTransform({
      up: function(ctx) {
        ctx.save();
        ctx.scale(3, 3);
      },
      down: function(ctx) {
        ctx.restore();
      }
    });
    
    // Begin the game loop
    g.place('#game_container').play(32);
  }
  
  // Load spritemap and begin the game
  Torp.loadImages(['test_hitmap.png', 'player.png', 'blocks.png'], init);
})(1200, 672);


