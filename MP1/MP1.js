/**
 * @file A simple WebGL example drawing a triangle with colors
 * @author Chenhan Xu <chenhan2@eillinois.edu>
 * 
 * Updated Spring 2021 to use WebGL 2.0 and GLSL 3.00
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/** @global The vertex array object for the triangle */
var vertexArrayObject;

/** @global The rotation angle of our triangle */
var rotAngle = 0;

/** @global The ModelView matrix contains any modeling and viewing transformations */
var modelViewMatrix = glMatrix.mat4.create();

/** @global Records time last frame was rendered */
var previousTime = 0;

/** @global The original shape of I logo */
var verticesAbs = [
  -0.6,  0.6,  0.0,
  -0.6,  1.0,  0.0,
  -0.2,  0.6,  0.0,
  
  -0.6,  1.0,  0.0,
  -0.2,  0.6,  0.0,
   0.6,  1.0,  0.0,

  -0.2,  0.6,  0.0,
   0.2,  0.6,  0.0,
   0.6,  1.0,  0.0,

   0.2,  0.6,  0.0,
   0.6,  1.0,  0.0,
   0.6,  0.6,  0.0,

  -0.2,  0.6,  0.0,
   0.2,  0.6,  0.0,
   0.2, -0.6,  0.0,
   
  -0.2,  0.6,  0.0,
  -0.2, -0.6,  0.0,
   0.2, -0.6,  0.0,
   
  -0.6, -0.6,  0.0,
  -0.2, -0.6,  0.0,
  -0.6, -1.0,  0.0,
  
   0.6, -1.0,  0.0,
  -0.2, -0.6,  0.0,
  -0.6, -1.0,  0.0,
  
   0.2, -0.6,  0.0,
  -0.2, -0.6,  0.0,
   0.6, -1.0,  0.0,
   
   0.2, -0.6,  0.0,
   0.6, -0.6,  0.0,
   0.6, -1.0,  0.0
];

/** @global The time step to control the transformation of logo */
var step = 0.0;

/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}


/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var context = null;
  context = canvas.getContext("webgl2");
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}


/**
 * Loads a shader.
 * Retrieves the source code from the HTML document and compiles it.
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
    
  var shaderSource = shaderScript.text;
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}


/**
 * Set up the fragment and vertex shaders.
 */
function setupShaders() {
  // Compile the shaders' source code.
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  // Link the shaders together into a program.
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  // We only use one shader program for this example, so we can just bind
  // it as the current program here.
  gl.useProgram(shaderProgram);
    
  // Query the index of each attribute in the list of attributes maintained
  // by the GPU. 
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, "aVertexPosition");
  shaderProgram.vertexColorAttribute =
    gl.getAttribLocation(shaderProgram, "aVertexColor");
    
  //Get the index of the Uniform variable as well
  shaderProgram.modelViewMatrixUniform =
    gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
}


/**
 * Set up the buffers to hold the triangle's vertex positions and colors.
 */
