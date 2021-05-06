/**
 * @file Lambertian.js - The Lambertian classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the Lambertian  class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Lambertian extends Material {
    /**
     * Initializes the members of the Lambertian object.
     * @param {vec3} albedo The albedo for colors.
     */
    constructor(albedo) {
        super();
        this.albedo = albedo;
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
        var scatter_direction = glMatrix.vec3.create();
        glMatrix.vec3.add(scatter_direction, hit_record.normal, random_unit_vec3())

        // Catch degenerate scatter direction
        if (near_zero(scatter_direction))
            scatter_direction = hit_record.normal;

        var output_ray = new Ray(hit_record.point, scatter_direction);
        ray_scattered.origin = output_ray.origin;
        ray_scattered.direction = output_ray.direction;
        glMatrix.vec3.copy(attenuation, this.albedo);
        return true;
     };
}