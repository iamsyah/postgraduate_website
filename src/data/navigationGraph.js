/**
 * Manual Navigation Graph Definition
 * 
 * This file contains manually defined nodes and their connections for pathfinding.
 * 
 * Structure:
 * - nodes: Array of node objects with id, x, y, type (nav_room or nav_path)
 * - connections: Array of connection objects with from, to (node IDs)
 * 
 * To add a new node:
 *   {
 *     id: "unique_node_id",
 *     x: 123.45,  // X coordinate in SVG space
 *     y: 678.90,  // Y coordinate in SVG space
 *     type: "nav_room" | "nav_path"
 *   }
 * 
 * To add a connection:
 *   {
 *     from: "node_id_1",
 *     to: "node_id_2"
 *   }
 */

export const navigationNodes = [
  // ============================================
  // NAV_PATH NODES - Path navigation points
  // ============================================
  {
    id: "nav_path_1",
    x: 1245.55,
    y: 152.4,
    type: "nav_path"
  },
  {
    id: "nav_path_2",
    x: 1194.88,
    y: 173.38,
    type: "nav_path"
  },
  {
    id: "nav_path_3",
    x: 1225,
    y: 225,
    type: "nav_path"
  },
  {
    id: "nav_path_4",
    x: 1241.3,
    y: 275.5,
    type: "nav_path"
  },
  {
    id: "nav_path_5",
    x: 1260,
    y: 333.86,
    type: "nav_path"
  },
  {
    id: "nav_path_6",
    x: 1280.4,
    y: 393.12,
    type: "nav_path"
  },
  {
    id: "nav_path_7",
    x: 1301.65,
    y: 458.77,
    type: "nav_path"
  },
  {
    id: "nav_path_8",
    x: 1320.35,
    y: 518.04,
    type: "nav_path"
  },
  {
    id: "nav_path_9",
    x: 1361,
    y: 632,
    type: "nav_path"
  },
  {
    id: "nav_path_10",
    x: 1312.7,
    y: 647.52,
    type: "nav_path"
  },
  {
    id: "nav_path_11",
    x: 1265.1,
    y: 659.38,
    type: "nav_path"
  },
  {
    id: "nav_path_12",
    x: 1196.25, // TODO: Add coordinate
    y: 674.88, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_13",
    x: 1109.55, // TODO: Add coordinate
    y: 690.38, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_14",
    x: 1018.6, // TODO: Add coordinate
    y: 694.94, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_15",
    x: 951.45, // TODO: Add coordinate
    y: 694.94, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_16",
    x: 921.7, // TODO: Add coordinate
    y: 694.94, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_17",
    x: 861.35, // TODO: Add coordinate
    y: 693.11, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_18",
    x: 816, // TODO: Add coordinate
    y: 688, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_19",
    x: 754.25, // TODO: Add coordinate
    y: 670.32, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_20",
    x: 666, // TODO: Add coordinate
    y: 596, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_21",
    x: 607, // TODO: Add coordinate
    y:547, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_22",
    x: 491, // TODO: Add coordinate
    y: 488, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_23",
    x: 648, // TODO: Add coordinate
    y: 522.6, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_24",
    x: 660.75, // TODO: Add coordinate
    y: 487.95, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_25",
    x: 611, // TODO: Add coordinate
    y: 467, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_26",
    x: 568, // TODO: Add coordinate
    y: 448, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_27",
    x: 679, // TODO: Add coordinate
    y: 393, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_29",
    x: 805, // TODO: Add coordinate
    y: 324, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_30",
    x: 956, // TODO: Add coordinate
    y: 241, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_31",
    x: 1031.35, // TODO: Add coordinate
    y: 197.08, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_32",
    x: 1080.65, // TODO: Add coordinate
    y: 177.93, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_33",
    x: 1144, // TODO: Add coordinate
    y: 172, // TODO: Add coordinate
    type: "nav_path"
  },

  // ============================================
  // NAV_ROOM NODES - Room/destination points
  // ============================================
  {
    id: "nav_room_DropPoint",
    x: 1232, // TODO: Add coordinate
    y: 116, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_He&She",
    x: 1308, // TODO: Add coordinate
    y: 133, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BackEntrance",
    x: 462.7, // TODO: Add coordinate
    y: 427.77, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_ToiletMan1",
    x: 823, // TODO: Add coordinate
    y: 749, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_ToiletMan2",
    x: 1281.25, // TODO: Add coordinate
    y: 715.91, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_ToiletWomen1",
    x: 859, // TODO: Add coordinate
    y: 754, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SurauMan",
    x: 1203.9, // TODO: Add coordinate
    y: 731.41, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BilikOmarKhayyam",
    x: 1112.01, // TODO: Add coordinate
    y: 747.94, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SmartClassroom",
    x: 1018.6, // TODO: Add coordinate
    y: 756.03, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_PejabatPascaSiswazah",
    x: 954, // TODO: Add coordinate
    y: 642.96, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SOC",
    x: 922, // TODO: Add coordinate
    y: 756, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_StudentHub",
    x: 827.35, // TODO: Add coordinate
    y: 570.02, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BilikSim2",
    x: 1241.3, // TODO: Add coordinate
    y: 607.4, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BilikSim3",
    x: 1109.55, // TODO: Add coordinate
    y: 632.02, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_DK2",
    x: 594.45, // TODO: Add coordinate
    y: 580.96, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_DK3",
    x: 474.17, // TODO: Add coordinate
    y: 523.06, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK33",
    x: 670.1, // TODO: Add coordinate
    y: 374.89, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK34",
    x: 795.05, // TODO: Add coordinate
    y: 305.59, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK35",
    x: 946.35, // TODO: Add coordinate
    y: 222.61, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK36",
    x: 1320,
    y: 381,
    type: "nav_room"
  },
  {
    id: "nav_room_BK37",
    x: 1361,
    y: 504,
    type: "nav_room"
  },
  

  // ============================================
  // NAV_STAIR NODES - Stairway points
  // ============================================
  {
    id: "nav_stair_1",
    x: 1327.15, // TODO: Add coordinate
    y: 704.97, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_2",
    x: 689, // TODO: Add coordinate
    y: 837, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_3",
    x: 517.1, // TODO: Add coordinate
    y: 380.36, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_4",
    x: 1172.45, // TODO: Add coordinate
    y: 203.92, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_lift_CS2",
    x: 1264, // TODO: Add coordinate
    y: 212, // TODO: Add coordinate
    type: "nav_lift"
  },
];

export const navigationConnections = [
  // Example structure - replace with your actual connections
  // {
  //   from: "nav_room_BK35",
  //   to: "nav_path_1"
  // },
  {
    from: "nav_room_DropPoint",
    to: "nav_path_1"
  },
  {
    from: "nav_path_1",
    to: "nav_path_2"
  },
  {
    from: "nav_path_2",
    to: "nav_path_3"
  },
  {
    from: "nav_path_3",
    to: "nav_path_4"
  },
  {
    from: "nav_path_4",
    to: "nav_path_5"
  },
  {
    from: "nav_path_5",
    to: "nav_path_6"
  },
  {
    from: "nav_path_6",
    to: "nav_path_7"
  },
  {
    from: "nav_path_7",
    to: "nav_path_8"
  },
  {
    from: "nav_path_8",
    to: "nav_path_9"
  },
  {
    from: "nav_path_9",
    to: "nav_path_10"
  },
  {
    from: "nav_path_10",
    to: "nav_path_11"
  },
  {
    from: "nav_path_11",
    to: "nav_path_12"
  },
  {
    from: "nav_path_12",
    to: "nav_path_13"
  },
  {
    from: "nav_path_13",
    to: "nav_path_14"
  },
  {
    from: "nav_path_14",
    to: "nav_path_15"
  },
  {
    from: "nav_path_15",
    to: "nav_path_16"
  },
  {
    from: "nav_path_16",
    to: "nav_path_17"
  },
  {
    from: "nav_path_17",
    to: "nav_path_18"
  },
  {
    from: "nav_path_18",
    to: "nav_path_19"
  },
  {
    from: "nav_path_19",
    to: "nav_path_20"
  },
  {
    from: "nav_path_20",
    to: "nav_path_21"
  },
  {
    from: "nav_path_21",
    to: "nav_path_22"
  },
  {
    from: "nav_path_20",
    to: "nav_path_23"
  },
  {
    from: "nav_path_23",
    to: "nav_path_24"
  },
  {
    from: "nav_path_24",
    to: "nav_path_25"
  },
  {
    from: "nav_path_25",
    to: "nav_path_26"
  },
  {
    from: "nav_path_26",
    to: "nav_path_27"
  },
  {
    from: "nav_path_27",
    to: "nav_path_29"
  },
  {
    from: "nav_path_29",
    to: "nav_path_30"
  },
  {
    from: "nav_path_30",
    to: "nav_path_31"
  },
  {
    from: "nav_path_31",
    to: "nav_path_32"
  },
  {
    from: "nav_path_32",
    to: "nav_path_33"
  },
  {
    from: "nav_path_33",
    to: "nav_path_2"
  },

  //PARH TO ROOM

  {
    from: "nav_path_1",
    to: "nav_room_He&She"
  },
  {
    from: "nav_path_2",
    to: "nav_stair_4"
  },
  {
    from: "nav_path_3",
    to: "nav_lift_CS2"
  },
  {
    from: "nav_path_6",
    to: "nav_room_BK36"
  },
  {
    from: "nav_path_8",
    to: "nav_room_BK37"
  },
  {
    from: "nav_path_10",
    to: "nav_stair_1"
  },
  {
    from: "nav_path_11",
    to: "nav_room_ToiletMan2"
  },
  {
    from: "nav_path_11",
    to: "nav_room_BilikSim2"
  },
  {
    from: "nav_path_12",
    to: "nav_room_SurauMan"
  },
  {
    from: "nav_path_13",
    to: "nav_room_BilikOmarKhayyam"
  },
  {
    from: "nav_path_13",
    to: "nav_room_BilikSim3"
  },
  {
    from: "nav_path_14",
    to: "nav_room_BilikOmarKhayyam"
  },
  {
    from: "nav_path_15",
    to: "nav_room_PejabatPascaSiswazah"
  },
  {
    from: "nav_path_16",
    to: "nav_room_SOC"
  },
  {
    from: "nav_path_17",
    to: "nav_room_TandasWomen1"
  },
  {
    from: "nav_path_18",
    to: "nav_room_TandasMen1"
  },
  {
    from: "nav_path_18",
    to: "nav_room_StudentHub"
  },
  {
    from: "nav_path_19",
    to: "nav_stair_2"
  },
  {
    from: "nav_path_21",
    to: "nav_room_DK2"
  },
  {
    from: "nav_path_22",
    to: "nav_room_DK3"
  },
  {
    from: "nav_path_22",
    to: "nav_room_BackEntrance"
  },
  {
    from: "nav_path_26",
    to: "nav_stair_3"
  },
  {
    from: "nav_path_27",
    to: "nav_room_BK33"
  },
  {
    from: "nav_path_29",
    to: "nav_room_BK34"
  },
  {
    from: "nav_path_30",
    to: "nav_room_BK35"
  },

  // ============================================
  // REVERSE CONNECTIONS - Path to Path (Reverse)
  // ============================================
  {
    from: "nav_path_1",
    to: "nav_room_DropPoint"
  },
  {
    from: "nav_path_2",
    to: "nav_path_1"
  },
  {
    from: "nav_path_3",
    to: "nav_path_2"
  },
  {
    from: "nav_path_4",
    to: "nav_path_3"
  },
  {
    from: "nav_path_5",
    to: "nav_path_4"
  },
  {
    from: "nav_path_6",
    to: "nav_path_5"
  },
  {
    from: "nav_path_7",
    to: "nav_path_6"
  },
  {
    from: "nav_path_8",
    to: "nav_path_7"
  },
  {
    from: "nav_path_9",
    to: "nav_path_8"
  },
  {
    from: "nav_path_10",
    to: "nav_path_9"
  },
  {
    from: "nav_path_11",
    to: "nav_path_10"
  },
  {
    from: "nav_path_12",
    to: "nav_path_11"
  },
  {
    from: "nav_path_13",
    to: "nav_path_12"
  },
  {
    from: "nav_path_14",
    to: "nav_path_13"
  },
  {
    from: "nav_path_15",
    to: "nav_path_14"
  },
  {
    from: "nav_path_16",
    to: "nav_path_15"
  },
  {
    from: "nav_path_17",
    to: "nav_path_16"
  },
  {
    from: "nav_path_18",
    to: "nav_path_17"
  },
  {
    from: "nav_path_19",
    to: "nav_path_18"
  },
  {
    from: "nav_path_20",
    to: "nav_path_19"
  },
  {
    from: "nav_path_21",
    to: "nav_path_20"
  },
  {
    from: "nav_path_22",
    to: "nav_path_21"
  },
  {
    from: "nav_path_23",
    to: "nav_path_20"
  },
  {
    from: "nav_path_24",
    to: "nav_path_23"
  },
  {
    from: "nav_path_25",
    to: "nav_path_24"
  },
  {
    from: "nav_path_26",
    to: "nav_path_25"
  },
  {
    from: "nav_path_27",
    to: "nav_path_26"
  },
  {
    from: "nav_path_29",
    to: "nav_path_27"
  },
  {
    from: "nav_path_30",
    to: "nav_path_29"
  },
  {
    from: "nav_path_31",
    to: "nav_path_30"
  },
  {
    from: "nav_path_32",
    to: "nav_path_31"
  },
  {
    from: "nav_path_33",
    to: "nav_path_32"
  },
  {
    from: "nav_path_2",
    to: "nav_path_33"
  },

  // ============================================
  // REVERSE CONNECTIONS - Path to Room (Reverse)
  // ============================================
  {
    from: "nav_room_He&She",
    to: "nav_path_1"
  },
  {
    from: "nav_stair_4",
    to: "nav_path_2"
  },
  {
    from: "nav_lift_CS2",
    to: "nav_path_3"
  },
  {
    from: "nav_room_BK36",
    to: "nav_path_6"
  },
  {
    from: "nav_room_BK37",
    to: "nav_path_8"
  },
  {
    from: "nav_stair_1",
    to: "nav_path_10"
  },
  {
    from: "nav_room_ToiletMan2",
    to: "nav_path_11"
  },
  {
    from: "nav_room_BilikSim2",
    to: "nav_path_11"
  },
  {
    from: "nav_room_SurauMan",
    to: "nav_path_12"
  },
  {
    from: "nav_room_BilikOmarKhayyam",
    to: "nav_path_13"
  },
  {
    from: "nav_room_BilikSim3",
    to: "nav_path_13"
  },
  {
    from: "nav_room_BilikOmarKhayyam",
    to: "nav_path_14"
  },
  {
    from: "nav_room_PejabatPascaSiswazah",
    to: "nav_path_15"
  },
  {
    from: "nav_room_SOC",
    to: "nav_path_16"
  },
  {
    from: "nav_room_TandasWomen1",
    to: "nav_path_17"
  },
  {
    from: "nav_room_TandasMen1",
    to: "nav_path_18"
  },
  {
    from: "nav_room_StudentHub",
    to: "nav_path_18"
  },
  {
    from: "nav_stair_2",
    to: "nav_path_19"
  },
  {
    from: "nav_room_DK2",
    to: "nav_path_21"
  },
  {
    from: "nav_room_DK3",
    to: "nav_path_22"
  },
  {
    from: "nav_room_BackEntrance",
    to: "nav_path_22"
  },
  {
    from: "nav_stair_3",
    to: "nav_path_26"
  },
  {
    from: "nav_room_BK33",
    to: "nav_path_27"
  },
  {
    from: "nav_room_BK34",
    to: "nav_path_29"
  },
  {
    from: "nav_room_BK35",
    to: "nav_path_30"
  },
];

