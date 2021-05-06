/**
 * @file HittableList.js - The hittable list class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the hittable list class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class HittableList extends Hittable{

    /**
     * Initializes the members of the HitableList.
     * @param {Hittable} obj A hittable objective.
     */
    constructor() {
        super();
        this.objs = [];
    }

    /**
     * Clear all members of the HitableList.
     */
    clear() {
        this.objs = [];
    }

    /**
     * Add member to the HitableList.
     * @param {Hittable} obj a hittable obj to add.
     */
      add(obj) {
        this.objs.push(obj);
    }

    /**
     * The hit function that decide if the ray hit any spheres within certain distance range.
     * @param {Ray} ray The ray.
     * @param {number} t_min The minimum distance that the hit can occur.
     * @param {number} t_max The maximum distance that the hit can occur.
     * @param {HitRecord} hitRecord The HitRecord object that stores the hit record, including a hit 
     * point `point`, a nomral vector `normal` and a hit distance `t`.
     * @returns {bool} Whther the ray is hit within a certain dinstance range.
     */
    hit(ray, t_min, t_max, hitRecord) {
        var temp_rec = new HitRecord();
        var hit_anything = false;
        var closest_so_far = t_max;
    
        for (let obj of this.objs) {
            if (obj != undefined && obj.hit(ray, t_min, closest_so_far, temp_rec)) {
                hit_anything = true;
                closest_so_far = temp_rec.t;
                hitRecord.t = temp_rec.t;
                hitRecord.normal = temp_rec.normal;
                hitRecord.point = temp_rec.point;
                hitRecord.material = temp_rec.material;
                hitRecord.front_face = temp_rec.front_face;
            }
        }
    
        return hit_anything;
    }
}