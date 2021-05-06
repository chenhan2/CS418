/**
 * @file Sphere.js - The sphere class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the sphere class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Sphere extends Hittable {
    /**
     * Initializes the members of the Sphere object.
     * @param {vec3} center The center of the sphere.
     * @param {double} radius The radius of the sphere.
     */
    constructor(center, radius, material) {
        super();
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    /**
     * The hit function that decide if the ray hit a sphere within certain distance range.
     * @param {Ray} ray The ray.
     * @param {number} t_min The minimum distance that the hit can occur.
     * @param {number} t_max The maximum distance that the hit can occur.
     * @param {HitRecord} hitRecord The HitRecord object that stores the hit record, including a hit 
     * point `point`, a nomral vector `normal` and a hit distance `t`.
     * @returns {bool} Whther the ray is hit within a certain dinstance range.
     */
    hit(ray, t_min, t_max, hitRecord) {
        var oc = glMatrix.vec3.create();
        glMatrix.vec3.subtract(oc, ray.origin, this.center);
        var a = glMatrix.vec3.squaredLength(ray.direction);
        var half_b = glMatrix.vec3.dot(oc, ray.direction);
        var c = glMatrix.vec3.squaredLength(oc) - this.radius * this.radius;
    
        var discriminant = half_b * half_b - a * c;
        if (discriminant < 0) return false;
        var sqrtd = Math.sqrt(discriminant);
    
        // Find the nearest root that lies in the acceptable range.
        var root = (- half_b - sqrtd) / a;
        if (root < t_min || t_max < root) {
            root = (- half_b + sqrtd) / a;
            if (root < t_min || t_max < root)
                return false;
        }
    
        hitRecord.t = root;
        hitRecord.point = ray.at(hitRecord.t);
        var outward_normal = glMatrix.vec3.create();
        glMatrix.vec3.subtract(outward_normal, hitRecord.point, this.center);
        glMatrix.vec3.scale(outward_normal, outward_normal, 1 / this.radius);
        hitRecord.set_face_normal(ray, outward_normal);
        hitRecord.material = this.material;
    
        return true;
    }
}