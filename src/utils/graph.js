// Helper: Check if two line segments intersect
// Line 1: (x1,y1) to (x2,y2), Line 2: (x3,y3) to (x4,y4)
// Returns true if segments intersect or are very close (to catch near-misses)
function lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 0.0001) {
    // Parallel lines - check if they're collinear and overlapping
    // For now, treat parallel lines as non-intersecting (unless they're very close)
    return false;
  }
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  
  // Check if intersection point is within both line segments
  // Use tighter bounds to catch intersections near endpoints
  // This is more conservative - rejects edges that even slightly touch walls
  return ua >= -0.01 && ua <= 1.01 && ub >= -0.01 && ub <= 1.01;
}

// Helper: Point-in-polygon test using ray casting algorithm
// Returns true if point (x, y) is inside the polygon defined by points array
function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper: Get all points from wall segments to form a polygon
function getWallPolygonPoints(wallSegments) {
  if (wallSegments.length === 0) return [];
  
  const points = [];
  const seen = new Set();
  
  // Collect unique points from segments
  for (const seg of wallSegments) {
    const key1 = `${seg.x1.toFixed(2)},${seg.y1.toFixed(2)}`;
    const key2 = `${seg.x2.toFixed(2)},${seg.y2.toFixed(2)}`;
    
    if (!seen.has(key1)) {
      seen.add(key1);
      points.push({ x: seg.x1, y: seg.y1 });
    }
    if (!seen.has(key2)) {
      seen.add(key2);
      points.push({ x: seg.x2, y: seg.y2 });
    }
  }
  
  return points;
}

// Helper: Approximate a cubic Bezier curve with line segments
function approximateCubicBezier(x1, y1, x2, y2, x3, y3, x4, y4, steps = 10) {
  const segments = [];
  for (let i = 0; i < steps; i++) {
    const t1 = i / steps;
    const t2 = (i + 1) / steps;
    
    const p1 = bezierPoint(x1, x2, x3, x4, t1);
    const q1 = bezierPoint(y1, y2, y3, y4, t1);
    const p2 = bezierPoint(x1, x2, x3, x4, t2);
    const q2 = bezierPoint(y1, y2, y3, y4, t2);
    
    segments.push({ x1: p1, y1: q1, x2: p2, y2: q2 });
  }
  return segments;
}

function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

// Helper: Approximate a quadratic Bezier curve with line segments
function approximateQuadraticBezier(x1, y1, x2, y2, x3, y3, steps = 10) {
  const segments = [];
  for (let i = 0; i < steps; i++) {
    const t1 = i / steps;
    const t2 = (i + 1) / steps;
    
    const p1 = quadBezierPoint(x1, x2, x3, t1);
    const q1 = quadBezierPoint(y1, y2, y3, t1);
    const p2 = quadBezierPoint(x1, x2, x3, t2);
    const q2 = quadBezierPoint(y1, y2, y3, t2);
    
    segments.push({ x1: p1, y1: q1, x2: p2, y2: q2 });
  }
  return segments;
}

function quadBezierPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