function setupBuffers() {
    
  // Create the vertex array object, which holds the list of attributes for
  // the triangle.
  vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject); 

  // Create a buffer for positions, and bind it to the vertex array object.
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

  // Decide which image to draw
  if (document.getElementById("I").checked == true) {
    // Define the I in clip coordinates with directly changing the positions.
    var vertices = [];
    x = 0.5 * Math.cos(degToRad(5 * step));
    y = 0.5 * Math.sin(degToRad(4 * step));
    for (var i = 0; i < 30; i++){
      //add the vertex coordinates to the array
      vertices.push(verticesAbs[3 * i] + x);
      vertices.push(verticesAbs[3 * i + 1] + y);
      vertices.push(0.0);
    }

    // Update the time step variable.
    step = step + 1;
    if (step >= 360.0)
      step = 0.0;

    // Populate the buffer with the position data.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numberOfItems = 30;
  }
  else {
    // Define the original image in clip coordinates.
    var vertices = [
       0.0,  0.0,  0.0,

       0.6,  0.0,  0.0,
       0.6,  0.6,  0.0,
        
       0.2,  0.2,  0.0,
       0.0,  0.6,  0.0,

       0.0,  0.6,  0.0,
      -0.6,  0.6,  0.0,
      
      -0.2,  0.2,  0.0,
      -0.6,  0.0,  0.0,

      -0.6,  0.0,  0.0,
      -0.6, -0.6,  0.0,

      -0.2, -0.2,  0.0,
       0.0, -0.6,  0.0,
        
       0.0, -0.6,  0.0,
       0.6, -0.6,  0.0,

       0.2, -0.2,  0.0,
       0.6,  0.0,  0.0,
    ];

    // Populate the buffer with the position data.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numberOfItems = 17;
  }
  
  // Binds the buffer that we just made to the vertex position attribute.
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
                         
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  // Do the same steps for the color buffer.
  if (document.getElementById("I").checked == true) {
    var colors = [
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0,
        0.9098, 0.2902, 0.1529, 1.0
      ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numberOfItems = 30;  
  }
  else {
    // Define colors that gradually change
    var colors = [1.0, 1.0, 1.0, 1.0];
    for (var i = 0; i < 8; i++){
      //add the vertex colors to the array
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45)));
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45 + 120)));
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45 + 240)));
      colors.push(1);
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45)));
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45 + 120)));
      colors.push(0.5 + 0.5 * Math.sin(degToRad(step + i * 45 + 240)));
      colors.push(1);
    }
    // Update step variable
    var speed = document.getElementById("speed").value;
    step = step + speed / 30;
    if (step >= 360.0)
      step = 0.0;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numberOfItems = 17;  
  }
  
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                         vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Enable each attribute we are using in the VAO.  
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // Unbind the vertex array object to be safe.
  gl.bindVertexArray(null);
}

/**
 * Draws a frame to the screen.
 */
function draw() {
  // Transform the clip coordinates so the render fills the canvas dimensions.
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  // Clear the screen.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use the vertex array object that we set up.
  gl.bindVertexArray(vertexArrayObject);
    
  // Send the ModelView matrix with our transformations to the vertex shader.
  gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform,
                      false, modelViewMatrix);
    
  // Render the image. 
  if (document.getElementById("I").checked == true) {
    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
  }
  else {
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexPositionBuffer.numberOfItems);
  }

  // Unbind the vertex array object to be safe.
  gl.bindVertexArray(null);
}

/**
 * Animates the Illinois logo by updating the ModelView matrix with a rotation
 * each frame.
 */
 function animate(currentTime) {
  // Read the speed slider from the web page.
  var speed = document.getElementById("speed").value;

  // Convert the time to seconds.
  currentTime *= 0.001;
  // Subtract the previous time from the current time.
  var deltaTime = currentTime - previousTime;
  // Remember the current time for the next frame.
  previousTime = currentTime;
  
  
  // Update geometry to rotate 'speed' degrees per second.
  rotAngle += speed * deltaTime;
  if (rotAngle > 360.0)
    rotAngle = 0.0;
  glMatrix.mat4.fromZRotation(modelViewMatrix, degToRad(rotAngle));

  // Decide which image to draw
  if (document.getElementById("I").checked == true) {
    // If drawing the I logo, update geometry to scale the logo based on the rotation speed.
    var scaleVector = glMatrix.vec3.create();
    var scaler = 0.2 * Math.cos(degToRad(rotAngle)) + 0.4;
    glMatrix.vec3.set(scaleVector, scaler, scaler, scaler)
    glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, scaleVector);
  }

  setupBuffers();     

  // Draw the frame.
  draw();
  
  // Animate the next frame. The animate function is passed the current time in
  // milliseconds.
  requestAnimationFrame(animate);
}

/**
 * Startup function called from html code to start the program.
 */
 function startup() {
  console.log("Starting animation...");
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(animate); 
}

