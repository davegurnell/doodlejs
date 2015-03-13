import _ from 'underscore';

export class Image {
  beside(that) { return new Beside(this, that); }
  above(that)  { return new Above(this, that); }
  below(that)  { return new Above(that, this); }
  on(that)     { return new Overlay(this, that); }
  under(that)  { return new Overlay(that, this); }
}

// export class Path extends Image {
//   constructor(elements) {
//     this.elements = elements;
//   }
// }

export class Circle extends Image {
  constructor(radius) {
    this.radius = radius;
  }
}

export class Rectangle extends Image {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

export class Triangle extends Image {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

export class Beside extends Image {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
}

export class Above extends Image {
  constructor(top, bottom) {
    this.top = top;
    this.bottom = bottom;
  }
}

export class Overlay extends Image {
  constructor(top, bottom) {
    this.top = top;
    this.bottom = bottom;
  }
}

// export class ContextTransform extends Image {
//   // (Context -> Context) Image -> ContextTransform
//   constructor(transform, image) {
//     this.transform = transform;
//     this.image = image;
//   }
// }

// export class Drawable extends Image {
//   draw() {
//     return new Error("Implement me!");
//   }
// }

// export function path(elements) { return new Path(elements); }
export function circle(radius) { return new Circle(radius); }
export function rectangle(width, height) { return new Rectangle(width, height); }
export function triangle(width, height) { return new Triangle(width, height); }

function createExpression(createPair) {
  return function(a, ...b) {
    let ans = _.reduce(b, createPair, a);
    return ans;
  }
}

export const beside = createExpression((a, b) => new Beside(a, b));
export const above  = createExpression((a, b) => new Above(a, b));
export const below  = createExpression((a, b) => new Above(b, a));
export const on     = createExpression((a, b) => new Overlay(a, b));
export const under  = createExpression((a, b) => new Overlay(b, a));
