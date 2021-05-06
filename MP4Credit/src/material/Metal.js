/**
 * @file Metal.js - The matel classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the matel  class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

 class Metal extends Material {
    /**
     * Initializes the members of the Metal object.
     * @param {vec3} albedo The albedo for colors.
     * @param {number} fuzz The fuzziness parameter.
     */
    constructor(albedo, fuzz) {
        super();
        this.albedo = albedo;
        this.fuzz = fuzz < 1 ? fuzz : 1;
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
         
        var v = glMatrix.vec3.create();
        glMatrix.vec3.normalize(v, ray_in.direction);
        var reflected = reflect(v, hit_record.normal);

        var tmp = random_in_unit_vec3();
        glMatrix.vec3.scale(tmp, tmp, this.fuzz);
        glMatrix.vec3.add(reflected, reflected, tmp);
        var output_ray = new Ray(hit_record.point, reflected);
        ray_scattered.origin = output_ray.origin;
        ray_scattered.direction = output_ray.direction;
        glMatrix.vec3.copy(attenuation, this.albedo);
        return (glMatrix.vec3.dot(ray_scattered.direction, hit_record.normal) > 0);
     };
}