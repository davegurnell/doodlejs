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
  boundingBox
} from './bounds';

// Styles
export var defaultStyle = {
  strokeStyle : 'black', // or(string null)
  fillStyle   : null,    // or(string null)
  lineWidth   : 1        // or(string number null)
};

// CanvasContext Image Number -> Void
export function draw(ctx, image, margin = 10) {
  if(typeof ctx == 'string') {
    ctx = document.getElementById(ctx).getContext('2d');
  } else if(ctx instanceof HTMLElement) {
    ctx = ctx.getContext('2d');
  }

  let bounds = boundingBox(image);
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

// CanvasContext BoundingBox Styles Image -> Void
function drawImage(ctx, bounds, style, image) {
  if(image instanceof Circle) {
    let origin = bounds.center;
    let radius = image.radius;

    ctx.beginPath();
    ctx.arc(origin.x, origin.y, radius, 0.0, Math.PI * 2);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Rectangle) {
    let origin = bounds.center;
    let width  = image.width;
    let height = image.height;

    ctx.beginPath();
    ctx.rect(origin.x - width/2, origin.y - height/2, width, height);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Triangle) {
    let origin = bounds.center;
    let width  = image.width;
    let height = image.height;

    ctx.beginPath();
    ctx.moveTo(origin.x       , origin.y - height/2);
    ctx.lineTo(origin.x + width/2 , origin.y + height/2);
    ctx.lineTo(origin.x - width/2 , origin.y + height/2);
    ctx.closePath();
    strokeAndFill(ctx, style);

  } else if(image instanceof Above) {
    let iBounds = boundingBox(image);
    let tBounds = boundingBox(image.top);
    let bBounds = boundingBox(image.bottom);

    let origin  = bounds.center;
    let tOrigin = origin.add(Vec.xy(0, iBounds.top    + 0.5 * tBounds.height));
    let bOrigin = origin.add(Vec.xy(0, iBounds.bottom - 0.5 * bBounds.height));

    drawImage(ctx, tBounds.translate(tOrigin), style, image.top);
    drawImage(ctx, bBounds.translate(bOrigin), style, image.bottom);

  } else if(image instanceof Beside) {
    let iBounds = boundingBox(image);
    let lBounds = boundingBox(image.left);
    let rBounds = boundingBox(image.right);

    let origin  = bounds.center;
    let lOrigin = origin.add(Vec.xy(iBounds.left  + 0.5 * lBounds.width, 0));
    let rOrigin = origin.add(Vec.xy(iBounds.right - 0.5 * rBounds.width, 0));

    drawImage(ctx, lBounds.translate(lOrigin), style, image.left);
    drawImage(ctx, rBounds.translate(rOrigin), style, image.right);

  } else if(image instanceof Overlay) {
    let origin  = bounds.center;
    let tBounds = boundingBox(image.top);
    let bBounds = boundingBox(image.bottom);

    drawImage(ctx, bBounds.translate(origin), style, image.bottom);
    drawImage(ctx, tBounds.translate(origin), style, image.top);

  } else if(image instanceof StyleTransform) {
    let child = image.image;
    let func  = image.transform;

    style = _.extend({}, style);

    drawImage(ctx, bounds, func(style), child);

  } else {
    throw new Error("drawImage(): image not recognised: " + image);
  }
}

// CanvasContext Style -> Void
function strokeAndFill(ctx, style) {
  // String -> Any
  function chooseStyle(key) {
    return style[key] == null ? defaultStyle[key] : style[key];
  }

  let strokeStyle = ctx.strokeStyle = chooseStyle('strokeStyle');
  let fillStyle   = ctx.fillStyle   = chooseStyle('fillStyle');
  let lineWidth   = ctx.lineWidth   = chooseStyle('lineWidth');

  if(strokeStyle && lineWidth) {
    ctx.stroke();
  }

  if(fillStyle) {
    ctx.fill();
  }
}
