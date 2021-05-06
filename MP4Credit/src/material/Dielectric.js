/**
 * @file Dielectric.js - The Dielectric classes for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the Dielectric  class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

 class Dielectric extends Material {
    /**
     * Initializes the members of the Lambertian object.
     * @param {vec3} index_of_refraction The index_of_refraction.
     */
    constructor(index_of_refraction) {
        super();
        this.ir = index_of_refraction;
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
        glMatrix.vec3.copy(attenuation, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));
        var refraction_ratio = hit_record.front_face ? (1.0 / this.ir) : this.ir;

        var unit_direction = glMatrix.vec3.create();
        glMatrix.vec3.normalize(unit_direction, ray_in.direction);

        var neg_unit_direction = glMatrix.vec3.create();
        glMatrix.vec3.negate(neg_unit_direction, unit_direction);

        var cos_theta = Math.min(glMatrix.vec3.dot(neg_unit_direction, hit_record.normal), 1.0);
        var sin_theta = Math.sqrt(1.0 - cos_theta*cos_theta);

        var cannot_refract = refraction_ratio * sin_theta > 1.0;
        var direction;

        if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random_double(0, 1)) {
            direction = reflect(unit_direction, hit_record.normal);
        }
        else {
            direction = refract(unit_direction, hit_record.normal, refraction_ratio);
        }


        var output_ray = new Ray(hit_record.point, direction);
        ray_scattered.origin = output_ray.origin;
        ray_scattered.direction = output_ray.direction;
        return true;
     };

}