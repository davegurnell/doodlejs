import _ from 'underscore';

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

import {
  BoundingBox
} from './bounds';

export var defaultStyle = {
  strokeStyle : 'black', // or(string null)
  fillStyle   : null,    // or(string null)
  lineWidth   : 1        // or(string number null)
};

export function draw(ctx, image, margin = 10) {
  if(typeof ctx == 'string') {
    ctx = document.getElementById(ctx).getContext('2d');
  } else if(ctx instanceof HTMLElement) {
    ctx = ctx.getContext('2d');
  }

  let bounds = BoundingBox.forImage(image);
  let style = _.extend({}, defaultStyle);

  let scale = Math.min(
    (ctx.canvas.width  - 2*margin) / bounds.width,
    (ctx.canvas.height - 2*margin) / bounds.height
  );

  let center = Vec.xy(
    ctx.canvas.width  / 2,
    ctx.canvas.height / 2
  );

  ctx.resetTransform();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(center.x, center.y);
  
  if(scale < 1.0) {
    ctx.scale(scale, scale);
  }

  drawImage(ctx, bounds, style, image);
}

function drawImage(ctx, bounds, style, image) {
  if(image instanceof Circle) {
    let r = image.radius;
    let origin = bounds.center;

    ctx.beginPath();
    ctx.arc(origin.x, origin.y, r, 0.0, Math.PI * 2);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Rectangle) {
    let w = image.width;
    let h = image.height;
    let origin = bounds.center;

    ctx.beginPath();
    ctx.rect(origin.x - w/2, origin.y - h/2, w, h);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Triangle) {
    let w = image.width;
    let h = image.height;
    let origin = bounds.center;

    ctx.beginPath();
    ctx.moveTo(origin.x       , origin.y - h/2);
    ctx.lineTo(origin.x + w/2 , origin.y + h/2);
    ctx.lineTo(origin.x - w/2 , origin.y + h/2);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Overlay) {
    let origin = bounds.center;
    let tBounds = BoundingBox.forImage(image.top);
    let bBounds = BoundingBox.forImage(image.bottom);

    drawImage(ctx, bBounds.translate(origin), style, image.bottom);
    drawImage(ctx, tBounds.translate(origin), style, image.top);

  } else if(image instanceof Beside) {
    let iBounds = BoundingBox.forImage(image);
    let lBounds = BoundingBox.forImage(image.left);
    let rBounds = BoundingBox.forImage(image.right);

    let origin = bounds.center;
    let lOrigin = origin.add(Vec.xy(iBounds.left  + 0.5 * lBounds.width, 0));
    let rOrigin = origin.add(Vec.xy(iBounds.right - 0.5 * rBounds.width, 0));

    drawImage(ctx, lBounds.translate(lOrigin), style, image.left);
    drawImage(ctx, rBounds.translate(rOrigin), style, image.right);

  } else if(image instanceof Above) {
    let iBounds = BoundingBox.forImage(image);
    let tBounds = BoundingBox.forImage(image.top);
    let bBounds = BoundingBox.forImage(image.bottom);

    let origin = bounds.center;
    let tOrigin = origin.add(Vec.xy(0, iBounds.top    + 0.5 * tBounds.height));
    let bOrigin = origin.add(Vec.xy(0, iBounds.bottom - 0.5 * bBounds.height));

    drawImage(ctx, tBounds.translate(tOrigin), style, image.top);
    drawImage(ctx, bBounds.translate(bOrigin), style, image.bottom);

  } else if(image instanceof StyleTransform) {
    drawImage(ctx, bounds, image.transform(style), image.image);

  } else {
    throw new Error("drawImage(): image not recognised: " + image);
  }
}

function strokeAndFill(ctx, style) {
  function chooseStyle(value, orElse) {
    return value == null ? orElse : value;
  }

  let strokeStyle = ctx.strokeStyle = chooseStyle(style.strokeStyle, defaultStyle.strokeStyle);
  let fillStyle   = ctx.fillStyle   = chooseStyle(style.fillStyle,   defaultStyle.fillStyle);
  let lineWidth   = ctx.lineWidth   = chooseStyle(style.lineWidth,   defaultStyle.lineWidth);

  if(strokeStyle && lineWidth) {
    ctx.stroke();
  }

  if(fillStyle) {
    ctx.fill();
  }
}
