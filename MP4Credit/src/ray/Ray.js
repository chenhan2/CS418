/**
 * @file Ray.js - The ray class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the ray class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Ray {
    /**
     * Initializes the members of the Ray object.
     * @param {vec3} origin The origin of the ray.
     * @param {vec3} direction The target direction of the ray.
     */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     * Returns the position of the ray at t distance from the origin.
     * @param {number} t An array of length 3 to hold the x,y,z coordinates.
     * @returns {vec3} the position of the ray at t distance from the origin
     */
    at(t) {
        var result = glMatrix.vec3.create();
        glMatrix.vec3.scale(result, this.direction, t);
        glMatrix.vec3.add(result, this.origin, result);
        return result;
    }
}