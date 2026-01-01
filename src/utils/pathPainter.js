/**
 * Path Painter System - Similar to Flutter's CustomPainter
 * 
 * Provides a canvas-like API for drawing paths on SVG
 */

/**
 * Paint class - Defines visual properties for drawing
 */
export class Paint {
  constructor(options = {}) {
    this.color = options.color || '#FF0000';
    this.strokeWidth = options.strokeWidth || 4;
    this.style = options.style || 'stroke'; // 'stroke' or 'fill'
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.strokeCap = options.strokeCap || 'round'; // 'butt', 'round', 'square'
    this.strokeJoin = options.strokeJoin || 'round'; // 'miter', 'round', 'bevel'
    this.dashArray = options.dashArray || null; // e.g., [10, 5] for dashed line
  }

  // Create a Paint object for stroke
  static stroke(color, width = 4) {
    return new Paint({ color, strokeWidth: width, style: 'stroke' });
  }

  // Create a Paint object for fill
  static fill(color) {
    return new Paint({ color, style: 'fill' });
  }
}

/**
 * Path class - Represents a series of connected lines and curves
 */
export class Path {
  constructor() {
    this.commands = [];
    this.currentX = 0;
    this.currentY = 0;
  }

  // Move to a point (without drawing)
  moveTo(x, y) {
    this.commands.push({ type: 'M', x, y });
    this.currentX = x;
    this.currentY = y;
    return this;
  }

  // Draw a line to a point
  lineTo(x, y) {
    this.commands.push({ type: 'L', x, y });
    this.currentX = x;
    this.currentY = y;
    return this;
  }

  // Draw a quadratic bezier curve
  quadraticBezierTo(controlX, controlY, endX, endY) {
    this.commands.push({ type: 'Q', x1: controlX, y1: controlY, x: endX, y: endY });
    this.currentX = endX;
    this.currentY = endY;
    return this;
  }

  // Draw a cubic bezier curve
  cubicBezierTo(controlX1, controlY1, controlX2, controlY2, endX, endY) {
    this.commands.push({ type: 'C', x1: controlX1, y1: controlY1, x2: controlX2, y2: controlY2, x: endX, y: endY });
    this.currentX = endX;
    this.currentY = endY;
    return this;
  }

  // Close the path
  close() {
    this.commands.push({ type: 'Z' });
    return this;
  }

  // Add multiple points as a polyline
  addPolyline(points) {
    if (points.length === 0) return this;
    
    // Move to first point
    this.moveTo(points[0][0], points[0][1]);
    
    // Line to each subsequent point
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i][0], points[i][1]);
    }
    
    return this;
  }

  // Convert path commands to SVG path string
  toSVGPathString() {
    const parts = [];
    
    for (const cmd of this.commands) {
      switch (cmd.type) {
        case 'M':
          parts.push(`M ${cmd.x} ${cmd.y}`);
          break;
        case 'L':
          parts.push(`L ${cmd.x} ${cmd.y}`);
          break;
        case 'Q':
          parts.push(`Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y}`);
          break;
        case 'C':
          parts.push(`C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y}`);
          break;
        case 'Z':
          parts.push('Z');
          break;
      }
    }
    
    return parts.join(' ');
  }

  // Reset the path
  reset() {
    this.commands = [];
    this.currentX = 0;
    this.currentY = 0;
    return this;
  }
}

/**
 * CustomPainter class - Base class for custom painting
 */
export class CustomPainter {
  constructor() {
    this.shouldRepaintCallback = null;
  }

  /**
   * Override this method to implement custom drawing
   * @param {Canvas} canvas - The canvas to draw on
   * @param {Size} size - The size of the canvas
   */
  paint(canvas, size) {
    // Override in subclass
  }

  /**
   * Override this method to determine if repainting is needed
   * @param {CustomPainter} oldDelegate - The previous painter
   * @returns {boolean} - True if repaint is needed
   */
  shouldRepaint(oldDelegate) {
    if (this.shouldRepaintCallback) {
      return this.shouldRepaintCallback(oldDelegate);
    }
    return true; // Default: always repaint
  }

  setShouldRepaint(callback) {
    this.shouldRepaintCallback = callback;
  }
}

/**
 * Canvas class - Provides drawing methods similar to Flutter's Canvas
 */
