import _ from 'underscore';
import { Vec } from './math';
import * as image from './image';
import { BoundingBox } from './bounds';

export function draw(ctx, img, margin = 10) {
  if(typeof ctx == 'string') {
    ctx = document.getElementById(ctx).getContext('2d');
  } else if(ctx instanceof HTMLElement) {
    ctx = ctx.getContext('2d');
  }

  let bounds = BoundingBox.forImage(img);

  let scale = Math.min(
    (ctx.canvas.width  - 2*margin) / bounds.width,
    (ctx.canvas.height - 2*margin) / bounds.height
  );

  let center = Vec.xy(
    ctx.canvas.width  / 2,
    ctx.canvas.height / 2
  );

  ctx.resetTransform();
  ctx.translate(center.x, center.y);
  ctx.scale(scale, scale);

  drawImage(ctx, bounds, img);
}

function drawImage(ctx, bounds, img) {
  let origin = bounds.center;

  // if(img instanceof image.Path) {
  //   ctx.beginPath();
  //   _.each(elts, elt => drawPathElement(ctx, origin, elt));
  //   ctx.closePath();
  //   strokeAndFill(ctx);

  // } else
  if(img instanceof image.Circle) {
    let r = img.radius;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, r, 0.0, Math.PI * 2);
    ctx.closePath();
    strokeAndFill(ctx);

  } else if(img instanceof image.Rectangle) {
    let w = img.width;
    let h = img.height;
    ctx.beginPath();
    ctx.rect(origin.x - w/2, origin.y - h/2, w, h);
    ctx.closePath();
    strokeAndFill(ctx);

  } else if(img instanceof image.Triangle) {
    let w = img.width;
    let h = img.height;
    ctx.beginPath();
    ctx.moveTo(origin.x       , origin.y - h/2);
    ctx.lineTo(origin.x + w/2 , origin.y + h/2);
    ctx.lineTo(origin.x - w/2 , origin.y + h/2);
    ctx.closePath();
    strokeAndFill(ctx);

  } else if(img instanceof image.Overlay) {
    let tBounds = BoundingBox.forImage(img.top);
    let bBounds = BoundingBox.forImage(img.bottom);

    drawImage(ctx, bBounds.translate(origin), img.bottom);
    drawImage(ctx, tBounds.translate(origin), img.top);

  } else if(img instanceof image.Beside) {
    let iBounds = BoundingBox.forImage(img);
    let lBounds = BoundingBox.forImage(img.left);
    let rBounds = BoundingBox.forImage(img.right);

    let lOrigin = origin.add(Vec.xy(iBounds.left  + 0.5 * lBounds.width, 0));
    let rOrigin = origin.add(Vec.xy(iBounds.right - 0.5 * rBounds.width, 0));

    drawImage(ctx, lBounds.translate(lOrigin), img.left);
    drawImage(ctx, rBounds.translate(rOrigin), img.right);

  } else if(img instanceof image.Above) {
    let iBounds = BoundingBox.forImage(img);
    let tBounds = BoundingBox.forImage(img.top);
    let bBounds = BoundingBox.forImage(img.bottom);

    let tOrigin = origin.add(Vec.xy(0, iBounds.top    + 0.5 * tBounds.height));
    let bOrigin = origin.add(Vec.xy(0, iBounds.bottom - 0.5 * bBounds.height));

    drawImage(ctx, tBounds.translate(tOrigin), img.top);
    drawImage(ctx, bBounds.translate(bOrigin), img.bottom);

  // } else if(img instanceof At) {
  //   drawImage(ctx, bounds.translate(img.point), img.image);
  // }

  // } else if(img instanceof ContextTransform) {
  //   drawImage(ctx, bounds, img.image);
  // }

  // } else if(img instanceof Drawable) {
  //   drawImage(ctx, bounds, img.draw());

  } else {
    throw new Error("drawImage(): image not recognised: " + img);
  }
}

// function drawPathElement(ctx, origin, elt) {
//   if(elt instanceof MoveTo) {
//     ctx.moveTo(origin.x + elt.pos.x, origin.y + elt.pos.y);

//   } else if(elt instanceof LineTo) {
//     ctx.lineTo(origin.x + elt.pos.x, origin.y + elt.pos.y);

//   } else if(elt instanceof BezierCurveTo) {
//     ctx.bezierCurveTo(
//       origin.x + elt.cp1.x, origin.y + elt.cp1.y,
//       origin.x + elt.cp2.x, origin.y + elt.cp2.y,
//       origin.x + elt.pos.x, origin.y + elt.pos.y
//     );

//   } else {
//     throw new Error("drawPathElement(): path element not recognised: " + elt);
//   }
// }

function strokeAndFill(ctx) {
  ctx.lineWidth   = '1px';
  ctx.strokeStyle = 'black';
  ctx.stroke();
}
