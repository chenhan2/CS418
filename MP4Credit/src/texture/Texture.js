/**
 * @file Texture.js - The texture abstract classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the texture class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

 class Texture {
    
    /**
     * The abstract value function that generate texture value for a given object.
     * @param {number} u The texture mapping parameter.
     * @param {number} v The texture mapping parameter.
     * @param {vec3} p The point to apply texture.
     * @returns {vec3} The texture color.
     */
     value(u, v, p) {};
}
