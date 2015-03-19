import _ from 'underscore';

export class Image {
  // Image -> Image
  beside(that) { return new Beside(this, that); }
  above(that) { return new Above(this, that); }
  below(that) { return new Above(that, this); }
  on(that) { return new Overlay(this, that); }
  under(that) { return new Overlay(that, this); }

  // PartialStyle -> Image
  styled(style) {
    return new StyleTransform(this, s => _.extend(s, style));
  }

  // String -> Image
  fill(value) {
    return this.styled({ fillStyle: value });
  }

  // -> Image
  noFill() {
    return this.styled({ fillStyle: 'transparent' });
  }

  // Or(String, Number) String -> Image
  stroke(width, color) {
    return this.styled({ lineWidth: width, strokeStyle: color });
  }

  // -> Image
  noStroke() {
    return this.styled({ lineWidth: 0 });
  }
}

export class Circle extends Image {
  // Number -> Image
  constructor(radius) {
    this.radius = radius;
  }
}

export class Rectangle extends Image {
  // Number Number -> Image
  constructor(width, height) {
    this.width  = width;
    this.height = height;
  }
}

export class Triangle extends Image {
  // Number Number -> Image
  constructor(width, height) {
    this.width  = width;
    this.height = height;
  }
}

export class Beside extends Image {
  // Image Image -> Image
  constructor(left, right) {
    this.left  = left;
    this.right = right;
  }
}

export class Above extends Image {
  // Image Image -> Image
  constructor(top, bottom) {
    this.top    = top;
    this.bottom = bottom;
  }
}

export class Overlay extends Image {
  // Image Image -> Image
  constructor(top, bottom) {
    this.top    = top;
    this.bottom = bottom;
  }
}

export class StyleTransform extends Image {
  // Image (Style -> Style) -> Image
  constructor(image, transform) {
    this.image     = image;
    this.transform = transform;
  }
}
