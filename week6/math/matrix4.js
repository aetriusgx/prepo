/*
 * An object representing a 4x4 matrix
 */

var Matrix4 = function (x, y, z) {
  this.elements = new Float32Array(16);

  if (!(this instanceof Matrix4)) {
    console.error("Matrix4 constructor must be called with the new operator");
  }

  return this.makeIdentity();
}

//=============================================================================  
Matrix4.prototype = {

  // -------------------------------------------------------------------------
  clone: function () {
    var newMatrix = new Matrix4();
    for (var i = 0; i < 16; ++i) {
      newMatrix.elements[i] = this.elements[i];
    }
    return newMatrix;
  },

  // -------------------------------------------------------------------------
  copy: function (m) {
    for (var i = 0; i < 16; ++i) {
      this.elements[i] = m.elements[i];
    }

    return this;
  },

  // -------------------------------------------------------------------------
  getElement: function (row, col) {
    return this.elements[row * 4 + col];
  },

  // -------------------------------------------------------------------------
  set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    var e = this.elements;

    e[0] = n11; e[1] = n12; e[2] = n13; e[3] = n14;
    e[4] = n21; e[5] = n22; e[6] = n23; e[7] = n24;
    e[8] = n31; e[9] = n32; e[10] = n33; e[11] = n34;
    e[12] = n41; e[13] = n42; e[14] = n43; e[15] = n44;

    return this;
  },

  // -------------------------------------------------------------------------
  makeIdentity: function () {
    // todo make this matrix be the identity matrix
    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    return this;
  },

  // -------------------------------------------------------------------------
  multiplyScalar: function (s) {
    for (var i = 0; i < 16; ++i) {
      this.elements[i] = this.elements[i] * s;
    }
  },

  // -------------------------------------------------------------------------
  multiplyVector: function (v) {
    // safety check
    if (!(v instanceof Vector4)) {
      console.error("Trying to multiply a 4x4 matrix with an invalid vector value");
    }

    // todo

    let x0 = this.getElement(0, 0);
    let y0 = this.getElement(1, 0);
    let z0 = this.getElement(2, 0);
    let w0 = this.getElement(3, 0);
    let vector0 = new Vector4(x0, y0, z0, w0);
    let result = vector0.multiplyScalar(v.x);

    let x1 = this.getElement(0, 1);
    let y1 = this.getElement(1, 1);
    let z1 = this.getElement(2, 1);
    let w1 = this.getElement(3, 1);
    let vector1 = new Vector4(x1, y1, z1, w1);
    let result1 = vector1.multiplyScalar(v.y);
    result.add(result1);

    let x2 = this.getElement(0, 2);
    let y2 = this.getElement(1, 2);
    let z2 = this.getElement(2, 2);
    let w2 = this.getElement(3, 2);
    let vector2 = new Vector4(x2, y2, z2, w2);
    let result2 = vector2.multiplyScalar(v.z);
    result.add(result2);

    let x3 = this.getElement(0, 3);
    let y3 = this.getElement(1, 3);
    let z3 = this.getElement(2, 3);
    let w3 = this.getElement(3, 3);
    let vector3 = new Vector4(x3, y3, z3, w3);
    let result3 = vector3.multiplyScalar(v.w);
    result.add(result3);

    return result;
  },

  // -------------------------------------------------------------------------
  multiply: function (rightSideMatrix) {
    // safety check
    if (!(rightSideMatrix instanceof Matrix4)) {
      console.error("Trying to multiply a 4x4 matrix with an invalid matrix value");
    }
    // todo: columns from rightSideMatrix
    let vectors = [];
    for (let row = 0; row < 4; row++) {
      let temp = new Vector4();
      let vals = [];
      for (let col = 0; col < 4; col++) {
        vals.push(rightSideMatrix.getElement(col, row));
      }
      temp.x = vals[0];
      temp.y = vals[1];
      temp.z = vals[2];
      temp.w = vals[3];
      vectors.push(temp);
    }
    
    let col1 = this.multiplyVector(vectors[0]);
    let col2 = this.multiplyVector(vectors[1]);
    let col3 = this.multiplyVector(vectors[2]);
    let col4 = this.multiplyVector(vectors[3]);

    this.set(col1.x, col2.x, col3.x, col4.x, col1.y, col2.y, col3.y, col4.y, col1.z, col2.z, col3.z, col4.z, col1.w, col2.w, col3.w, col4.w);

    return this;
  },

  // -------------------------------------------------------------------------
  premultiply: function (leftSideMatrix) {
    // ignore this, the implementation will be distributed with the solution
    return this;
  },

  // -------------------------------------------------------------------------
  makeScale: function (x, y, z) {
    this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationX: function (degrees) {
    var radians = degrees * (Math.PI / 180);

    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element of this matrix to be a rotation around the x-axis
    this.makeIdentity();
    e[5] = Math.cos(radians);
    e[6] = -Math.sin(radians);
    e[9] = Math.sin(radians);
    e[10] = Math.cos(radians);

    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationY: function (degrees) {
    var radians = degrees * (Math.PI / 180);

    // shortcut - use in place of this.elements
    var e = this.elements;

    this.makeIdentity();
    e[0] = Math.cos(radians);
    e[2] = Math.sin(radians);
    e[8] = -Math.sin(radians);
    e[10] = Math.cos(radians);

    return this;
  },

  // -------------------------------------------------------------------------
  makeRotationZ: function (degrees) {
    var radians = degrees * (Math.PI / 180);

    // shortcut - use in place of this.elements
    var e = this.elements;

    this.makeIdentity();
    e[0] = Math.cos(radians);
    e[1] = -Math.sin(radians);
    e[4] = Math.sin(radians);
    e[5] = Math.cos(radians);
    return this;
  },

  // -------------------------------------------------------------------------
  makeTranslation: function (arg1, arg2, arg3) {
    // todo - wipe out the existing matrix and make it a pure translation
    //      - If arg1 is a Vector3 or Vector4, use its components and ignore
    //        arg2 and arg3. O.W., treat arg1 as x, arg2 as y, and arg3 as z
    this.makeIdentity();
    if (arg1 instanceof Vector4) {
      this.elements[3] = arg1.x;
      this.elements[7] = arg1.y;
      this.elements[11] = arg1.z;
      this.elements[15] = arg1.w;
    } else if (arg1 instanceof Vector3) {
      this.elements[3] = arg1.x;
      this.elements[7] = arg1.y;
      this.elements[11] = arg1.z;
    } else {
      this.elements[3] = arg1;
      this.elements[7] = arg2;
      this.elements[11] = arg3;
    }
    return this;
  },

  // -------------------------------------------------------------------------
  makePerspective: function (fovy, aspect, near, far) {
    var fovyRads = fovy * (Math.PI / 180);

    // t is the tangent of half of the rads
    t = Math.tan(fovyRads/2)
    r = t * aspect

    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element to the appropriate value

    // pseudocode
    // n = near, f = far, t = fov, r = t and aspect ratio (fovx?)
    // 0,0 = n / r DONE
    // 1,1 = n/t DONE
    // 2, 2 = - ((f + n) / (f-n)) DONE
    // 2, 3 = -((2 * n * f) / (f-n))
    // 3, 2 = -1

    this.makeIdentity;
    e[0] = near / r; 
    e[5] = near / t; 
    e[10] = -((far + near) / (far - near)); 
    e[11] = -((2 * (far * near)) / (far - near)); 
    e[14] = -1; 
    e[15] = 0;

    return this;
  },

  // -------------------------------------------------------------------------
  makeOrthographic: function (left, right, top, bottom, near, far) {
    // shortcut - use in place of this.elements
    var e = this.elements;

    // todo - set every element to the appropriate value

    // pseudocode
    // r = right, l = left, t = top, b = bottom
    // 0,0 = 2 / (r-l) 
    // 1,1 = 2 / (t-b)
    // 2, 2 = -2 / (f-n)

    // 0, 3 = -((r + l) / (r - l))
    // 1, 3 = -((t + b) / (t - b))
    // 2, 3 = -((f + n) / (f - n))

    // 3,3 = 1 (already 1)

    this.makeIdentity;
    e[0] = 2 / (right - left);
    e[5] = 2 / (top - bottom);
    e[10] = -2 / (far - near);
    e[3] = -((right + left) / (right - left)) 
    e[7] = -((top + bottom) / (top - bottom))
    e[11] = -((far + near) / (far - near))
    return this;
  },

  // -------------------------------------------------------------------------
  // @translation - a Matrix4 translation matrix
  // @rotation - a Matrix4 rotation Matrix
  // @scale - a Matrix4 scale matrix
  createTRSMatrix: function (translation, rotation, scale) {
    // todo - create a matrix that combines translation, rotation, and scale such
    //        that TRANSFORMATIONS take place in the following order: 1) scale,
    //        2) rotation, and 3) translation. The values of translation, rotation,
    //        and scale should NOT be modified.

    var trsMatrix = new Matrix4();
    return trsMatrix;
  },

  // -------------------------------------------------------------------------
  // @currentRotationAngle - the angle of rotation around the earth
  // @offsetFromEarth - the relative displacement from the earth
  // @earthTransform - the transformation used to apply to the earth
  createMoonMatrix: function (currentRotationAngle, offsetFromEarth, earthTransform) {

    // todo - create a matrix that combines translation and rotation such that when
    //        it is applied to a sphere starting at the origin, moves the sphere to 
    //        orbit the earth.  The displacement from the earth is given by  
    //        "offsetFromEarth" and the current rotation around the earth (z-axis)
    //        is given by "currentRotationAngle" degrees.

    // Note: Do NOT change earthTransform but do use it, it already has the rotation and translation for the earth

    var moonMatrix = new Matrix4();

    // todo - combine all necessary matrices necessary to achieve the desired effect

    return moonMatrix;
  },

  // -------------------------------------------------------------------------
  determinant: function () {
    var e = this.elements;

    // laid out for clarity, not performance
    var m11 = e[0]; var m12 = e[1]; var m13 = e[2]; var m14 = e[3];
    var m21 = e[4]; var m22 = e[5]; var m23 = e[6]; var m24 = e[7];
    var m31 = e[8]; var m32 = e[8]; var m33 = e[9]; var m34 = e[10];
    var m41 = e[12]; var m42 = e[13]; var m43 = e[14]; var m44 = e[15];

    var det11 = m11 * (m22 * (m33 * m44 - m34 * m43) +
      m23 * (m34 * m42 - m32 * m44) +
      m24 * (m32 * m43 - m33 * m42));

    var det12 = -m12 * (m21 * (m33 * m44 - m34 * m43) +
      m23 * (m34 * m41 - m31 * m44) +
      m24 * (m31 * m43 - m33 * m41));

    var det13 = m13 * (m21 * (m32 * m44 - m34 * m42) +
      m22 * (m34 * m41 - m31 * m44) +
      m24 * (m31 * m42 - m32 * m41));

    var det14 = -m14 * (m21 * (m32 * m43 - m33 * m42) +
      m22 * (m33 * m41 - m31 * m43) +
      m23 * (m31 * m42 - m32 * m41));

    return det11 + det12 + det13 + det14;
  },

  // -------------------------------------------------------------------------
  transpose: function () {
    var te = this.elements;
    var tmp;

    tmp = te[1]; te[1] = te[4]; te[4] = tmp;
    tmp = te[2]; te[2] = te[8]; te[8] = tmp;
    tmp = te[6]; te[6] = te[9]; te[9] = tmp;

    tmp = te[3]; te[3] = te[12]; te[12] = tmp;
    tmp = te[7]; te[7] = te[13]; te[13] = tmp;
    tmp = te[11]; te[11] = te[14]; te[14] = tmp;

    return this;
  },


  // -------------------------------------------------------------------------
  inverse: function () {
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    var te = this.elements,
      me = this.clone().elements,

      n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
      n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
      n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
      n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

      t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) {
      var msg = "can't invert matrix, determinant is 0";
      console.warn(msg);
      return this.makeIdentity();
    }

    var detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return this;
  },

  // -------------------------------------------------------------------------
  log: function () {
    var te = this.elements;
    console.log('[ ' +
      '\n ' + te[0] + ', ' + te[1] + ', ' + te[2] + ', ' + te[3] +
      '\n ' + te[4] + ', ' + te[5] + ', ' + te[6] + ', ' + te[7] +
      '\n ' + te[8] + ', ' + te[9] + ', ' + te[10] + ', ' + te[11] +
      '\n ' + te[12] + ', ' + te[13] + ', ' + te[14] + ', ' + te[15] +
      '\n]'
    );

    return this;
  }
};