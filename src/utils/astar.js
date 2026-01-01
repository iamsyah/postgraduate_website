// A* pathfinding for small graphs represented as:
// nodes = { id: { x, y, edges: [{to, w}, ...] }, ... }
// 
// This implementation finds the SHORTEST PATH using:
// - Euclidean distance heuristic (straight-line distance)
// - Edge weights (actual distances between nodes)
// - Optimal path guarantee (A* is complete and optimal)
//
// The algorithm will automatically route through junction nodes
// if they provide a shorter path than direct connections.
export function astar(nodes, startId, goalId) {
  if (!nodes || !nodes[startId] || !nodes[goalId]) {
    console.warn('A*: Invalid nodes or start/goal not found');
    return null;
  }

  const openSet = new Set([startId]);
  const closedSet = new Set();
  const cameFrom = Object.create(null);
  const gScore = Object.create(null);
  const fScore = Object.create(null);

  // Heuristic: Euclidean distance (straight-line distance)
  // This is admissible (never overestimates) and consistent
  const heuristic = (a, b) => {
    const na = nodes[a];
    const nb = nodes[b];
    return Math.hypot(na.x - nb.x, na.y - nb.y);
  };

  // Initialize all scores to infinity
  for (const id in nodes) {
    gScore[id] = Infinity;
    fScore[id] = Infinity;
  }
  
  // Start node has zero cost
  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, goalId);

  let iterations = 0;
  const maxIterations = Object.keys(nodes).length * 10; // Prevent infinite loops

  while (openSet.size > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find node in openSet with lowest fScore
    let current = null;
    let bestF = Infinity;
    for (const id of openSet) {
      const f = fScore[id] ?? Infinity;
      if (f < bestF) {
        bestF = f;
        current = id;
      }
    }

    // Goal reached! Reconstruct path
    if (current === goalId) {
      const path = [];
      let cur = current;
      let totalDistance = gScore[goalId];
      
      while (cur) {
        path.push(cur);
        cur = cameFrom[cur];
      }
      
      const finalPath = path.reverse();
      
      // Validate: path should have at least 2 nav_path nodes for proper routing
      // Count nav_path nodes (excluding start and end nav_room nodes)
      const navPathNodes = finalPath.filter(id => id.includes('nav_path'));
      const navPathCount = navPathNodes.length;
      
      if (navPathCount < 2) {
        console.warn(`⚠ Path found with only ${navPathCount} nav_path node(s) (minimum 2 recommended). Path:`, finalPath);
        // Still return the path - better than nothing, but this suggests graph connectivity issues
      }
      
      console.debug('A* Success:', {
        iterations,
        pathLength: finalPath.length,
        navPathCount: navPathCount,
        totalDistance: totalDistance.toFixed(2),
        path: finalPath
      });
      
      return finalPath;
    }

    // Move current from open to closed set
    openSet.delete(current);
    closedSet.add(current);

    // Examine all neighbors
    const curNode = nodes[current];
    const edges = curNode.edges || [];
    
    for (const edge of edges) {
      const neighbor = edge.to;
      
      // Skip if already evaluated
      if (closedSet.has(neighbor)) continue;
      
      // Path rule enforcement:
      // - Path must start with nav_room and end with nav_room
      // - In between, only nav_path nodes are allowed (no nav_room nodes)
      const isNeighborRoom = neighbor.includes('nav_room');
      
      if (isNeighborRoom) {
        // Allow nav_room nodes only if:
        // 1. We're at the start node (current === startId), so we can move from nav_room to nav_path, OR
        // 2. The neighbor is the goal node (neighbor === goalId), so we can finish at nav_room
        // Otherwise, skip nav_room nodes in the middle of the path
        const isAtStart = current === startId;
        const isNeighborGoal = neighbor === goalId;
        
        if (!isAtStart && !isNeighborGoal) {
          continue; // Skip nav_room nodes that aren't start or goal
        }
      }
      
      // Calculate tentative gScore
      const edgeWeight = edge.w ?? 1;
      const tentativeG = gScore[current] + edgeWeight;
      
      // Discover a new node
      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeG >= gScore[neighbor]) {
        // Not a better path
        continue;
      }
      
      // This is the best path so far, record it
      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeG;
      fScore[neighbor] = tentativeG + heuristic(neighbor, goalId);
    }
  }

  // No path found
  console.warn('A* Failed:', {
    iterations,
    openSetSize: openSet.size,
    closedSetSize: closedSet.size,
    reason: iterations >= maxIterations ? 'Max iterations reached' : 'No path exists'
  });
  
  return null;
}

// Calculate total path distance
export function calculatePathDistance(nodes, path) {
  if (!nodes || !path || path.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = nodes[path[i]];
    const to = nodes[path[i + 1]];
    if (from && to) {
      totalDistance += Math.hypot(to.x - from.x, to.y - from.y);
    }
  }
  
  return totalDistance;
}

// Get path with node types (room vs junction)
export function getPathWithTypes(path) {
  return path.map(nodeId => ({
    id: nodeId,
    type: nodeId.includes('junction') ? 'junction' : 
          nodeId.includes('room') ? 'room' : 'other'
  }));
}
