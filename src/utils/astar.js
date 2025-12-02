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
      
      console.debug('A* Success:', {
        iterations,
        pathLength: finalPath.length,
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
