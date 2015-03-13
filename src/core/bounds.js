import { Vec } from './math';
import * as image from './image';

export class BoundingBox {
  constructor(top = 0, right = 0, bottom = 0, left = 0) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  get center() {
    return new Vec(
      0.5 * (this.left + this.right),
      0.5 * (this.top + this.bottom)
    );
  }

  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  get size() {
    return new Vec(this.width, this.height)
  }

  expand(vec) {
    return new BoundingBox(
      Math.min(top, vec.y),
      Math.max(right, vec.x),
      Math.max(bottom, vec.y),
      Math.min(left, vec.x)
    );
  }

  translate(vec) {
    return new BoundingBox(
      this.top    + vec.y,
      this.right  + vec.x,
      this.bottom + vec.y,
      this.left   + vec.x
    );
  }

  static fromPoint(vec) {
    return new BoundingBox(vec.y, vec.x, vec.y, vec.x);
  }

  static fromPoints(vecs) {
    if(vecs.length == 0) {
      return BoundingBox.fromPoint(new Vec(0, 0));

    } else {
      let ans = BoundingBox.fromPoint(vecs[0]);
      for(let i = 1; i < vecs.length; i++) {
        ans = ans.expand(vecs[i]);
      }
      return ans;
    }
  }

  static forImage(img) {
    return BoundingBox._forImage(img);
  }

  static _forImage(img) {
    // if(img instanceof image.Path) {
    //   return BoundingBox.fromPoints(
    //     _.chain(img.elements)
    //      .map(elem => elem.points())
    //      .flatten()
    //      .value()
    //   );
    // } else
    if(img instanceof image.Circle) {
      let r = img.radius;
      return new BoundingBox(-r, r, r, -r);

    } else if(img instanceof image.Rectangle) {
      let w = img.width;
      let h = img.height;
      return new BoundingBox(-h/2, w/2, h/2, -w/2);

    } else if(img instanceof image.Triangle) {
      let w = img.width;
      let h = img.height;
      return new BoundingBox(-h/2, w/2, h/2, -w/2);

    } else if(img instanceof image.Overlay) {
      let tb = BoundingBox.forImage(img.top);
      let bb = BoundingBox.forImage(img.bottom);
      return new BoundingBox(
        Math.min(tb.top, bb.top),
        Math.max(tb.right, bb.right),
        Math.max(tb.bottom, bb.bottom),
        Math.min(tb.left, bb.left)
      );

    } else if(img instanceof image.Beside) {
      let lb = BoundingBox.forImage(img.left);
      let rb = BoundingBox.forImage(img.right);
      return new BoundingBox(
        Math.min(lb.top, rb.top),
        +0.5 * (lb.width + rb.width),
        Math.max(lb.bottom, rb.bottom),
        -0.5 * (lb.width + rb.width)
      );

    } else if(img instanceof image.Above) {
      let tb = BoundingBox.forImage(img.top);
      let bb = BoundingBox.forImage(img.bottom);
      return new BoundingBox(
        -0.5 * (tb.height + bb.height),
        Math.max(tb.right, bb.right),
        +0.5 * (tb.height + bb.height),
        Math.min(tb.left, bb.left)
      );

    // } else if(img instanceof image.At) {
    //   let point = img.point;
    //   let child = img.image;
    //   return BoundingBox.forImage(child).translate(point);

    // } else if(img instanceof image.ContextTransform) {
    //   return BoundingBox.forImage(img.child);

    // } else if(img instanceof image.Drawable) {
    //   return BoundingBox.forImage(img.draw());

    } else {
      throw new Error("BoundingBox.forImage(): image type not recognised: " + img);
    }
  }
}
