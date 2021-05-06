/**
 * @file HitRecord.js - The hir_record class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the hir_record class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class HitRecord {
    /**
     * Initializes the members of the HitRecord object.
     * @param {number} t The distance of hit from the origin.
     * @param {vec3} point The point where hit occurs.
     * @param {vec3} normal The normal of the point on the sphere where hit occurs.
     */
    constructor() {
        this.t = 0;
        this.point = glMatrix.vec3.create();
        this.normal = glMatrix.vec3.create();
        this.front_face = false;
        this.material = new Material();
    }

    /**
    * Generate face normal based on a ray and the normal vector
    * @param {Ray} ray the input ray that hit a hittable
    * @param {vec3} outward_normal the outward normal at the hit position
    */
    set_face_normal(ray, outward_normal) {
        this.front_face = glMatrix.vec3.dot(ray.direction, outward_normal) < 0;
        if (this.front_face) {
            glMatrix.vec3.copy(this.normal, outward_normal)
        } else {
            glMatrix.vec3.negate(this.normal, outward_normal)
        }
    }
}