export class Canvas {
  constructor(svgElement) {
    this.svg = svgElement;
    this.ns = "http://www.w3.org/2000/svg";
    this.elements = [];
  }

  /**
   * Draw a path on the canvas
   * @param {Path} path - The path to draw
   * @param {Paint} paint - The paint style to use
   */
  drawPath(path, paint) {
    const pathElement = document.createElementNS(this.ns, "path");
    pathElement.setAttribute("d", path.toSVGPathString());
    
    if (paint.style === 'fill') {
      pathElement.setAttribute("fill", paint.color);
      pathElement.setAttribute("fill-opacity", paint.opacity);
    } else {
      pathElement.setAttribute("fill", "none");
      pathElement.setAttribute("stroke", paint.color);
      pathElement.setAttribute("stroke-width", paint.strokeWidth);
      pathElement.setAttribute("stroke-opacity", paint.opacity);
      pathElement.setAttribute("stroke-linecap", paint.strokeCap);
      pathElement.setAttribute("stroke-linejoin", paint.strokeJoin);
      
      if (paint.dashArray) {
        pathElement.setAttribute("stroke-dasharray", paint.dashArray.join(','));
      }
    }
    
    this.svg.appendChild(pathElement);
    this.elements.push(pathElement);
    return pathElement;
  }

  /**
   * Draw a line
   * @param {number} x1 - Start x
   * @param {number} y1 - Start y
   * @param {number} x2 - End x
   * @param {number} y2 - End y
   * @param {Paint} paint - The paint style
   */
  drawLine(x1, y1, x2, y2, paint) {
    const path = new Path();
    path.moveTo(x1, y1).lineTo(x2, y2);
    return this.drawPath(path, paint);
  }

  /**
   * Draw a circle
   * @param {number} x - Center x
   * @param {number} y - Center y
   * @param {number} radius - Radius
   * @param {Paint} paint - The paint style
   */
  drawCircle(x, y, radius, paint) {
    const circle = document.createElementNS(this.ns, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    
    if (paint.style === 'fill') {
      circle.setAttribute("fill", paint.color);
      circle.setAttribute("fill-opacity", paint.opacity);
    } else {
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", paint.color);
      circle.setAttribute("stroke-width", paint.strokeWidth);
      circle.setAttribute("stroke-opacity", paint.opacity);
    }
    
    this.svg.appendChild(circle);
    this.elements.push(circle);
    return circle;
  }

  /**
   * Draw a polyline from points
   * @param {Array<Array<number>>} points - Array of [x, y] points
   * @param {Paint} paint - The paint style
   */
  drawPolyline(points, paint) {
    const path = new Path();
    path.addPolyline(points);
    return this.drawPath(path, paint);
  }

  /**
   * Clear all drawn elements
   */
  clear() {
    this.elements.forEach(el => el.remove());
    this.elements = [];
  }

  /**
   * Get all drawn elements
   */
  getElements() {
    return this.elements;
  }
}

/**
 * CustomPaint widget - React-like wrapper for CustomPainter
 */
export class CustomPaint {
  constructor(svgElement, painter, size = null) {
    this.svg = svgElement;
    this.painter = painter;
    this.size = size || this.getSVGSize();
    this.canvas = new Canvas(svgElement);
    this.oldPainter = null;
  }

  getSVGSize() {
    if (!this.svg) return { width: 0, height: 0 };
    const viewBox = this.svg.getAttribute('viewBox');
    if (viewBox) {
      const [, , width, height] = viewBox.split(' ').map(Number);
      return { width, height };
    }
    return {
      width: parseFloat(this.svg.getAttribute('width') || 0),
      height: parseFloat(this.svg.getAttribute('height') || 0)
    };
  }

  /**
   * Paint the canvas using the CustomPainter
   */
  paint() {
    // Check if repaint is needed
    if (this.oldPainter && !this.painter.shouldRepaint(this.oldPainter)) {
      return;
    }

    // Clear previous paint
    this.canvas.clear();

    // Paint using the custom painter
    this.painter.paint(this.canvas, this.size);

    // Store old painter for next comparison
    this.oldPainter = this.painter;
  }

  /**
   * Update the painter
   */
  setPainter(painter) {
    this.oldPainter = this.painter;
    this.painter = painter;
    this.paint();
  }

  /**
   * Update the size
   */
  setSize(size) {
    this.size = size;
    this.paint();
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.canvas.clear();
  }
}
