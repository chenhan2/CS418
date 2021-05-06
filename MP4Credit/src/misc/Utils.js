/**
 * @file Utils.js - utility functions
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the general utility functions to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

/**
 * Generate a random double in a given range
 * @param {number} a The lower bound of the random number (inclusive)
 * @param {number} b The upper bound of the random number (exclusive)
 * @returns {double} the random number generated in the given range
 */
function random_double(a, b) {
    return (b - a) * Math.random() + a;
}

/**
 * Force x to fall in a given range
 * @param {number} x The input x to clamp
 * @param {number} x_min The minimum value of x
 * @param {number} x_max The maximum value of x
 * @returns {number} the clamped value of x that falls in the given range
 */
function clamp(x, x_min, x_max) {
    if (x < x_min) return x_min;
    if (x > x_max) return x_max;
    return x;
}

/**
 * Generate a random vec3 in a given range
 * @param {number} a The lower bound of the random number (inclusive)
 * @param {number} b The upper bound of the random number (exclusive)
 * @returns {vec3} the random vec3 generated in the given range
 */
 function random_vec3(a, b) {
    var x = (b - a) * Math.random() + a;
    var y = (b - a) * Math.random() + a;
    var z = (b - a) * Math.random() + a;
    return glMatrix.vec3.fromValues(x, y, z);
}


/**
 * Generate a random vec3 in the unit sphere 
 * @returns {vec3} the random vec3 in the unit sphere 
 */
 function random_in_unit_vec3() {
    while (true) {
        var p = random_vec3(-1,1);
        if (glMatrix.vec3.squaredLength(p) >= 1) continue;
        return p;
    }
}

/**
 * Generate a random vec3 that is unit length 
 * @returns {vec3} the random vec3 that is unit length 
 */
 function random_unit_vec3() {
    var unit = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit, random_in_unit_vec3());
    return unit;
}

/**
 * Generate a random vec3 in the unit disk 
 * @returns {vec3} the random vec3 in the unit disk 
 */
function random_in_unit_disk() {
    while (true) {
        var p = glMatrix.vec3.fromValues(random_double(-1,1), random_double(-1,1), 0);
        if (glMatrix.vec3.squaredLength(p) >= 1) continue;
        return p;
    }
}

/**
 * Generate a random color 
 * @param {number} a the lower bound
 * @param {number} b the upper bound
 * @returns {vec3} the random color
 */
 function random_color(a, b) {
    return glMatrix.vec3.fromValues(random_double(a, b), random_double(a, b), random_double(a, b));
}

/**
 * Check if a vector is near zero in all dimensions 
 * @param {vec3} vec the vec3 to be check
 * @returns {bool} true if the vector is near zero, false otherwise
 */
function near_zero(vec) {
    var s = 1e-8;
    return (Math.abs(vec[0]) < s) && (Math.abs(vec[1]) < s) && (Math.abs(vec[2]) < s);
}

/**
 * Translates degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} The radians that correspond to the degree input
 */
 function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }