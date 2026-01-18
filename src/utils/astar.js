// Helper: Get floor from node ID or node object
function getFloorFromNodeId(nodeId, nodes = null) {
  if (!nodeId) return null;
  
  // First, check if node object has floor property (from buildManualGraph)
  if (nodes && nodes[nodeId] && nodes[nodeId].floor !== undefined && nodes[nodeId].floor !== null) {
    return nodes[nodeId].floor;
  }
  
  // Fallback: Check for floor suffix: _G, _1, or _2 at the end
  if (nodeId.endsWith('_G')) return 'G';
  if (nodeId.endsWith('_2')) return '2';
  if (nodeId.endsWith('_1')) {
    // Make sure it's not something like _1_G or _1_2
    // Since we checked _G and _2 first, if it ends with _1, it's floor 1
    return '1';
  }
  
  return null;
}

// A* pathfinding for small graphs represented as:
// nodes = { id: { x, y, edges: [{to, w}, ...] }, ... }
// 
// This implementation finds the SHORTEST PATH using:
// - Euclidean distance heuristic (straight-line distance)
// - Edge weights (actual distances between nodes)
// - Optimal path guarantee (A* is complete and optimal)
// - Floor transitions only via stairs/lifts
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
      // - Floor transitions must only happen via nav_stair_* or nav_lift_* nodes
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
      
      // Floor transition validation: Only allow floor changes via stairs/lifts
      // When floors differ, at least one node must be a stair/lift (allows nav_path → stair and stair → nav_path)
      const currentFloor = getFloorFromNodeId(current, nodes);
      const neighborFloor = getFloorFromNodeId(neighbor, nodes);
      
      // If floors are different, at least one node must be a stair/lift
      // Note: Only validate if both floors are known (not null)
      // If a floor is null, allow the transition (BFS will propagate floor info later)
      if (currentFloor && neighborFloor && currentFloor !== neighborFloor) {
        const isCurrentStairLift = current.startsWith('nav_stair_') || current.startsWith('nav_lift_');
        const isNeighborStairLift = neighbor.startsWith('nav_stair_') || neighbor.startsWith('nav_lift_');
        
        if (!isCurrentStairLift && !isNeighborStairLift) {
          // Invalid: trying to change floors without using stairs/lifts
          // At least one node in a floor transition must be a stair/lift
          continue; // Skip this neighbor
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

  // No path found - debug info
  console.warn('A* Failed:', {
    iterations,
    openSetSize: openSet.size,
    closedSetSize: closedSet.size,
    startId,
    goalId,
    reason: iterations >= maxIterations ? 'Max iterations reached' : 'No path exists'
  });
  
  // Debug: Check what nodes are in closedSet vs what should be reachable
  const startEdges = nodes[startId]?.edges?.map(e => e.to) || [];
  const goalEdges = nodes[goalId]?.edges?.map(e => e.to) || [];
  const goalInClosedSet = closedSet.has(goalId);
  const startToGoalEdges = nodes[startId]?.edges?.filter(e => e.to === goalId) || [];
  const goalConnectedPaths = goalEdges.filter(eid => closedSet.has(eid));
  
  console.warn('A* Debug:', {
    startEdges,
    goalEdges,
    startFloor: getFloorFromNodeId(startId, nodes),
    goalFloor: getFloorFromNodeId(goalId, nodes),
    goalInClosedSet,
    directConnection: startToGoalEdges.length > 0,
    closedSetSample: Array.from(closedSet).slice(0, 20),
    goalConnectedPaths
  });
  
  // More detailed debug logging
  console.log('A* Detailed Debug:');
  console.log('- Goal edges:', goalEdges);
  console.log('- Goal in closedSet?', goalInClosedSet);
  console.log('- Paths to goal that are in closedSet:', goalConnectedPaths);
  
  // Check which nodes connect to nav_path_1 and if any are in closedSet
  const navPath1Node = nodes['nav_path_1'];
  if (navPath1Node && navPath1Node.edges) {
    const navPath1Connections = navPath1Node.edges.map(e => e.to);
    const navPath1ConnectionsInClosedSet = navPath1Connections.filter(id => closedSet.has(id));
    console.log('- nav_path_1 connections:', navPath1Connections);
    console.log('- nav_path_1 connections in closedSet:', navPath1ConnectionsInClosedSet);
    console.log('- nav_path_1 floor:', getFloorFromNodeId('nav_path_1', nodes));
    navPath1ConnectionsInClosedSet.forEach(connId => {
      console.log(`  - ${connId} (floor: ${getFloorFromNodeId(connId, nodes)}) connects to nav_path_1`);
    });
  }
  
  if (goalConnectedPaths.length > 0) {
    console.log('  ⚠️ A* reached a node connected to goal but couldn\'t reach goal itself!');
    goalConnectedPaths.forEach(pathId => {
      const pathFloor = getFloorFromNodeId(pathId, nodes);
      const goalFloor = getFloorFromNodeId(goalId, nodes);
      const pathIsRoom = pathId.includes('nav_room');
      console.log(`  - ${pathId} (floor: ${pathFloor}, isRoom: ${pathIsRoom}) connects to goal (floor: ${goalFloor})`);
    });
  } else {
    console.log('  ❌ A* never reached any node connected to the goal!');
    console.log('  This means the path from start to nav_path_1 is being blocked by A* validation rules.');
  }
  
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
