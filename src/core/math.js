export class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static xy(x, y) {
    return new Vec(x, y);
  }

  static polar(angle) {
    return new Vec(Math.cos(angle), Math.sin(angle));
  }

  static polar(angle, length) {
    return new Vec(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  static get zero() {
    return new Vec(0, 0);
  }

  static get unitX() {
    return new Vec(1, 0);
  }

  static get unitY() {
    return new Vec(0, 1);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(that) {
    return new Vec(this.x + that.x, this.y + that.y);
  }

  sub(that) {
    return new Vec(this.x - that.x, this.y - that.y);
  }

  mul(m) {
    return new Vec(this.x * m, this.y * m);
  }

  div(m) {
    return new Vec(this.x / m, this.y / m);
  }

  neg() {
    return new Vec(-this.x, -this.y);
  }

  rotate(by) {
    return Vec.polar(this.angle + by, this.length);
  }

  dot(that) {
    return this.x * that.x + this.y * that.y;
  }

  cross(that) {
    return this.x * that.y - this.y * that.x;
  }
}
