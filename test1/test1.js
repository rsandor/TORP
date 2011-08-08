window.VGP = (function() {
  var WIDTH = 800,
    HEIGHT = 480;
  
  
  /*
   * The dude abides.
   */
  var dude = {
    x: 0, y: 0,
    dx: 0, dy: 0,
    dx2: 0, dy2: 0,
    frame: 0,
    state: 'walking',
    
    // Draw method for our dude
    draw: function(ctx, canvas) {
      this.setState();
      
      if (this.state == 'standing') {
        ctx.drawImage(sprites, 0, 0, 32, 32, this.x, this.y, 32, 32);
      }
      else if (this.state == 'walking') {
        if (this.frame < 8) {
          ctx.drawImage(sprites, 32, 0, 32, 32, this.x, this.y, 32, 32);
        }
        else {
          ctx.drawImage(sprites, 64, 0, 32, 32, this.x, this.y, 32, 32);
        }
      }
      else if (this.state == 'jumping') {
        ctx.drawImage(sprites, 96, 0, 32, 32, this.x, this.y, 32, 32);
      }
      else if (this.state == 'falling') {
        ctx.drawImage(sprites, 128, 0, 32, 32, this.x, this.y, 32, 32);
      }
      else if (this.state == 'crouching') {
        ctx.drawImage(sprites, 160, 0, 32, 32, this.x, this.y, 32, 32);
      }
      
      // Update key-frame
      this.frame = (this.frame+1) % 16;    
    },
    
    // Detemines the state
    setState: function() {
      if (this.dx == 0 && this.dy == 0) {
        if (keymap[DOWN]) {
          this.state = 'crouching';
        }
        else {
          this.state = 'standing';
        }
      }
      else if (this.dy < 0) {
        this.state = 'jumping';
      }
      else if (this.dy > 0) {
        this.state = 'falling';
      }
      else {
        this.state = 'walking';
      }
    }
  };
  
  
  /*
   * Platform Class
   */
  function Platform(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }
  
  Platform.prototype.draw = function(ctx, canvas) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  
  
  /*
   * Key Event Listeners
   * 
   * 37 - Left
   * 38 - Up
   * 39 - Right
   * 40 - Down
   * 90 - "z"
   *
   */
  var keymap = {},
   LEFT = 37,
   RIGHT = 39,
   UP = 38,
   DOWN = 40;
   
  $(window).keydown(function(e) {
    keymap[e.keyCode] = true;
  });
  
  $(window).keyup(function(e) {
    keymap[e.keyCode] = false;
  });  
  
  /*
   * Initializes and starts the game
   */
  function init() {
    // Setup the gury instance
    var g = $g().size(WIDTH, HEIGHT).background('black').place('#game_container');

    // Add Objects
    g.add('dude', dude);
    g.add('platform', new Platform(320, 320, 320, 128, 'blue'));
    g.add('platform', new Platform(64, 160, 160, 32, 'darkblue'));
    g.add('platform', new Platform(500, 80, 80, 32, 'darkgreen'));
    g.add('platform', new Platform(0, HEIGHT-32, WIDTH, 32, 'darkred'));

    //g.add(function(ctx) {  ctx.drawImage(sprites, 0, 0); });

    // Animate the game at 30 FPS
    g.play(32);
    
    // Handle player movement
    g.add({
      heading: 1,
      max_acc: 1,
      max_vel: 10,

      update: function() {

        // Handle X axis
        if ( keymap[LEFT] ) {
          dude.dx2 = -this.max_acc;
        }
        else if ( keymap[RIGHT] ) {
          dude.dx2 = this.max_acc;
        }
        else {
          if (dude.dx < 0.5 && dude.dx > -0.5) {
            dude.dx2 = 0;
            dude.dx = 0;
          }
          else if (dude.dx > 0)
            dude.dx2 = -this.max_acc/2;
          else if (dude.dx < 0)
            dude.dx2 = this.max_acc/2;
          else
            dude.dx2 = 0;
        }

        dude.dx += dude.dx2;
        if (dude.dx > this.max_vel)
          dude.dx = 7;
        else if (dude.dx < -this.max_vel)
          dude.dx = -7

        dude.x += dude.dx;

        // Handle Y Axis

        //console.log(dude.y);

        var onSomething = false;

        g.each('platform', function(object) {
          if (dude.x > object.x - 32 && dude.x < object.x + object.w) {

            if (dude.y + 32 >= object.y && dude.y + 32 <= object.y + object.h) {
              if (dude.dy >= 0) {
                dude.dy2 = 0;
                dude.dy = 0;
                dude.y = object.y - 32;
                onSomething = true;
              }
            }
            else if (dude.y >= object.y && dude.y <= object.y + object.h) {
              if (dude.dy < 0) {
                dude.y = object.y + object.h + 1;
                dude.dy = 0;
                dude.dy2 = 0;
              }
            }

            
          }
        });

        if (!onSomething) {
          dude.dy2 = 1;
        }
        else {
          if ( keymap[90] ) {
            dude.dy = -18;
          }
        }

        dude.dy += dude.dy2;
        dude.y += dude.dy;
      }
    });
  }
  
  
  /*
   * Load the sprites and go!
   */
  var sprites = new Image();
  sprites.onload = init;
  sprites.src = 'SpriteMapBlobGuy.png';
  
  
  // Public Interface
  return {};
})();