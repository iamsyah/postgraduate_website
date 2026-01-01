/**
 * Animated Path System
 * Provides animated path drawing with a moving dot along the route
 */

/**
 * Animate a path with a moving dot
 * @param {SVGElement} svg - The SVG element to draw on
 * @param {Array<Array<number>>} points - Array of [x, y] points
 * @param {Object} options - Animation options
 * @returns {Object} - Control object with stop() method
 */
export function animatePath(svg, points, options = {}) {
  const {
    pathColor = '#606060', // Black color for path dots
    pathWidth = 4,
    dotColor = '#FFFF00', // Yellow color for moving dot
    dotRadius = 6,
    arrowColor = '#FF0000', // Black color for arrows (defaults to pathColor)
    duration = 3000, // milliseconds
    onComplete = null
  } = options;

  if (!points || points.length < 2) return null;

  const ns = "http://www.w3.org/2000/svg";
  let animationId = null;
  let startTime = null;
  let isStopped = false;

  // Calculate total path length
  let totalLength = 0;
  const segmentLengths = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dy = points[i + 1][1] - points[i][1];
    const length = Math.hypot(dx, dy);
    segmentLengths.push(length);
    totalLength += length;
  }

  // Helper function to create arrow marker
  function createArrowMarker(ns, x, y, angle, color) {
    const arrowSize = 8;
    const arrow = document.createElementNS(ns, "g");
    // Convert angle to degrees and rotate (SVG rotate is clockwise, so no need to negate)
    const angleDegrees = angle * 180 / Math.PI;
    arrow.setAttribute("transform", `translate(${x}, ${y}) rotate(${angleDegrees})`);
    
    const arrowPath = document.createElementNS(ns, "path");
    // Arrow pointing to the right (positive x direction)
    // Tip is at (arrowSize, 0), base forms the arrowhead pointing forward
    const arrowPoints = `M ${arrowSize},0 L 0,-${arrowSize/2} L ${arrowSize*0.3},0 L 0,${arrowSize/2} Z`;
    arrowPath.setAttribute("d", arrowPoints);
    arrowPath.setAttribute("fill", color);
    arrowPath.setAttribute("stroke", color);
    arrowPath.setAttribute("stroke-width", "1");
    
    arrow.appendChild(arrowPath);
    return arrow;
  }

  // Helper function to calculate point at distance along path
  function getPointAtDistance(distance) {
    let accumulatedLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      const segmentLength = Math.hypot(dx, dy);
      
      if (accumulatedLength + segmentLength >= distance) {
        const t = (distance - accumulatedLength) / segmentLength;
        const x = points[i][0] + dx * t;
        const y = points[i][1] + dy * t;
        const angle = Math.atan2(dy, dx);
        return { x, y, angle };
      }
      accumulatedLength += segmentLength;
    }
    return null;
  }

  // Create path element for the dotted line
  const pathElement = document.createElementNS(ns, "path");
  const pathData = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  pathElement.setAttribute("d", pathData);
  pathElement.setAttribute("fill", "none");
  pathElement.setAttribute("stroke", pathColor);
  pathElement.setAttribute("stroke-width", pathWidth);
  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-linejoin", "round");
  // Dotted pattern: 2px dot, 8px gap (creates visible dots)
  pathElement.setAttribute("stroke-dasharray", "2, 8");
  pathElement.classList.add("path-line", "animated-path");
  svg.appendChild(pathElement);

  // Create arrow markers at regular intervals (every 5th dot)
  const arrowElements = [];
  const dotInterval = 10; // Distance between dots
  const arrowInterval = dotInterval * 5; // Every 5th dot = every 50 units
  
  // Create arrows along the path
  for (let dist = arrowInterval; dist < totalLength; dist += arrowInterval) {
    const pos = getPointAtDistance(dist);
    if (pos) {
      const arrow = createArrowMarker(ns, pos.x, pos.y, pos.angle, arrowColor);
      arrow.classList.add("path-arrow");
      svg.appendChild(arrow);
      arrowElements.push(arrow);
    }
  }

  // Create animated dot
  const dotElement = document.createElementNS(ns, "circle");
  dotElement.setAttribute("r", dotRadius);
  dotElement.setAttribute("fill", dotColor);
  dotElement.setAttribute("stroke", "#FFFFFF");
  dotElement.setAttribute("stroke-width", "2");
  dotElement.classList.add("path-dot");
  svg.appendChild(dotElement);

  // Position dot at start
  dotElement.setAttribute("cx", points[0][0]);
  dotElement.setAttribute("cy", points[0][1]);

  // Animation function
  function animate(currentTime) {
    if (isStopped) return;

    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Calculate position along path
    const pathProgress = progress;
    const currentLength = totalLength * pathProgress;

    // Find which segment we're in
    let accumulatedLength = 0;
    let segmentIndex = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      if (accumulatedLength + segmentLengths[i] >= currentLength) {
        segmentIndex = i;
        break;
      }
      accumulatedLength += segmentLengths[i];
      segmentIndex = i + 1;
    }

    // Clamp to valid segment
    segmentIndex = Math.min(segmentIndex, points.length - 2);

    // Calculate position within current segment
    const segmentStartLength = accumulatedLength - (segmentLengths[segmentIndex] || 0);
    const segmentProgress = (currentLength - segmentStartLength) / (segmentLengths[segmentIndex] || 1);
    const t = Math.max(0, Math.min(1, segmentProgress));

    const startPoint = points[segmentIndex];
    const endPoint = points[segmentIndex + 1] || startPoint;

    // Interpolate position
    const dotX = startPoint[0] + (endPoint[0] - startPoint[0]) * t;
    const dotY = startPoint[1] + (endPoint[1] - startPoint[1]) * t;

    // Update dot position
    dotElement.setAttribute("cx", dotX);
    dotElement.setAttribute("cy", dotY);

    // Show arrows up to current progress (they're already created, just control visibility)
    arrowElements.forEach((arrow, index) => {
      const arrowDistance = (index + 1) * arrowInterval;
      arrow.style.opacity = arrowDistance <= currentLength ? "1" : "0";
    });

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Animation complete - show all arrows
      arrowElements.forEach(arrow => arrow.style.opacity = "1");
      if (onComplete) onComplete();
    }
  }

  // Start animation
  animationId = requestAnimationFrame(animate);

  // Return control object
  return {
    stop: () => {
      isStopped = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (pathElement.parentNode) {
        pathElement.remove();
      }
      if (dotElement.parentNode) {
        dotElement.remove();
      }
      arrowElements.forEach(arrow => {
        if (arrow.parentNode) {
          arrow.remove();
        }
      });
    },
    getElements: () => [pathElement, dotElement, ...arrowElements]
  };
}