// Helper: Parse SVG path 'd' attribute into line segments for collision detection
// Now handles curves by approximating them with line segments
function parsePathToSegments(pathD) {
  if (!pathD) return [];
  
  const segments = [];
  const commands = pathD.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  
  let currentX = 0, currentY = 0;
  let startX = 0, startY = 0;
  let prevControlX = 0, prevControlY = 0; // For smooth curves
  
  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const isRelative = cmd[0] !== type;
    const nums = cmd.slice(1).trim().match(/-?[\d.]+/g)?.map(Number) || [];
    
    if (type === 'M') {
      currentX = (isRelative ? currentX : 0) + (nums[0] || 0);
      currentY = (isRelative ? currentY : 0) + (nums[1] || 0);
      startX = currentX;
      startY = currentY;
      // Handle implicit L commands after M
      for (let i = 2; i < nums.length; i += 2) {
        const newX = (isRelative ? currentX : 0) + nums[i];
        const newY = (isRelative ? currentY : 0) + (nums[i + 1] || 0);
        if (newX !== undefined && newY !== undefined) {
          segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });
          currentX = newX;
          currentY = newY;
        }
      }
    } else if (type === 'L') {
      for (let i = 0; i < nums.length; i += 2) {
        const newX = (isRelative ? currentX : 0) + nums[i];
        const newY = (isRelative ? currentY : 0) + (nums[i + 1] || 0);
        if (newX !== undefined && newY !== undefined) {
          segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });
          currentX = newX;
          currentY = newY;
        }
      }
    } else if (type === 'H') {
      const newX = (isRelative ? currentX : 0) + nums[0];
      if (newX !== undefined) {
        segments.push({ x1: currentX, y1: currentY, x2: newX, y2: currentY });
        currentX = newX;
      }
    } else if (type === 'V') {
      const newY = (isRelative ? currentY : 0) + nums[0];
      if (newY !== undefined) {
        segments.push({ x1: currentX, y1: currentY, x2: currentX, y2: newY });
        currentY = newY;
      }
    } else if (type === 'C') {
      // Cubic Bezier curve: C x1 y1 x2 y2 x y
      for (let i = 0; i < nums.length; i += 6) {
        if (i + 5 < nums.length) {
          const x1 = currentX;
          const y1 = currentY;
          const x2 = (isRelative ? currentX : 0) + nums[i];
          const y2 = (isRelative ? currentY : 0) + nums[i + 1];
          const x3 = (isRelative ? currentX : 0) + nums[i + 2];
          const y3 = (isRelative ? currentY : 0) + nums[i + 3];
          const x4 = (isRelative ? currentX : 0) + nums[i + 4];
          const y4 = (isRelative ? currentY : 0) + nums[i + 5];
          
          segments.push(...approximateCubicBezier(x1, y1, x2, y2, x3, y3, x4, y4));
          currentX = x4;
          currentY = y4;
          prevControlX = x3;
          prevControlY = y3;
        }
      }
    } else if (type === 'S') {
      // Smooth cubic Bezier: S x2 y2 x y (uses reflection of previous control point)
      for (let i = 0; i < nums.length; i += 4) {
        if (i + 3 < nums.length) {
          const x1 = currentX;
          const y1 = currentY;
          const x2 = 2 * currentX - prevControlX; // Reflected control point
          const y2 = 2 * currentY - prevControlY;
          const x3 = (isRelative ? currentX : 0) + nums[i];
          const y3 = (isRelative ? currentY : 0) + nums[i + 1];
          const x4 = (isRelative ? currentX : 0) + nums[i + 2];
          const y4 = (isRelative ? currentY : 0) + nums[i + 3];
          
          segments.push(...approximateCubicBezier(x1, y1, x2, y2, x3, y3, x4, y4));
          currentX = x4;
          currentY = y4;
          prevControlX = x3;
          prevControlY = y3;
        }
      }
    } else if (type === 'Q') {
      // Quadratic Bezier: Q x1 y1 x y
      for (let i = 0; i < nums.length; i += 4) {
        if (i + 3 < nums.length) {
          const x1 = currentX;
          const y1 = currentY;
          const x2 = (isRelative ? currentX : 0) + nums[i];
          const y2 = (isRelative ? currentY : 0) + nums[i + 1];
          const x3 = (isRelative ? currentX : 0) + nums[i + 2];
          const y3 = (isRelative ? currentY : 0) + nums[i + 3];
          
          segments.push(...approximateQuadraticBezier(x1, y1, x2, y2, x3, y3));
          currentX = x3;
          currentY = y3;
          prevControlX = x2;
          prevControlY = y2;
        }
      }
    } else if (type === 'T') {
      // Smooth quadratic Bezier: T x y (uses reflection)
      for (let i = 0; i < nums.length; i += 2) {
        if (i + 1 < nums.length) {
          const x1 = currentX;
          const y1 = currentY;
          const x2 = 2 * currentX - prevControlX;
          const y2 = 2 * currentY - prevControlY;
          const x3 = (isRelative ? currentX : 0) + nums[i];
          const y3 = (isRelative ? currentY : 0) + nums[i + 1];
          
          segments.push(...approximateQuadraticBezier(x1, y1, x2, y2, x3, y3));
          currentX = x3;
          currentY = y3;
          prevControlX = x2;
          prevControlY = y2;
        }
      }
    } else if (type === 'Z') {
      if (currentX !== startX || currentY !== startY) {
        segments.push({ x1: currentX, y1: currentY, x2: startX, y2: startY });
      }
      currentX = startX;
      currentY = startY;
    }
    // Note: Arc (A) commands are complex - we skip them for now, but could be added
  }
  
  return segments;
}

