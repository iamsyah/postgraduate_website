// Helper: Check if two line segments intersect
// Line 1: (x1,y1) to (x2,y2), Line 2: (x3,y3) to (x4,y4)
function lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 0.0001) return false; // Parallel lines
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  
  // Check if intersection point is within both line segments
  // Use small margin to avoid edge cases
  return ua > 0.01 && ua < 0.99 && ub > 0.01 && ub < 0.99;
}

// Helper: Parse SVG path 'd' attribute into line segments for collision detection
function parsePathToSegments(pathD) {
  if (!pathD) return [];
  
  const segments = [];
  // Simplified parser - handles M, L, Z commands
  // This works for most building outlines
  const commands = pathD.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  
  let currentX = 0, currentY = 0;
  let startX = 0, startY = 0;
  
  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const nums = cmd.slice(1).trim().match(/-?[\d.]+/g)?.map(Number) || [];
    
    if (type === 'M') {
      currentX = nums[0] || 0;
      currentY = nums[1] || 0;
      startX = currentX;
      startY = currentY;
      // Handle implicit L commands after M
      for (let i = 2; i < nums.length; i += 2) {
        const newX = nums[i];
        const newY = nums[i + 1];
        if (newX !== undefined && newY !== undefined) {
          segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });
          currentX = newX;
          currentY = newY;
        }
      }
    } else if (type === 'L') {
      for (let i = 0; i < nums.length; i += 2) {
        const newX = nums[i];
        const newY = nums[i + 1];
        if (newX !== undefined && newY !== undefined) {
          segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });
          currentX = newX;
          currentY = newY;
        }
      }
    } else if (type === 'H') {
      const newX = nums[0];
      if (newX !== undefined) {
        segments.push({ x1: currentX, y1: currentY, x2: newX, y2: currentY });
        currentX = newX;
      }
    } else if (type === 'V') {
      const newY = nums[0];
      if (newY !== undefined) {
        segments.push({ x1: currentX, y1: currentY, x2: currentX, y2: newY });
        currentY = newY;
      }
    } else if (type === 'Z') {
      if (currentX !== startX || currentY !== startY) {
        segments.push({ x1: currentX, y1: currentY, x2: startX, y2: startY });
      }
      currentX = startX;
      currentY = startY;
    }
    // Skip curves (C, S, Q, T, A) for simplicity - they're rare in building outlines
  }
  
  return segments;
}

// Check if a line from (x1,y1) to (x2,y2) crosses any wall segment
function lineIntersectsWalls(x1, y1, x2, y2, wallSegments) {
  for (const wall of wallSegments) {
    if (lineSegmentsIntersect(x1, y1, x2, y2, wall.x1, wall.y1, wall.x2, wall.y2)) {
      return true;
    }
  }
  return false;
}

// Utility to build a navigation graph from an SVG element
export function buildNavGraphFromSvg(svg) {
  if (!svg) return null;
  const nodes = Object.create(null);
  
  // Extract wall segments from building outline for collision detection
  let wallSegments = [];
  const outlinePath = svg.querySelector('#outline') || svg.querySelector('[id*="outline"]');
  if (outlinePath) {
    const pathD = outlinePath.getAttribute('d');
    wallSegments = parsePathToSegments(pathD);
    console.debug(`Loaded ${wallSegments.length} wall segments for collision detection`);
  } else {
    console.warn('No outline path found - wall collision detection disabled');
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

  // Method 1: Look for nav_room_* and nav_junction_* path elements (your current format)
  const navElements = svg.querySelectorAll('[id^="nav_room_"], [id^="nav_junction_"]');
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
  const nodeIds = Object.keys(nodes);
  const addEdge = (a, b, w, checkWalls = true) => {
    if (!nodes[a] || !nodes[b]) return false;
    
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

  // Separate junction nodes and room nodes
  const junctionNodes = nodeIds.filter(id => id.includes('junction'));
  const roomNodes = nodeIds.filter(id => id.includes('room'));
  
  console.debug(`Found ${junctionNodes.length} junction nodes and ${roomNodes.length} room nodes`);

  // STEP 1: Connect ALL nearby junctions (not just sequential - allows shortest path!)
  // This is the key to finding truly shortest paths - A* can skip nodes if direct path is shorter
  let rejectedByWalls = 0;
  let acceptedEdges = 0;
  
  if (junctionNodes.length > 1) {
    console.debug('Connecting nearby junctions (with wall collision check)...');
    
    // Connect each junction to ALL nearby junctions within distance threshold
    const MAX_JUNCTION_DISTANCE = 200; // px - adjust based on your map scale
    
    for (const jId of junctionNodes) {
      const j = nodes[jId];
      
      // Find all junctions within range and connect
      const nearbyJunctions = junctionNodes
        .filter(o => o !== jId)
        .map(o => ({ id: o, dist: Math.hypot(nodes[o].x - j.x, nodes[o].y - j.y) }))
        .filter(p => p.dist <= MAX_JUNCTION_DISTANCE)
        .sort((a, b) => a.dist - b.dist);
      
      for (const { id: otherId, dist } of nearbyJunctions) {
        const added = addEdge(jId, otherId, dist);
        if (added) {
          acceptedEdges++;
        } else {
          rejectedByWalls++;
        }
      }
    }
    
    // Log connections
    let junctionEdges = 0;
    for (const jId of junctionNodes) junctionEdges += nodes[jId].edges.length;
    console.debug(`Junction connections: ${junctionEdges} edges (avg ${(junctionEdges / junctionNodes.length).toFixed(1)} per junction)`);
    console.debug(`Wall collision check: ${acceptedEdges} edges accepted, ${rejectedByWalls} rejected (crossed walls)`);
  }

  // STEP 2: Connect each room node to its nearest junction(s)
  if (roomNodes.length > 0 && junctionNodes.length > 0) {
    console.debug('Connecting rooms to nearest junctions...');
    for (const roomId of roomNodes) {
      const room = nodes[roomId];
      
      // Find nearest junctions - connect to more for better routing options
      const nearestJunctions = junctionNodes
        .map(jId => ({
          id: jId,
          dist: Math.hypot(nodes[jId].x - room.x, nodes[jId].y - room.y)
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3); // Connect to 3 nearest junctions for more routing options
      
      for (const { id: jId, dist } of nearestJunctions) {
        addEdge(roomId, jId, dist);
      }
    }
  }

  // STEP 3: Also connect nearby rooms directly (if they're close)
  if (roomNodes.length > 1) {
    const MAX_ROOM_DISTANCE = 150; // px
    for (const roomId of roomNodes) {
      const room = nodes[roomId];
      const nearbyRooms = roomNodes
        .filter(o => o !== roomId)
        .map(o => ({ id: o, dist: Math.hypot(nodes[o].x - room.x, nodes[o].y - room.y) }))
        .filter(p => p.dist <= MAX_ROOM_DISTANCE);
      
      for (const { id, dist } of nearbyRooms) {
        addEdge(roomId, id, dist);
      }
    }
  }

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

