/**
 * @file MP4Credit.js - A simple WebGL rendering engine
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Starter code for CS 418 4CreditMP at the University of Illinois at
 * Urbana-Champaign.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

/** @global The HTML5 canvas to draw on */
var canvas;

/** @global The canvas context */
var ctx;

/** @global The array of colors for all pixels */
var pixelColor;

/** @global The number of samples of rays to generate the color of a pixel */
var samples_per_pixel = 100;

/** @global The maximum recursion depth to generate the color of a pixel */
var max_depth = 50;

/** @global The aspect ratio of the view port and the scene */
var aspect_ratio = 16.0 / 9.0;


//-----------------------------------------------------------------------------
// Setup functions (run once)
/**
 * Startup function called from the HTML code to start program.
 */
function startup() {
  // Image
  canvas = document.getElementById("glCanvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');
  pixelColor = Array(canvas.width * canvas.height).fill(0);

  // World
  var world = random_scene();

  // Camera

  var lookfrom = glMatrix.vec3.fromValues(-10,5,11);
  var lookat = glMatrix.vec3.fromValues(0,0,0);
  var vup = glMatrix.vec3.fromValues(0,1,0);
  var dist_to_focus = 10.0;
  var aperture = 0.1;

  var cam = new Camera(lookfrom, lookat, vup, 20, aspect_ratio, aperture, dist_to_focus);

  // Render

  for (let j = canvas.height - 1; j >= 0; j--) {
    for (let i = canvas.width - 1; i >= 0; i--) {
      var color = glMatrix.vec3.create();
      
      for (let s = 0; s < samples_per_pixel; s++) {
        var u = (i + random_double(0, 1)) / (canvas.width - 1);
        var v = (j + random_double(0, 1)) / (canvas.height - 1);
        var r = cam.get_ray(u, v);
        glMatrix.vec3.add(color, color, ray_color(r, world, max_depth));
      }

      var position = glMatrix.vec2.fromValues(i, j);
      paintPixel(color, position, samples_per_pixel);
    }
  }
  draw();
}

function random_scene() {
  var world = new HittableList();

  var material_ground = new Lambertian(glMatrix.vec3.fromValues(0.5, 0.5, 0.5));
  world.add(new Sphere(glMatrix.vec3.fromValues( 0,-1000,0), 1000, material_ground));

  for (let a = -5; a < 5; a++) {
    for (let b = -5; b < 5; b++) {
      var choose_material = random_double(0, 1);
      var center = glMatrix.vec3.fromValues(a + 0.9 * random_double(0, 1), 0.2, b + 0.9 * random_double(0, 1));

      var tmp = glMatrix.vec3.create();
      glMatrix.vec3.subtract(tmp, center, glMatrix.vec3.fromValues(4, 0.2, 0));
      if (glMatrix.vec3.length(tmp) > 0.9) {
        var material_sphere = new Material();

        if (choose_material < 0.55) {
          // Lambertian
          var albedo = glMatrix.vec3.create();
          glMatrix.vec3.multiply(albedo, random_color(0, 1), random_color(0, 1));
          material_sphere = new Lambertian(albedo);
          world.add(new Sphere(center, 0.2, material_sphere));
        } else if (choose_material < 0.8) {
          // Metal
          var albedo = random_color(0.5, 1);
          var fuzz = random_double(0, 0.5);
          material_sphere = new Metal(albedo, fuzz);
          world.add(new Sphere(center, 0.2, material_sphere));
        } else if (choose_material < 0.95) {
          // Glass
          material_sphere = new Dielectric(1.5);
          world.add(new Sphere(center, 0.2, material_sphere));
        } else {
          // Light
          material_sphere = new DiffuseLight(random_color(0.5, 1));
          world.add(new Sphere(center, 0.2, material_sphere));
        }
      }
    }
  }

  var material1 = new Dielectric(1.5);
  world.add(new Sphere(glMatrix.vec3.fromValues(0, 1, 0), 1.0, material1));
  var material2 = new Lambertian(glMatrix.vec3.fromValues(0.4, 0.2, 0.1));
  world.add(new Sphere(glMatrix.vec3.fromValues(4, 1, -1), 1.0, material2));
  var material3 = new Metal(glMatrix.vec3.fromValues(0.7, 0.6, 0.5), 0.0);
  world.add(new Sphere(glMatrix.vec3.fromValues(-4, 1, 2), 1.0, material3));
  return world;
}


/**
 * Update pixel color at certain position.
 * @param {vec3} color the color to be painted.
 * @param {vec2} position the position to be painted.
 */
function paintPixel(color, position, samples_per_pixel) {
  var [ i, j ] = position;
  j = canvas.height - 1 - j;
  var [ r, g, b ] = color;
  // Add gamma correction using gamma=2 
  r = Math.sqrt(r / samples_per_pixel);
  g = Math.sqrt(g / samples_per_pixel);
  b = Math.sqrt(b / samples_per_pixel);
  pixelColor[(j * canvas.width + i) * 4    ] = Math.floor(255.999 * clamp(r, 0, 1));
  pixelColor[(j * canvas.width + i) * 4 + 1] = Math.floor(255.999 * clamp(g, 0, 1));
  pixelColor[(j * canvas.width + i) * 4 + 2] = Math.floor(255.999 * clamp(b, 0, 1));
  pixelColor[(j * canvas.width + i) * 4 + 3] = 255;
}

/**
 * Draws the image to the screen.
 * @param {array} data image data to be drawn.
 */
function draw() {
  var imageData = ctx.createImageData(canvas.width, canvas.height);
  imageData.data.set(pixelColor);
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Download the image.
 */
download_img = function(el) {
  // get image URI from canvas object
  var imageURI = canvas.toDataURL("image/jpg");
  el.href = imageURI;
};
