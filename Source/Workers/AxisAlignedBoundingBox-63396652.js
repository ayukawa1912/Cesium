/* This file is automatically rebuilt by the Cesium build process. */
define(['exports', './Cartesian2-29c15ffd', './Check-ed9ffed2', './when-f31b6bd1', './Transforms-813bc92c'], function (exports, Cartesian2, Check, when, Transforms) { 'use strict';

  /**
   * Creates an instance of an AxisAlignedBoundingBox from the minimum and maximum points along the x, y, and z axes.
   * @alias AxisAlignedBoundingBox
   * @constructor
   *
   * @param {Cartesian3} [minimum=Cartesian3.ZERO] The minimum point along the x, y, and z axes.
   * @param {Cartesian3} [maximum=Cartesian3.ZERO] The maximum point along the x, y, and z axes.
   * @param {Cartesian3} [center] The center of the box; automatically computed if not supplied.
   *
   * @see BoundingSphere
   * @see BoundingRectangle
   */
  function AxisAlignedBoundingBox(minimum, maximum, center) {
    /**
     * The minimum point defining the bounding box.
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.minimum = Cartesian2.Cartesian3.clone(when.defaultValue(minimum, Cartesian2.Cartesian3.ZERO));

    /**
     * The maximum point defining the bounding box.
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.maximum = Cartesian2.Cartesian3.clone(when.defaultValue(maximum, Cartesian2.Cartesian3.ZERO));

    //If center was not defined, compute it.
    if (!when.defined(center)) {
      center = Cartesian2.Cartesian3.midpoint(this.minimum, this.maximum, new Cartesian2.Cartesian3());
    } else {
      center = Cartesian2.Cartesian3.clone(center);
    }

    /**
     * The center point of the bounding box.
     * @type {Cartesian3}
     */
    this.center = center;
  }

  /**
   * Computes an instance of an AxisAlignedBoundingBox. The box is determined by
   * finding the points spaced the farthest apart on the x, y, and z axes.
   *
   * @param {Cartesian3[]} positions List of points that the bounding box will enclose.  Each point must have a <code>x</code>, <code>y</code>, and <code>z</code> properties.
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
   *
   * @example
   * // Compute an axis aligned bounding box enclosing two points.
   * var box = Cesium.AxisAlignedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
   */
  AxisAlignedBoundingBox.fromPoints = function (positions, result) {
    if (!when.defined(result)) {
      result = new AxisAlignedBoundingBox();
    }

    if (!when.defined(positions) || positions.length === 0) {
      result.minimum = Cartesian2.Cartesian3.clone(Cartesian2.Cartesian3.ZERO, result.minimum);
      result.maximum = Cartesian2.Cartesian3.clone(Cartesian2.Cartesian3.ZERO, result.maximum);
      result.center = Cartesian2.Cartesian3.clone(Cartesian2.Cartesian3.ZERO, result.center);
      return result;
    }

    var minimumX = positions[0].x;
    var minimumY = positions[0].y;
    var minimumZ = positions[0].z;

    var maximumX = positions[0].x;
    var maximumY = positions[0].y;
    var maximumZ = positions[0].z;

    var length = positions.length;
    for (var i = 1; i < length; i++) {
      var p = positions[i];
      var x = p.x;
      var y = p.y;
      var z = p.z;

      minimumX = Math.min(x, minimumX);
      maximumX = Math.max(x, maximumX);
      minimumY = Math.min(y, minimumY);
      maximumY = Math.max(y, maximumY);
      minimumZ = Math.min(z, minimumZ);
      maximumZ = Math.max(z, maximumZ);
    }

    var minimum = result.minimum;
    minimum.x = minimumX;
    minimum.y = minimumY;
    minimum.z = minimumZ;

    var maximum = result.maximum;
    maximum.x = maximumX;
    maximum.y = maximumY;
    maximum.z = maximumZ;

    result.center = Cartesian2.Cartesian3.midpoint(minimum, maximum, result.center);

    return result;
  };

  /**
   * Duplicates a AxisAlignedBoundingBox instance.
   *
   * @param {AxisAlignedBoundingBox} box The bounding box to duplicate.
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
   */
  AxisAlignedBoundingBox.clone = function (box, result) {
    if (!when.defined(box)) {
      return undefined;
    }

    if (!when.defined(result)) {
      return new AxisAlignedBoundingBox(box.minimum, box.maximum, box.center);
    }

    result.minimum = Cartesian2.Cartesian3.clone(box.minimum, result.minimum);
    result.maximum = Cartesian2.Cartesian3.clone(box.maximum, result.maximum);
    result.center = Cartesian2.Cartesian3.clone(box.center, result.center);
    return result;
  };

  /**
   * Compares the provided AxisAlignedBoundingBox componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {AxisAlignedBoundingBox} [left] The first AxisAlignedBoundingBox.
   * @param {AxisAlignedBoundingBox} [right] The second AxisAlignedBoundingBox.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  AxisAlignedBoundingBox.equals = function (left, right) {
    return (
      left === right ||
      (when.defined(left) &&
        when.defined(right) &&
        Cartesian2.Cartesian3.equals(left.center, right.center) &&
        Cartesian2.Cartesian3.equals(left.minimum, right.minimum) &&
        Cartesian2.Cartesian3.equals(left.maximum, right.maximum))
    );
  };

  var intersectScratch = new Cartesian2.Cartesian3();
  /**
   * Determines which side of a plane a box is located.
   *
   * @param {AxisAlignedBoundingBox} box The bounding box to test.
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
   *                      intersects the plane.
   */
  AxisAlignedBoundingBox.intersectPlane = function (box, plane) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("box", box);
    Check.Check.defined("plane", plane);
    //>>includeEnd('debug');

    intersectScratch = Cartesian2.Cartesian3.subtract(
      box.maximum,
      box.minimum,
      intersectScratch
    );
    var h = Cartesian2.Cartesian3.multiplyByScalar(intersectScratch, 0.5, intersectScratch); //The positive half diagonal
    var normal = plane.normal;
    var e =
      h.x * Math.abs(normal.x) +
      h.y * Math.abs(normal.y) +
      h.z * Math.abs(normal.z);
    var s = Cartesian2.Cartesian3.dot(box.center, normal) + plane.distance; //signed distance from center

    if (s - e > 0) {
      return Transforms.Intersect.INSIDE;
    }

    if (s + e < 0) {
      //Not in front because normals point inward
      return Transforms.Intersect.OUTSIDE;
    }

    return Transforms.Intersect.INTERSECTING;
  };

  /**
   * Duplicates this AxisAlignedBoundingBox instance.
   *
   * @param {AxisAlignedBoundingBox} [result] The object onto which to store the result.
   * @returns {AxisAlignedBoundingBox} The modified result parameter or a new AxisAlignedBoundingBox instance if one was not provided.
   */
  AxisAlignedBoundingBox.prototype.clone = function (result) {
    return AxisAlignedBoundingBox.clone(this, result);
  };

  /**
   * Determines which side of a plane this box is located.
   *
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
   *                      intersects the plane.
   */
  AxisAlignedBoundingBox.prototype.intersectPlane = function (plane) {
    return AxisAlignedBoundingBox.intersectPlane(this, plane);
  };

  /**
   * Compares this AxisAlignedBoundingBox against the provided AxisAlignedBoundingBox componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {AxisAlignedBoundingBox} [right] The right hand side AxisAlignedBoundingBox.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  AxisAlignedBoundingBox.prototype.equals = function (right) {
    return AxisAlignedBoundingBox.equals(this, right);
  };

  exports.AxisAlignedBoundingBox = AxisAlignedBoundingBox;

});
