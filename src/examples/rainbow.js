import { triangle } from '../core/image';

function color(hue) {
  return "hsl(" + hue + ", 100%, 50%)";
}

export default function rainbow(size = 512, hue = 0) {
  if(size <= 10) {
    return triangle(size, size).noStroke().fill(color(hue));
  } else {
    var delta = 120.0 * (size / 512.0);
    var top   = rainbow(size/2, hue + delta);
    var left  = rainbow(size/2, hue + 2*delta);
    var riht  = rainbow(size/2, hue + 3*delta);
    return top.above(left.beside(right));
  }
}
