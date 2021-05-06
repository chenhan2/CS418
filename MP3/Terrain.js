/**
 * @file Terrain.js - A simple 3D terrain model for WebGL  * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Starter code for CS 418 MP2 at the University of Illinois at
 * Urbana-Champaign.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 * 
 * You'll need to implement the following functions:
 * setVertex(v, i) - convenient vertex access for 1-D array
 * getVertex(v, i) - convenient vertex access for 1-D array
 * generateTriangles() - generate a flat grid of triangles
 * shapeTerrain() - shape the grid into more interesting terrain
 * calculateNormals() - calculate normals after warping terrain
 * 
 * Good luck! Come to office hours if you get stuck!
 */

class Terrain {   
    /**
     * Initializes the members of the Terrain object.
     * @param {number} div Number of triangles along the x-axis and y-axis.
     * @param {number} minX Minimum X coordinate value.
     * @param {number} maxX Maximum X coordinate value.
     * @param {number} minY Minimum Y coordinate value.
     * @param {number} maxY Maximum Y coordinate value.
     */
     constructor(div, minX, maxX, minY, maxY) {
        this.div = div;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        
        // Allocate the vertex array
        this.positionData = [];
        // Allocate the normal array.
        this.normalData = [];
        // Allocate the triangle array.
        this.faceData = [];
        // Allocate an array for edges so we can draw a wireframe.
        this.edgeData = [];
        console.log("Terrain: Allocated buffers");
        
        this.generateTriangles();
        console.log("Terrain: Generated triangles");
        
        this.generateLines();
        console.log("Terrain: Generated lines");

        this.shapeTerrain();
        console.log("Terrain: Sculpted terrain");

        this.calculateNormals();
        console.log("Terrain: Generated normals");

        // You can use this function for debugging your buffers:
        // this.printBuffers();
    }
    

    //-------------------------------------------------------------------------
    // Vertex access and triangle generation - your code goes here!
    /**
     * Set the x,y,z coords of the ith vertex
     * @param {Object} v An array of length 3 holding the x,y,z coordinates.
     * @param {number} i The index of the vertex to set.
     */
    setVertex(v, i) {
        // MP2: Implement this function!
        this.positionData[i*3] = v[0];
        this.positionData[i*3 + 1] = v[1];
        this.positionData[i*3 + 2] = v[2];
    }
    

    /**
     * Returns the x,y,z coords of the ith vertex.
     * @param {Object} v An array of length 3 to hold the x,y,z coordinates.
     * @param {number} i The index of the vertex to get.
     */
    getVertex(v, i) {
        // MP2: Implement this function!
        v[0]=this.positionData[i*3];
        v[1]=this.positionData[i*3 + 1];
        v[2]=this.positionData[i*3 + 2];
    }


    /**
     * Set the vertex position of triangles.
     */    
    generateTriangles() {
        // MP2: Implement the rest of this function!
        var deltaX = (this.maxX - this.minX) / this.div;
        var deltaY = (this.maxY - this.minY) / this.div;
        
        for (var i = 0; i <= this.div; i++)
           for (var j = 0;j <= this.div; j++)
           { 
               this.positionData.push(this.minX + deltaX * j);
               this.positionData.push(this.minY + deltaY * i);
               this.positionData.push(0);
           }

        for (var i = 0; i < this.div; i++)
           for (var j = 0; j < this.div; j++)
           {
               var offset = i * (this.div + 1) + j;
               this.faceData.push(offset);
               this.faceData.push(offset + 1);
               this.faceData.push(offset + this.div + 1);

               this.faceData.push(offset + 1);
               this.faceData.push(offset + this.div + 2);
               this.faceData.push(offset + this.div + 1);
           }

        // We'll need these to set up the WebGL buffers.
        this.numVertices = this.positionData.length/3;
        this.numFaces = this.faceData.length/3;
    }


