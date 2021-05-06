/**
 * @file RayUtils.js - Ray utility functions
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the ray related utility functions to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

/**
 * Get the ray color from the ray
 * @param {Ray} ray the ray where we receive a color
 * @param {HittableList} world the list of all hittable objects in the world
 * @param {number} depth the counter to check the recursion depth
 * @returns {vec3} the color received from the ray
 */
 function ray_color(ray, world, depth) {

    if (depth <= 0)
        return glMatrix.vec3.fromValues(0, 0, 0);

    hitRecord = new HitRecord();
    
    if (world.hit(ray, 0.00001, 1000000, hitRecord)) {
        var scattered = new Ray();
        var attenuation = glMatrix.vec3.create();
        // if (hitRecord.material.scatter(ray, hitRecord, attenuation, scattered)) {
        //     var newRay = ray_color(scattered, world, depth - 1)
        //     var result = glMatrix.vec3.create();
        //     glMatrix.vec3.multiply(result, attenuation, newRay);
        //     return result;
        // } 
        // return glMatrix.vec3.fromValues(0, 0, 0);
        if (!hitRecord.material.scatter(ray, hitRecord, attenuation, scattered)) {
            if (hitRecord.material.emit != undefined) {
                return hitRecord.material.emitted();
            } else {
                return glMatrix.vec3.fromValues(0, 0, 0);
            }
        }
        var newRay = ray_color(scattered, world, depth - 1)
        var result = glMatrix.vec3.create();
        glMatrix.vec3.multiply(result, attenuation, newRay);
        if (hitRecord.material.emit != undefined) {
            var emit = hitRecord.material.emitted();
            glMatrix.vec3.add(result, result, emit);
        }
        return result;
            
    }

    var unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, ray.direction);
  
    var t = 0.5 * (unit_direction[1] + 1.0);
  
    var color1 = glMatrix.vec4.fromValues(1, 1, 1);
    glMatrix.vec3.scale(color1, color1, 1 - t);
  
    var color2 = glMatrix.vec4.fromValues(0.5, 0.7, 1);
    glMatrix.vec3.scale(color2, color2, t);
  
    var color = glMatrix.vec4.create();
    glMatrix.vec3.add(color, color1, color2);
    return color;
  }

/**
 * Check if a ray hit a sphere
 * @param {vec3} center the center of a sphere
 * @param {number} radius the radius of a sphere
 * @param {Ray} ray the ray where we receive a color
 * @returns {double} -1 if no spheres is hit; else return the distance to the hit sphere
 */
function hit_sphere(center, radius, ray) {
    var oc = glMatrix.vec3.create();
    glMatrix.vec3.subtract(oc, ray.origin, center);

    var a = glMatrix.vec3.squaredLength(ray.direction);
    var half_b = glMatrix.vec3.dot(oc, ray.direction);
    var c = glMatrix.vec3.squaredLength(oc) - radius * radius;
    var discriminant = half_b * half_b - a * c;
    if (discriminant < 0) {
        return -1.0;
    } else {
        return (-half_b - Math.sqrt(discriminant) ) / a;
    }
}

/**
 * Calculate the reflected ray vector
 * @param {vec3} v the input ray vector
 * @param {vec3} n the normal vector of the hit point
 * @returns {vec3} the output ray vector
 */
function reflect(v, n) {
    var result = glMatrix.vec3.create();
    var tmp = glMatrix.vec3.create();
    glMatrix.vec3.scale(tmp, n, 2 * glMatrix.vec3.dot(v, n));
    glMatrix.vec3.subtract(result, v, tmp);
    return result;
}

/**
 * Calculate the refracted ray vector
 * @param {vec3} uv the input ray vector
 * @param {vec3} n the normal vector of the hit point
 * @param {number} ratio the refract ratio between the two materials
 * @returns {vec3} the output ray vector
 */
function refract(uv, n, ratio) {
    var negUV = glMatrix.vec3.create();
    glMatrix.vec3.negate(negUV, uv);
    var cos_theta = Math.min(glMatrix.vec3.dot(negUV, n), 1.0);

    var r_out_perp = glMatrix.vec3.create();
    glMatrix.vec3.scaleAndAdd(r_out_perp, uv, n, cos_theta);
    glMatrix.vec3.scale(r_out_perp, r_out_perp, ratio);

    var r_out_parallel = glMatrix.vec3.create()
    glMatrix.vec3.scale(r_out_parallel, n, - Math.sqrt(Math.abs(1 - glMatrix.vec3.squaredLength(r_out_perp))))

    var result = glMatrix.vec3.create()
    glMatrix.vec3.add(result, r_out_perp, r_out_parallel);
    return result;
}



/**
* Schlick Approximation to yeild full glasss material
* @param {number} cosine The cosine of input angle.
* @param {number} ref_idx The refract index.
* @returns {number} Schlick Approximation of reflectance
*/
function reflectance(cosine, ref_idx) {
    // Use Schlick's approximation for reflectance.
    var r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
}