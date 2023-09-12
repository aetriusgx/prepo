/*
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 * 
 * Example usage:
 * var mySphere = new Sphere(new Vector3(1, 2, 3), 4.23);
 * var myRay = new Ray(new Vector3(0, 1, -10), new Vector3(0, 1, 0));
 * var result = mySphere.raycast(myRay);
 * 
 * if (result.hit) {
 *   console.log("Got a valid intersection!");
 * }
 */

var Sphere = function(center, radius) {
  // Sanity checks (your modification should be below this where indicated)
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }

  this.center = (center !== undefined)? center: new Vector3(0, 0, 0);
  this.radius = (radius !== undefined)? radius: 1;

  // Sanity checks (your modification should be above this)
  if (!(this.center instanceof Vector3)) {
    console.error("The sphere center must be a Vector3");
  }

  if ((typeof(this.radius) != 'number')) {
    console.error("The radius must be a Number");
  }
};

Sphere.prototype = {
  
  //----------------------------------------------------------------------------- 
  raycast: function(r1) {
    // todo - determine whether the ray intersects has a VALID intersection with this
	//        sphere and if so, where. A valid intersection is on the is in front of
	//        the ray and whose origin is NOT inside the sphere

    // Recommended steps
    // ------------------
    // 0. (optional) watch the video showing the complete implementation of plane.js
    //    You may find it useful to see a different piece of geometry coded.

    // 1. review slides/book math
    
    // 2. identity the vectors needed to solve for the coefficients in the quadratic equation

    // 3. calculate the discriminant
    
    // 4. use the discriminant to determine if further computation is necessary 
    //    if (discriminant...) { ... } else { ... }

    // 5. return the following object literal "result" based on whether the intersection
    //    is valid (i.e. the intersection is in front of the ray AND the ray is not inside
    //    the sphere)
    //    case 1: no VALID intersections
    //      var result = { hit: false, point: null }
    //    case 2: 1 or more intersections
    //      var result = {
    //        hit: true,
    //        point: 'a Vector3 containing the CLOSEST VALID intersection',
    //        normal: 'a vector3 containing a unit length normal at the intersection point',
    //        distance: 'a scalar containing the intersection distance from the ray origin'
    //      }

    // An object created from a literal that we will return as our result
    // Replace the null values in the properties below with the right values
    let d_h = r1.direction.clone();
    let o_v = r1.origin.clone();
    let c_v = this.center.clone();


    let a = d_h.dot(d_h); // int
    let b = d_h.clone().multiplyScalar(2).dot(o_v.clone().subtract(c_v)); // int
    let c = o_v.clone().subtract(c_v).dot(o_v.clone().subtract(c_v)) - this.radius**2; // int
    let discriminant = (b**2) - (4 * a * c);

    var result = {
      hit: null,
      point: null
    }

    // No real solution
    if (discriminant < 0) {
      result.hit = false;
    }

    // quadratic = (-b +/- discriminant) / 2a
    let alpha;
    // Only one solution
    if (discriminant == 0) {
      result.hit = true;

      alpha = -b / (2 * a);
      if (alpha < 0) {
        result.hit = false;
        return result;
      }

      result.distance = alpha;
      result.point = r1.origin.clone().add(r1.direction.clone().multiplyScalar(alpha));
      result.normal = r1.direction.fromTo(result.point, this.center).normalize();
    }

    if (discriminant > 0) {
      result.hit = true;

      let alpha_p = (-b + Math.sqrt(discriminant)) / (2 * a);
      let alpha_n = (-b - Math.sqrt(discriminant)) / (2 * a);
      alpha = (alpha_p < alpha_n)? alpha_p: alpha_n;

      if (alpha < 0) {
        result.hit = false;
        return result;
      }
      
      result.distance = alpha;
      result.point = r1.origin.clone().add(r1.direction.clone().multiplyScalar(alpha));
      result.normal = r1.direction.fromTo(result.point, this.center).normalize();
    }

    console.log(result);
    return result;
  }
}

// EOF 00100001-10
