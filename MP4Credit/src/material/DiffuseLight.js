/**
 * @file DiffuseLight.js - The DiffuseLight classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the DiffuseLight  class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

 class DiffuseLight extends Material {
    /**
     * Initializes the members of the DiffuseLight object.
     * @param {vec3} color The color of light.
     */
    constructor(color) {
        super();
        this.emit = color;
    }

    /**
     * The scatter function that generate scattered rays from input ray and hittable objects.
     * @param {Ray} ray_in The input ray.
     * @param {hitRecord} hit_record The hit record of the input ray.
     * @param {vec3} attenuation The color attenuation when hit occurs.
     * @param {Ray} ray_scattered The resulting scattered ray/  
     * @returns {bool} Whther a scatter happens.
     */
    scatter(ray_in, hit_record, attenuation, ray_scattered) {
        return false;
     };

     /**
     * The emitted function that generate emitted rays from the light object.
     * @returns {vec3} The emitted light color
     */
    emitted() {
        return this.emit;
     };

}