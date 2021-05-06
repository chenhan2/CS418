/**
 * @file Hittable.js - The hittable abstract class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the hittable class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Hittable {
    /**
     * The abstract hit function that decide if the ray hit a sphere within certain distance range.
     * @param {Ray} ray The ray.
     * @param {number} t_min The minimum distance that the hit can occur.
     * @param {number} t_max The maximum distance that the hit can occur.
     * @param {object} hitRecord The object that stores the hit record, including a hit point `p`, 
     * a nomral vector `normal` and a hit distance `t`.
     * @returns {bool} Whther the ray is hit within a certain dinstance range.
     */
    hit(ray, t_min, t_max, hitRecord) {}
};
