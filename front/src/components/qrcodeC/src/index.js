// @flow

'use strict';

var React = require('react');
var PropTypes = require('prop-types');
// qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.
var QRCodeImpl = require('qr.js/lib/QRCode');
var ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');

function getBackingStorePixelRatio(ctx: CanvasRenderingContext2D): number {
  return (
    // $FlowFixMe
    ctx.webkitBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.mozBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.msBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.oBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.backingStorePixelRatio ||
    1
  );
}

type Props = {
  value: string,
  size: number,
  level: $Keys<typeof ErrorCorrectLevel>,
  bgColor: string,
  fgColor: string,
  shiftTiles: number
};

class QRCode extends React.Component {
  props: Props;
  _canvas: ?HTMLCanvasElement;

  static defaultProps = {
    size: 128,
    level: 'L',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    size: PropTypes.number,
    level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
  };

  shouldComponentUpdate(nextProps: Props) {
    return Object.keys(QRCode.propTypes).some(
      k => this.props[k] !== nextProps[k]
    );
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {

    var {value, size, level, bgColor, fgColor, shiftTiles} = this.props;

    // We'll use type===-1 to force QRCode to automatically pick the best type
    var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(value);
    qrcode.make();

    if (this._canvas != null) {
      var canvas = this._canvas;

      var ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      var cells = qrcode.modules;
      if (cells === null) {
        return;
      }
      var tileW = size / cells.length;
      var tileH = size / cells.length;
      var scale =
        (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
      canvas.height = canvas.width = (size * scale);
      let oldHeight = canvas.height;
      let oldWidth = canvas.width;
      canvas.height += 2*scale*shiftTiles*tileH;
      canvas.width += 2*scale*shiftTiles*tileW;
      ctx.scale(scale, scale);
      ctx.fillStyle = 'white'

      ctx.fillRect(
        Math.round(0),
        Math.round(0),
        oldHeight + 2*scale*shiftTiles*tileH,
        oldWidth + 2*scale*shiftTiles*tileW
      );
      cells.forEach(function(row, rdx) {
        row.forEach(function(cell, cdx) {
          ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
          var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx &&
            ctx.fillRect(
              Math.round(cdx * tileW + shiftTiles*tileW),
              Math.round(rdx * tileH + shiftTiles*tileH),
              w,
              h
            );
        });
      });
    }
  }

  render() {
    return (
      <canvas
        style={{height: this.props.size, width: this.props.size}}
        height={this.props.size}
        width={this.props.size}
        ref={(ref: ?HTMLCanvasElement): ?HTMLCanvasElement =>
          this._canvas = ref}
      />
    );
  }
}

module.exports = QRCode;