    /**
     * Lift or lower the terrain by a random value.
     */
    shapeTerrain() {
        // MP2: Implement this function!
        var epoch = 1000;
        var delta = 0.005;
        var H = 0;
        for (var it = 0; it < epoch; it++) {
            // Generate a random point in the range (minX, minY, 0) x (minY, maxY, 0)
            var p = glMatrix.vec2.create();
            p[0] = this.minX + Math.random() * (this.maxX - this.minX);
            p[1] = this.minY + Math.random() * (this.maxY - this.minY);
            // Generate a random normal vector for the plane (xn, yn, 0), where xn, yn are points on the unit circle
            var n = glMatrix.vec2.create();
            glMatrix.vec2.random(n);
            // Raise or lower the vertices
            for(var j = 0; j < this.numVertices; j++){
                var b = glMatrix.vec2.create();
                b[0] = this.positionData[j * 3];
                b[1] = this.positionData[j * 3 + 1];
                if ((b[0]-p[0]) * n[0] + (b[1] - p[1]) * n[1] >= 0) {
                    this.positionData[j * 3 + 2] += delta / Math.pow(2, H);
                } else {
                    this.positionData[j * 3 + 2] -= delta / Math.pow(2, H);
                }
            }
            // Update H after some iterations
            if (it % 501 == 0)
                H += 0.01;
        }
        

    }


    /**
     * Calculate average vertex normals for the shading purpose.
     */
    calculateNormals() {
        // MP2: Implement this function!
        
        for(var i = 0; i < this.numFaces * 3 * 3; i++)
            this.normalData.push(0);
        // Loop over all faces
        for(var i = 0; i < this.numFaces; i++){
            // Find the corresponding vertex indices
            var indices = [this.faceData[3 * i], this.faceData[3 * i + 1], this.faceData[3 * i + 2]];
            // Get the vertex coordinates
            var v1 = glMatrix.vec3.create();
            v1[0] = this.positionData[3 * indices[0]];
            v1[1] = this.positionData[3 * indices[0] + 1];
            v1[2] = this.positionData[3 * indices[0] + 2];
            var v2 = glMatrix.vec3.create();
            v2[0] = this.positionData[3 * indices[1]];
            v2[1] = this.positionData[3 * indices[1] + 1];
            v2[2] = this.positionData[3 * indices[1] + 2];
            var v3 = glMatrix.vec3.create();
            v3[0] = this.positionData[3 * indices[2]];
            v3[1] = this.positionData[3 * indices[2] + 1];
            v3[2] = this.positionData[3 * indices[2] + 2];
            // calculate the normal vector for the face
            var n = glMatrix.vec3.create();
            glMatrix.vec3.subtract(v2, v2, v1);
            glMatrix.vec3.subtract(v3, v3, v1);
            glMatrix.vec3.cross(n, v2, v3);
            // Update per-vertec normal
            for(var j = 0; j < indices.length; j++){
                this.normalData[3 * indices[j]] += n[0];
                this.normalData[3 * indices[j] + 1] += n[1];
                this.normalData[3 * indices[j] + 2] += n[2];
            }
         }
         // Normalize normal vectors
        for(var i = 0; i < this.numVertices; i++){
            var n = glMatrix.vec3.fromValues(this.normalData[3 * i], this.normalData[3 * i + 1], this.normalData[3 * i + 2]);
            glMatrix.vec3.normalize(n, n);
            this.normalData[3 * i] = n[0];
            this.normalData[3 * i + 1] = n[1];
            this.normalData[3 * i + 2] = n[2];
            
            glMatrix.vec3.normalize(n, n);
            this.normalData[3 * i] = n[0];
            this.normalData[3 * i + 1] = n[1];
            this.normalData[3 * i + 2] = n[2];
        }
    }


    //-------------------------------------------------------------------------
    // Setup code (run once)
    /**
     * Generates line data from the faces in faceData for wireframe rendering.
     */
    generateLines() {
        for (var f = 0; f < this.faceData.length/3; f++) {
            // Calculate index of the face
            var fid = f*3;
            this.edgeData.push(this.faceData[fid]);
            this.edgeData.push(this.faceData[fid+1]);
            
            this.edgeData.push(this.faceData[fid+1]);
            this.edgeData.push(this.faceData[fid+2]);
            
            this.edgeData.push(this.faceData[fid+2]);
            this.edgeData.push(this.faceData[fid]);
        }
    }

