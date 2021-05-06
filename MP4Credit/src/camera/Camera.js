/**
 * @file Camera.js - The camera class for ray chasing
 * @author Chenhan Xu <chenhan2@illinois.edu>
 * @brief Define the camera class to be used in other js files.
 * 
 * Updated Spring 2021 for WebGL 2.0/GLSL 3.00 ES.
 */

class Camera {
    /**
     * Initializes the members of the Camera object.
     * @param {vec3} lookfrom the position of the camera
     * @param {vec3} lookat the point where the camera looks at
     * @param {vec3} vup the vector that gives the up direction
     * @param {number} vfov vertical field-of-view in degrees
     * @param {number} aspect_ratio The aspect ratio of the view port and the scene
     * @param {number} aperture The size of aperture of the camera
     * @param {number} focus_dist The focus distance of the camera
     */
    constructor(lookfrom, lookat, vup, vfov, aspect_ratio, aperture, focus_dist) {
        

        var theta = degToRad(vfov);
        var h = Math.tan(theta/2);
        var viewport_height = 2.0 * h;
        var viewport_width = aspect_ratio * viewport_height;

        this.w = glMatrix.vec3.create();
        glMatrix.vec3.subtract(this.w, lookfrom, lookat);
        glMatrix.vec3.normalize(this.w, this.w);
        this.u = glMatrix.vec3.create();
        glMatrix.vec3.cross(this.u, vup, this.w);
        glMatrix.vec3.normalize(this.u, this.u);
        this.v = glMatrix.vec3.create();
        glMatrix.vec3.cross(this.v, this.w, this.u);

        this.origin = glMatrix.vec3.create();
        glMatrix.vec3.copy(this.origin, lookfrom);
        this.horizontal = glMatrix.vec3.create();
        glMatrix.vec3.scale(this.horizontal, this.u, focus_dist * viewport_width);
        this.vertical = glMatrix.vec3.create();
        glMatrix.vec3.scale(this.vertical, this.v, focus_dist * viewport_height);
        this.lower_left_corner = glMatrix.vec3.create();
        glMatrix.vec3.scaleAndAdd(this.lower_left_corner, this.origin, this.w, -focus_dist);
        var tmp = glMatrix.vec3.create();
        glMatrix.vec3.scale(tmp, this.horizontal, 1/2);
        glMatrix.vec3.subtract(this.lower_left_corner, this.lower_left_corner, tmp);
        glMatrix.vec3.scale(tmp, this.vertical, 1/2);
        glMatrix.vec3.subtract(this.lower_left_corner, this.lower_left_corner, tmp);

        this.lens_radius = aperture / 2;
    }

    /**
     * Returns the position of the ray at t distance from the origin.
     * @param {double} s The horizontal vector
     * @param {double} t The vertical vector
     * @returns {Ray} Ray generated in the certain direction
     */
    get_ray(s, t) {
        var rd = glMatrix.vec3.create();
        glMatrix.vec3.scale(rd, random_in_unit_disk(), this.lens_radius);
        var ux = glMatrix.vec3.create();
        glMatrix.vec3.scale(ux, this.u, rd[0]);
        var vy = glMatrix.vec3.create();
        glMatrix.vec3.scale(vy, this.v, rd[1]);
        var offset = glMatrix.vec3.create();
        glMatrix.vec3.add(offset, ux, vy);


        var originOffset = glMatrix.vec3.create();
        glMatrix.vec3.add(originOffset, this.origin, offset);

        var direction = glMatrix.vec3.create();
        glMatrix.vec3.subtract(direction, this.lower_left_corner, this.origin);
        var tmp = glMatrix.vec3.create();
        glMatrix.vec3.scale(tmp, this.horizontal, s);
        glMatrix.vec3.add(direction, direction, tmp);
        glMatrix.vec3.scale(tmp, this.vertical, t);
        glMatrix.vec3.add(direction, direction, tmp);

        var directionOffset = glMatrix.vec3.create();
        glMatrix.vec3.subtract(directionOffset, direction, offset);
        return new Ray(originOffset, directionOffset);
    }
}