// Check if a line from (x1,y1) to (x2,y2) crosses any wall segment
// Uses multiple sample points along the edge for better accuracy
function lineIntersectsWalls(x1, y1, x2, y2, wallSegments) {
  if (wallSegments.length === 0) return false;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  
  // Sample points along the edge (not just endpoints)
  // Use more samples for longer edges - increased density for better accuracy
  const numSamples = Math.max(5, Math.ceil(length / 5)); // Sample every ~5px for better detection
  const samples = [];
  
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    samples.push({
      x: x1 + dx * t,
      y: y1 + dy * t
    });
  }
  
  // Check each wall segment against each sample segment
  for (let i = 0; i < samples.length - 1; i++) {
    const p1 = samples[i];
    const p2 = samples[i + 1];
    
    for (const wall of wallSegments) {
      if (lineSegmentsIntersect(
        p1.x, p1.y, p2.x, p2.y,
        wall.x1, wall.y1, wall.x2, wall.y2
      )) {
        return true;
      }
    }
  }
  
  return false;
}

// Utility to build a navigation graph from an SVG element
export function buildNavGraphFromSvg(svg) {
  if (!svg) return null;
  const nodes = Object.create(null);
  
  // Extract wall segments from ALL wall-like elements for comprehensive collision detection
  // This includes: outline, room boundaries, stair boundaries, etc.
  let wallSegments = [];
  
  // 1. Find the main outline
  let outlinePath = svg.querySelector('#outline') ||
                    svg.querySelector('[id*="outline"]') ||
                    svg.querySelector('[id*="Outline"]') ||
                    svg.querySelector('path[id*="wall"]') ||
                    svg.querySelector('path[id*="Wall"]');
  
  if (!outlinePath) {
    outlinePath = svg.querySelector('.outline') ||
                  svg.querySelector('[class*="outline"]') ||
                  svg.querySelector('[data-type="outline"]');
  }
  
  // If still not found, try finding largest path
  if (!outlinePath) {
    const allPaths = svg.querySelectorAll('path');
    let largestPath = null;
    let largestArea = 0;
    
    for (const path of allPaths) {
      try {
        const bb = path.getBBox();
        const area = bb.width * bb.height;
        if (area > largestArea && area < svg.viewBox.baseVal.width * svg.viewBox.baseVal.height * 0.95) {
          largestArea = area;
          largestPath = path;
        }
      } catch {
        // Ignore
      }
    }
    outlinePath = largestPath;
  }
  
  // Add outline segments
  if (outlinePath) {
    const pathD = outlinePath.getAttribute('d');
    if (pathD) {
      const segments = parsePathToSegments(pathD);
      wallSegments.push(...segments);
      console.debug(`Loaded ${segments.length} wall segments from outline (id: ${outlinePath.id || 'unknown'})`);
    }
  }
  
  // 2. Add room boundaries as walls (but focus primarily on outline)
  // For now, we'll be conservative and only add room walls if needed
  // The main issue is with the outline, so we prioritize that
  // Room boundaries can be added, but they might block valid doorway paths
  // So we'll be selective - only add if they're clearly wall segments
  
  // First, collect nav_room node positions to identify doorway areas
  const navRoomPositions = [];
  const navRoomElements = svg.querySelectorAll('[id^="nav_room_"]');
  for (const navRoom of navRoomElements) {
    try {
      let x, y;
      if (navRoom.tagName.toLowerCase() === 'circle') {
        x = parseFloat(navRoom.getAttribute('cx') || '0');
        y = parseFloat(navRoom.getAttribute('cy') || '0');
      } else {
        const bb = navRoom.getBBox();
        x = bb.x + bb.width / 2;
        y = bb.y + bb.height / 2;
      }
      navRoomPositions.push({ x, y });
    } catch {
      // Skip if we can't get position
    }
  }
  
  // Only add room boundaries if we have relatively few wall segments (outline-only scenario)
  // This ensures we have enough walls to detect collisions, but doesn't over-block
  if (wallSegments.length < 50 && navRoomPositions.length > 0) {
    const roomGroups = svg.querySelectorAll('g[id^="stair_"]'); // Only stairs for now - they're solid obstacles
    let roomWallCount = 0;
    for (const roomGroup of roomGroups) {
      const roomPaths = roomGroup.querySelectorAll('path');
      for (const roomPath of roomPaths) {
        try {
          const bb = roomPath.getBBox();
          if (bb.width < 10 || bb.height < 10) continue;
          
          // Check if this path is near a nav_room (likely a doorway) - skip those
          const centerX = bb.x + bb.width / 2;
          const centerY = bb.y + bb.height / 2;
          const isNearDoorway = navRoomPositions.some(pos => 
            Math.hypot(centerX - pos.x, centerY - pos.y) < 30
          );
          if (isNearDoorway) continue;
          
          const pathD = roomPath.getAttribute('d');
          if (pathD) {
            const segments = parsePathToSegments(pathD);
            wallSegments.push(...segments);
            roomWallCount += segments.length;
          }
        } catch {
          // Skip
        }
      }
    }
    if (roomWallCount > 0) {
      console.debug(`Added ${roomWallCount} wall segments from stair boundaries`);
    }
  }
  
  // 3. Add polygon/polyline walls
  const polygonWalls = svg.querySelectorAll('polygon[id*="outline"], polyline[id*="outline"], polygon[id*="wall"], polyline[id*="wall"]');
  for (const poly of polygonWalls) {
    const points = poly.getAttribute('points');
    if (points) {
      const coords = points.match(/[\d.]+/g)?.map(Number) || [];
      for (let i = 0; i < coords.length - 2; i += 2) {
        wallSegments.push({
          x1: coords[i],
          y1: coords[i + 1],
          x2: coords[i + 2] || coords[0],
          y2: coords[i + 3] || coords[1]
        });
      }
    }
  }
  
  console.debug(`Total wall segments for collision detection: ${wallSegments.length}`);
  
  if (wallSegments.length === 0) {
    console.warn('WARNING: No wall segments found - pathfinding may route through walls!');
  }

  // Helper: Extract center coordinates from a path element
  // Works with ellipse-like paths (M x1 y1 C ... Z format)
  const getPathCenter = (pathEl) => {
    try {
      // Method 1: Use getBBox() - most reliable
      const bb = pathEl.getBBox();
      if (bb.width > 0 && bb.height > 0) {
        return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 };
      }
    } catch (e) {
      // getBBox may fail if element is not rendered
    }
    
    // Method 2: Parse the 'd' attribute to find the starting point
    const d = pathEl.getAttribute('d');
    if (d) {
      // Match the first M (move) command: M x y
      const match = d.match(/M\s*([\d.]+)\s+([\d.]+)/i);
      if (match) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        // For small circles, the M point is usually on the edge
        // We need to find the center - parse more of the path
        // Look for the pattern that indicates a circle center
        const allNumbers = d.match(/[\d.]+/g);
        if (allNumbers && allNumbers.length >= 4) {
          // For a circle path, find min/max to get center
          const xs = [];
          const ys = [];
          for (let i = 0; i < allNumbers.length - 1; i += 2) {
            xs.push(parseFloat(allNumbers[i]));
            ys.push(parseFloat(allNumbers[i + 1]));
          }
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        }
        return { x, y };
      }
    }
    
    return null;
  };

  // Method 1: Look for nav_room_* and nav_path_* path elements
  const navElements = svg.querySelectorAll('[id^="nav_room_"], [id^="nav_path_"]');
  console.debug(`Found ${navElements.length} nav elements with id prefix`);
  
  navElements.forEach((el) => {
    const id = el.id;
    if (!id) return;
    
    let coords = null;
    
    // Check if it's a circle element
    if (el.tagName.toLowerCase() === 'circle') {
      coords = {
        x: parseFloat(el.getAttribute('cx') || '0'),
        y: parseFloat(el.getAttribute('cy') || '0')
      };
    } 
    // Check if it's a path element (your current format)
    else if (el.tagName.toLowerCase() === 'path') {
      coords = getPathCenter(el);
    }
    // For groups, try to get bounding box
    else {
      try {
        const bb = el.getBBox();
        coords = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 };
      } catch (e) {
        console.warn(`Could not get coords for ${id}`);
      }
    }
    
    if (coords && (coords.x !== 0 || coords.y !== 0)) {
      nodes[id] = { x: coords.x, y: coords.y, edges: [] };
      console.debug(`✓ Node ${id}: (${coords.x.toFixed(1)}, ${coords.y.toFixed(1)})`);
    }
  });

  // Method 2: Also check for .nav-node class elements
  svg.querySelectorAll('.nav-node').forEach((n) => {
    const id = n.id || n.getAttribute('data-id') || n.dataset?.id;
    if (!id || nodes[id]) return; // Skip if already found
    
    let cx = n.getAttribute('cx');
    let cy = n.getAttribute('cy');
    
    // If cx/cy are missing, try getBBox
    if (cx === null || cy === null || cx === '' || cy === '') {
      try {
        const bb = n.getBBox();
        cx = bb.x + bb.width / 2;
        cy = bb.y + bb.height / 2;
      } catch (e) {
        cx = 0; cy = 0;
      }
    }
    
    cx = parseFloat(cx || '0');
    cy = parseFloat(cy || '0');
    
    if (cx !== 0 || cy !== 0) {
      nodes[id] = { x: cx, y: cy, edges: [] };
    }
  });

  // If still no nodes, generate from room groups
  if (Object.keys(nodes).length === 0) {
    console.debug('No nav nodes found, generating from room groups...');
    svg.querySelectorAll('g[id^="room_"]').forEach((g) => {
      const rid = g.id;
      try {
        const bb = g.getBBox();
        const nid = `node_${rid}`;
        nodes[nid] = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, edges: [] };
      } catch {
        // ignore
      }
    });
  }
  
  console.debug(`Total nodes found: ${Object.keys(nodes).length}`);

  // Helper to add undirected edge (with wall collision check)
  // IMPORTANT: nav_room nodes can ONLY connect to nav_path nodes (not to other nav_room nodes)
  const nodeIds = Object.keys(nodes);
  const addEdge = (a, b, w, checkWalls = true) => {
    if (!nodes[a] || !nodes[b]) return false;
    
    // Path structure rule: nav_room nodes can only connect to nav_path nodes
    // (not to other nav_room nodes - paths must go through nav_path)
    const isARoom = a.includes('nav_room');
    const isBRoom = b.includes('nav_room');
    
    if (isARoom && isBRoom) {
      // Don't allow direct nav_room to nav_room connections
      // Paths must always route through nav_path nodes
      return false;
    }
    
    // Check if edge crosses any walls
    if (checkWalls && wallSegments.length > 0) {
      const na = nodes[a];
      const nb = nodes[b];
      if (lineIntersectsWalls(na.x, na.y, nb.x, nb.y, wallSegments)) {
        // Edge crosses a wall - don't add it
        return false;
      }
    }
    
    // Avoid duplicates
    if (!nodes[a].edges.some((e) => e.to === b)) nodes[a].edges.push({ to: b, w });
    if (!nodes[b].edges.some((e) => e.to === a)) nodes[b].edges.push({ to: a, w });
    return true;
  };

  // Read explicit edges from SVG
  svg.querySelectorAll('.nav-edge').forEach((e) => {
    const from = e.dataset.from;
    const to = e.dataset.to;
    if (!from || !to || !nodes[from] || !nodes[to]) return;
    const dx = nodes[to].x - nodes[from].x;
    const dy = nodes[to].y - nodes[from].y;
    const w = Math.hypot(dx, dy) || 1;
    addEdge(from, to, w);
  });

  // Separate path nodes and room nodes
  // Path rule: nav_room (start/end) -> nav_path -> nav_path -> ... -> nav_path -> nav_room (start/end)
  const pathNodes = nodeIds.filter(id => id.includes('nav_path'));
  const roomNodes = nodeIds.filter(id => id.includes('nav_room'));
  
  console.debug(`Found ${pathNodes.length} nav_path nodes and ${roomNodes.length} nav_room nodes`);

  // STEP 1: Connect nav_path nodes to their nearest neighbors only
  // This creates a chain-like structure that prevents skipping intermediate nodes
  // and ensures paths follow the actual node sequence
  let rejectedByWalls = 0;
  let acceptedEdges = 0;
  
  if (pathNodes.length > 1) {
    console.debug('Connecting nav_path nodes to nearest neighbors (chain structure, no skipping)...');
    
    // Maximum distance for connections (only connect nearby nodes)
    const MAX_PATH_DISTANCE = 200; // px - maximum distance for any connection
    // Maximum number of neighbors to connect to (creates chain structure)
    // Limiting to 2-3 neighbors ensures path follows node sequence without skipping
    const MAX_NEIGHBORS = 3; // Connect to up to 3 nearest neighbors (creates chain, prevents skipping)
    
    for (const pId of pathNodes) {
      const p = nodes[pId];
      
      // Find all nearby nav_path nodes within range
      const allNearbyPaths = pathNodes
        .filter(o => o !== pId)
        .map(o => ({ id: o, dist: Math.hypot(nodes[o].x - p.x, nodes[o].y - p.y) }))
        .filter(p => p.dist <= MAX_PATH_DISTANCE)
        .sort((a, b) => a.dist - b.dist);
      
      // Connect only to the nearest MAX_NEIGHBORS nodes (creates chain, prevents skipping)
      const nearestNeighbors = allNearbyPaths.slice(0, MAX_NEIGHBORS);
      let connectedCount = 0;
      
      for (const { id: otherId, dist } of nearestNeighbors) {
        const added = addEdge(pId, otherId, dist, true); // Always check walls
        if (added) {
          acceptedEdges++;
          connectedCount++;
        } else {
          rejectedByWalls++;
        }
      }
      
      // Fallback: If we couldn't connect to any preferred neighbors (all blocked by walls),
      // try the next nearest neighbor to ensure connectivity
      if (connectedCount === 0 && allNearbyPaths.length > MAX_NEIGHBORS) {
        for (let i = MAX_NEIGHBORS; i < Math.min(MAX_NEIGHBORS + 2, allNearbyPaths.length); i++) {
          const fallbackPath = allNearbyPaths[i];
          const added = addEdge(pId, fallbackPath.id, fallbackPath.dist, true);
          if (added) {
            acceptedEdges++;
            connectedCount++;
            console.debug(`Fallback connection: ${pId} -> ${fallbackPath.id} (${fallbackPath.dist.toFixed(1)}px)`);
            break; // Stop after first successful fallback connection
          }
        }
      }
    }
    
    // Log connections
    let pathEdges = 0;
    for (const pId of pathNodes) pathEdges += nodes[pId].edges.length;
    console.debug(`Nav_path connections: ${pathEdges} edges (avg ${(pathEdges / pathNodes.length).toFixed(1)} per path node)`);
    console.debug(`Wall collision check: ${acceptedEdges} edges accepted, ${rejectedByWalls} rejected (crossed walls)`);
    
    if (rejectedByWalls > 0 && wallSegments.length === 0) {
      console.warn('WARNING: Edges were rejected but no wall segments found - check outline detection');
    }
  }

  // STEP 2: Connect each nav_room node to its nearest nav_path node(s)
  // Rule: nav_room nodes can ONLY connect to nav_path nodes (not to other nav_room nodes)
  if (roomNodes.length > 0 && pathNodes.length > 0) {
    console.debug('Connecting nav_room nodes to nearest nav_path nodes (with wall collision check)...');
    let roomConnections = 0;
    let roomRejected = 0;
    
    for (const roomId of roomNodes) {
      const room = nodes[roomId];
      
      // Find nearest nav_path nodes - connect only if no walls between them
      const nearestPaths = pathNodes
        .map(pId => ({
          id: pId,
          dist: Math.hypot(nodes[pId].x - room.x, nodes[pId].y - room.y)
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5); // Check up to 5 nearest, but only connect if no walls
      
      let connected = 0;
      for (const { id: pId, dist } of nearestPaths) {
        if (connected >= 5) break; // Increased from 3 to 5 for better connectivity
        // nav_room can only connect to nav_path (enforced by addEdge)
        const added = addEdge(roomId, pId, dist, true); // Always check walls
        if (added) {
          connected++;
          roomConnections++;
        } else {
          roomRejected++;
        }
      }
      
      // Ensure every room has at least one connection (fallback)
      if (connected === 0 && nearestPaths.length > 0) {
        const nearest = nearestPaths[0];
        // Increased fallback distance to ensure connectivity
        if (nearest.dist <= 400) {
          console.debug(`Room ${roomId} has no connections, attempting fallback to nearest nav_path (${nearest.dist.toFixed(1)}px away)`);
          const added = addEdge(roomId, nearest.id, nearest.dist, true);
          if (added) {
            roomConnections++;
            connected++;
            console.debug(`✓ Fallback connection successful for ${roomId}`);
          }
        }
      }
    }
    
    console.debug(`Room connections: ${roomConnections} accepted, ${roomRejected} rejected (crossed walls)`);
  }

  // STEP 3: Ensure no direct nav_room to nav_room connections
  // This is enforced in addEdge function - paths must always route through nav_path nodes

  // Log final graph stats
  let totalEdges = 0;
  for (const id of nodeIds) totalEdges += nodes[id].edges.length;
  const avgDegree = totalEdges / nodeIds.length;
  console.debug(`✅ Graph built: ${nodeIds.length} nodes, ${totalEdges} edges, avg degree: ${avgDegree.toFixed(2)}`)

  const finalNodeCount = Object.keys(nodes).length;
  if (finalNodeCount > 0) {
    console.debug(`Graph built successfully with ${finalNodeCount} nodes`);
  } else {
    console.warn('No nodes found in graph!');
  }
  
  return finalNodeCount ? nodes : null;
}

export function findNearestNode(nodes, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const id in nodes) {
    const n = nodes[id];
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

// Create a mapping from room id -> nearest node id (useful when you want to connect rooms)
export function connectRoomsToNodes(svg, nodes) {
  const map = Object.create(null);
  if (!svg || !nodes) return map;
  svg.querySelectorAll('g[id^="room_"]').forEach((g) => {
    const rid = g.id;
    try {
      const bb = g.getBBox();
      const cx = bb.x + bb.width / 2;
      const cy = bb.y + bb.height / 2;
      const nearest = findNearestNode(nodes, cx, cy);
      if (nearest) map[rid] = nearest;
    } catch {
      // ignore
    }
  });
  return map;
}