/**
 * Helper function to build graph structure from manual definitions
 * Returns: { nodes: { id: { x, y, edges: [...] } }, ... }
 */
export function buildManualGraph() {
  const graph = {};
  
  // Initialize nodes
  navigationNodes.forEach(node => {
    graph[node.id] = {
      x: node.x,
      y: node.y,
      type: node.type,
      edges: []
    };
  });
  
  // Add connections as edges
  navigationConnections.forEach(conn => {
    const fromNode = graph[conn.from];
    const toNode = graph[conn.to];
    
    if (!fromNode || !toNode) {
      console.warn(`Invalid connection: ${conn.from} -> ${conn.to}`);
      return;
    }
    
    // Check for duplicate edges before adding
    if (fromNode.edges.find(e => e.to === conn.to)) {
      console.warn(`Duplicate edge skipped: ${conn.from} -> ${conn.to}`);
      return;
    }
    
    // Calculate distance
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.hypot(dx, dy) || 1;
    
    // Add bidirectional edge
    fromNode.edges.push({ to: conn.to, w: distance });
    toNode.edges.push({ to: conn.from, w: distance });
  });
  
  // Debug: Log connections for specific nodes
  if (graph['nav_path_06']) {
    console.log('nav_path_06 edges:', graph['nav_path_06'].edges.map(e => e.to));
  }
  if (graph['nav_room_BK37']) {
    console.log('nav_room_BK37 edges:', graph['nav_room_BK37'].edges.map(e => e.to));
  }
  
  console.log(`Built manual graph with ${navigationNodes.length} nodes and ${navigationConnections.length} connections`);
  
  return graph;
}


