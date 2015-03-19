import {
  Vec
} from './math';

import {
  Circle,
  Rectangle,
  Triangle,
  Overlay,
  Beside,
  Above,
  StyleTransform
} from './image';

export class BoundingBox {
  // Number Number Number Number -> BoundingBox
  constructor(top = 0, right = 0, bottom = 0, left = 0) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  // -> Vec
  get center() {
    return new Vec(
      0.5 * (this.left + this.right),
      0.5 * (this.top + this.bottom)
    );
  }

  // -> Number
  get width() {
    return this.right - this.left;
  }

  // -> Number
  get height() {
    return this.bottom - this.top;
  }

  // -> Vec
  get size() {
    return new Vec(this.width, this.height);
  }

  // Vec -> BoundingBox
  translate(vec) {
    return new BoundingBox(
      this.top    + vec.y,
      this.right  + vec.x,
      this.bottom + vec.y,
      this.left   + vec.x
    );
  }
}

// Calculates an axis aligned bounding box centered on `image`.
// 
// Image -> BoundingBox
export function boundingBox(image) {
  if(image instanceof Circle) {
    let r = image.radius;
    return new BoundingBox(-r, r, r, -r);

  } else if(image instanceof Rectangle) {
    let w = image.width;
    let h = image.height;
    return new BoundingBox(-h/2, w/2, h/2, -w/2);

  } else if(image instanceof Triangle) {
    let w = image.width;
    let h = image.height;
    return new BoundingBox(-h/2, w/2, h/2, -w/2);

  } else if(image instanceof Above) {
    let tb = boundingBox(image.top);
    let bb = boundingBox(image.bottom);
    return new BoundingBox(
      -0.5 * (tb.height + bb.height),
      Math.max(tb.right, bb.right),
      +0.5 * (tb.height + bb.height),
      Math.min(tb.left, bb.left)
    );

  } else if(image instanceof Beside) {
    let lb = boundingBox(image.left);
    let rb = boundingBox(image.right);
    return new BoundingBox(
      Math.min(lb.top, rb.top),
      +0.5 * (lb.width + rb.width),
      Math.max(lb.bottom, rb.bottom),
      -0.5 * (lb.width + rb.width)
    );

  } else if(image instanceof Overlay) {
    let tb = boundingBox(image.top);
    let bb = boundingBox(image.bottom);
    return new BoundingBox(
      Math.min(tb.top, bb.top),
      Math.max(tb.right, bb.right),
      Math.max(tb.bottom, bb.bottom),
      Math.min(tb.left, bb.left)
    );

  } else if(image instanceof StyleTransform) {
    return boundingBox(image.image);

  } else {
    throw new Error("boundingBox(): image type not recognised: " + image);
  }
}
