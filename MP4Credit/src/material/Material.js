/**
 * @file Material.js - The material abstract classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the material class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Material {
    
    /**
     * The abstract scatter function that generate scattered rays from input ray and hittable objects.
     * @param {Ray} ray_in The input ray.
     * @param {hitRecord} hit_record The hit record of the input ray.
     * @param {vec3} attenuation The color attenuation when hit occurs.
     * @param {Ray} ray_scattered The resulting scattered ray/
     * @returns {bool} Whther a scatter happens.
     */
    scatter(ray_in, hit_record, attenuation, ray_scattered) {};
}