    getMaxElevation() {
        var maxZ = -2;
        for (var i = 0; i < this.numVertices; i++) {
            if (this.positionData[3 * i + 2] > maxZ)
                maxZ = this.positionData[3 * i + 2];
        }
        return maxZ;
    }

    getMinElevation() {
        var minZ = 2;
        for (var i = 0; i < this.numVertices; i++) {
            if (this.positionData[3 * i + 2] < minZ)
                minZ = this.positionData[3 * i + 2];
        }
        return minZ;
    }

    /**
     * Sets up the WebGL buffers and vertex array object.
     * @param {object} shaderProgram The shader program to link the buffers to.
     */
    setupBuffers(shaderProgram) {
        // Create and bind the vertex array object.
        this.vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArrayObject);

        // Create the position buffer and load it with the position data.
        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData),
                      gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = this.numVertices;
        console.log("Loaded ", this.vertexPositionBuffer.numItems, " vertices.");

        // Link the position buffer to the attribute in the shader program.
        gl.vertexAttribPointer(shaderProgram.locations.vertexPosition,
                               this.vertexPositionBuffer.itemSize, gl.FLOAT, 
                               false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.vertexPosition);
    
        // Specify normals to be able to do lighting calculations
        this.vertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData),
                      gl.STATIC_DRAW);
        this.vertexNormalBuffer.itemSize = 3;
        this.vertexNormalBuffer.numItems = this.numVertices;
        console.log("Loaded ", this.vertexNormalBuffer.numItems, " normals.");

        // Link the normal buffer to the attribute in the shader program.
        gl.vertexAttribPointer(shaderProgram.locations.vertexNormal,
                               this.vertexNormalBuffer.itemSize, gl.FLOAT, 
                               false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.vertexNormal);
    
        // Set up the buffer of indices that tells WebGL which vertices are
        // part of which triangles.
        this.triangleIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangleIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.faceData),
                      gl.STATIC_DRAW);
        this.triangleIndexBuffer.itemSize = 1;
        this.triangleIndexBuffer.numItems = this.faceData.length;
        console.log("Loaded ", this.triangleIndexBuffer.numItems, " triangles.");
    
        // Set up the index buffer for drawing edges.
        this.edgeIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.edgeData),
                      gl.STATIC_DRAW);
        this.edgeIndexBuffer.itemSize = 1;
        this.edgeIndexBuffer.numItems = this.edgeData.length;
        
        // Unbind everything; we want to bind the correct element buffer and
        // VAO when we want to draw stuff
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
    

    //-------------------------------------------------------------------------
    // Rendering functions (run every frame in draw())
    /**
     * Renders the terrain to the screen as triangles.
     */
    drawTriangles() {
        gl.bindVertexArray(this.vertexArrayObject);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangleIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.triangleIndexBuffer.numItems,
                        gl.UNSIGNED_INT,0);
    }
    

    /**
     * Renders the terrain to the screen as edges, wireframe style.
     */
    drawEdges() {
        gl.bindVertexArray(this.vertexArrayObject);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeIndexBuffer);
        gl.drawElements(gl.LINES, this.edgeIndexBuffer.numItems,
                        gl.UNSIGNED_INT,0);   
    }


    //-------------------------------------------------------------------------
    // Debugging
    /**
     * Prints the contents of the buffers to the console for debugging.
     */
    printBuffers() {
        for (var i = 0; i < this.numVertices; i++) {
            console.log("v ", this.positionData[i*3], " ", 
                              this.positionData[i*3 + 1], " ",
                              this.positionData[i*3 + 2], " ");
        }
        for (var i = 0; i < this.numVertices; i++) {
            console.log("n ", this.normalData[i*3], " ", 
                              this.normalData[i*3 + 1], " ",
                              this.normalData[i*3 + 2], " ");
        }
        for (var i = 0; i < this.numFaces; i++) {
            console.log("f ", this.faceData[i*3], " ", 
                              this.faceData[i*3 + 1], " ",
                              this.faceData[i*3 + 2], " ");
        }  
    }

} // class Terrain
