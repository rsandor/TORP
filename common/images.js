/*
 * Image loader utility.
 * @author Ryan Sandor Richards
 */
var Torp = Torp || {};

/**
 * Loads a bunch of images and fires the callback when they've all completed.
 * @param images List of filenames to load.
 * @param callback Fired when loading is complete.
 */
Torp.loadImages = function(images, callback) {
  var loaded = 0,
    imageMap = {};
  
  for (var i = 0; i < images.length; i++) {
    var img = new Image();
    imageMap[images[i]] = img;
    img.onload = function() {
      loaded++;
      if (loaded == images.length) {
        callback(imageMap);
      }
    };
    img.src = images[i];
  }
};

