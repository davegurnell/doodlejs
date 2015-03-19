import _ from 'underscore';
import $ from 'jquery';

import CodeMirror   from 'codemirror/lib/codemirror';
import CodeMirrorJs from 'codemirror/mode/javascript/javascript';

/*
 * Code needed to run the demo page in index.html.
 *
 * Not a core part of the DoodleJS distribution.
 */

// string -> string
function stripMargin(text) {
  let leadingWs = text.match( /^\n?(\s*)/ )[1].length;
  let leadingTabs = text.match( /^\n?(\t*)/ )[1].length;

  if( leadingTabs > 0 ) {
    text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
  }
  
  if( leadingWs > 1 ) {
    text = text.replace( new RegExp('\\n? {' + leadingWs + '}','g'), '\n' );
  }

  return text.trim();
}

// string string -> string
function wrapScript(canvasId, code) {
  return `
    (function() {
      var _              = require('underscore');
      var doodle         = require('doodle');
      var Image          = doodle.image.Image;
      var Circle         = doodle.image.Circle;
      var Rectangle      = doodle.image.Rectangle;
      var Triangle       = doodle.image.Triangle;
      var Above          = doodle.image.Above;
      var Beside         = doodle.image.Beside;
      var Overlay        = doodle.image.Overlay;
      var StyleTransform = doodle.image.StyleTransform;

      var circle         = doodle.image.circle;
      var rectangle      = doodle.image.rectangle;
      var triangle       = doodle.image.triangle;
      var above          = doodle.image.above;
      var below          = doodle.image.below;
      var beside         = doodle.image.beside;
      var on             = doodle.image.on;
      var under          = doodle.image.under;

      function draw(img) {
        doodle.canvas.defaultStyle.strokeStyle = 'white';
        doodle.canvas.draw('${canvasId}', img);
      }

      ${code}
    })();
  `;
}

export var defaultCode = stripMargin("draw(new Circle(10));");

function editorConfig(code) {
  return {
    lineNumbers: true,
    mode: { name: 'javascript', json: true },
    scrollbarStyle: 'null',
    tabSize: 2,
    theme: 'monokai',
    value: code,
    viewportMargin: Infinity
  };
}

export function init(textarea, canvas) {
  textarea = $(textarea);
  canvas = $(canvas);

  let editor = CodeMirror.fromTextArea(
    textarea.get(0),
    editorConfig(defaultCode)
  );

  canvas.attr({
    id     : canvas.attr('id') || 'canvas',
    width  : canvas.width(),
    height : canvas.height()
  });

  function compile() {
    let canvasId    = canvas.attr('id');
    let code        = editor.getValue();
    let wrappedCode = wrapScript(canvasId, code);
    try {
      eval(wrappedCode);
    } finally {
      editor.refresh();
    }
  }

  editor.setOption('extraKeys', {
    'Cmd-Enter': compile,
    'Ctrl-Enter': compile
  });
}
