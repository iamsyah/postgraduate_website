import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, MapPin, X, Plus, Minus, Navigation, Locate, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { findNearestNode } from "../utils/graph";
import { astar } from "../utils/astar";
import { buildManualGraph } from "../data/navigationGraph";
import { CustomPaint, CustomPainter, Paint } from "../utils/pathPainter";
import { animatePath } from "../utils/animatedPath";

const FLOORS = [
  { id: "G", label: "G", file: "/maps/ground_floor.svg" },
  { id: "1", label: "1", file: "/maps/1st_floor.svg" },
  { id: "2", label: "2", file: "/maps/2nd_floor.svg" },
];

/**
 * ============================================
 * FLOOR ROOM CONFIGURATION
 * ============================================
 * 
 * Manually define which rooms are available for each floor.
 * This list is based on nav_room_* nodes from navigationGraph.js
 * 
 * Format:
 * - Key: Floor ID ("G", "1", "2")
 * - Value: Array of room objects with:
 *   - name: Display name (what users see in search)
 *   - navRoomId: The nav_room_* ID from navigationGraph.js
 *   - svgRoomId: Optional - SVG room ID if different (e.g., "room_BK33")
 * 
 * Rooms are searchable by their display name and will map to nav_room_* IDs for pathfinding.
 */
const FLOOR_ROOMS = {
  // Ground Floor (G) - Available Rooms
  "G": [
    { name: "Drop Point", navRoomId: "nav_room_DropPoint" },
    { name: "He & She", navRoomId: "nav_room_He&She" },
    { name: "Back Entrance", navRoomId: "nav_room_BackEntrance" },
    { name: "Surau Man", navRoomId: "nav_room_SurauMan" },
    { name: "Bilik Omar Khayyam", navRoomId: "nav_room_BilikOmarKhayyam" },
    { name: "Smart Classroom", navRoomId: "nav_room_SmartClassroom" },
    { name: "Pejabat Pasca Siswazah", navRoomId: "nav_room_PejabatPascaSiswazah" },
    { name: "SOC", navRoomId: "nav_room_SOC" },
    { name: "Student Hub", navRoomId: "nav_room_StudentHub" },
    { name: "IBDAAI", navRoomId: "nav_room_IBDAAI" },
    { name: "BK33", navRoomId: "nav_room_BK33" },
    { name: "BK34", navRoomId: "nav_room_BK34" },
    { name: "BK35", navRoomId: "nav_room_BK35" },
    { name: "BK36", navRoomId: "nav_room_BK36" },
    { name: "BK37", navRoomId: "nav_room_BK37" },
    { name: "evoCity", navRoomId: "nav_room_evoCity" },
    { name: "Autism", navRoomId: "nav_room_autism" },
    { name: "Cloud", navRoomId: "nav_room_Cloud" },
    { name: "iDACC", navRoomId: "nav_room_iDACC" },
  ],

  // 1st Floor - Available Rooms
  "1": [
    { name: "GLS", navRoomId: "nav_room_GLS" },
    { name: "BK20", navRoomId: "nav_room_BK20" },
    { name: "BK21", navRoomId: "nav_room_BK21" },
    { name: "BK22", navRoomId: "nav_room_BK22" },
    { name: "BK23", navRoomId: "nav_room_BK23" },
    { name: "BK24", navRoomId: "nav_room_BK24" },
    { name: "BK25", navRoomId: "nav_room_BK25" },
    { name: "BK26", navRoomId: "nav_room_BK26" },
    { name: "BK27", navRoomId: "nav_room_BK27" },
    { name: "BK30", navRoomId: "nav_room_BK30" },
    { name: "BK31", navRoomId: "nav_room_BK31" },
    { name: "BK32", navRoomId: "nav_room_BK32" },
    { name: "DK2", navRoomId: "nav_room_DK2" },
    { name: "DK3", navRoomId: "nav_room_DK3" },
    { name: "HEP", navRoomId: "nav_room_HEP" },
  ],

  // 2nd Floor - Available Rooms
  "2": [
    { name: "Postgraduate Lab", navRoomId: "nav_room_postgraduateLab" },
    { name: "Software Lab 1", navRoomId: "nav_room_softlab1" },
    { name: "Software Lab 2", navRoomId: "nav_room_softlab2" },
    { name: "User Science", navRoomId: "nav_room_userScience" },
    { name: "HPC", navRoomId: "nav_room_HPC" },
    { name: "IIS", navRoomId: "nav_room_IIS" },
    { name: "MK14", navRoomId: "nav_room_MK14" },
    { name: "MK15", navRoomId: "nav_room_MK15" },
    { name: "MK17", navRoomId: "nav_room_MK17" },
    { name: "MK18", navRoomId: "nav_room_MK18" },
    { name: "MK19", navRoomId: "nav_room_MK19" },
    { name: "MK20", navRoomId: "nav_room_MK20" },
  ],
};

export default function IndoorDirectory() {
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState("G");
  const [svgContent, setSvgContent] = useState(null);
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pathLineRef = useRef(null); // Use ref for path to avoid stale closure
  const [rooms, setRooms] = useState([]);
  const [roomNames, setRoomNames] = useState([]);
  const [nameToId, setNameToId] = useState({});
  const [idToName, setIdToName] = useState({});
  const [destinationName, setDestinationName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPathPainter, setShowPathPainter] = useState(false);
  const pathPainterRef = useRef(null);

  // Load SVG for current floor
  useEffect(() => {
    const floor = FLOORS.find((f) => f.id === currentFloor);
    if (!floor?.file) {
      setSvgContent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(floor.file)
      .then((res) => res.text())
      .then((text) => {
        setSvgContent(text);
        setLoading(false);
      })
      .catch(() => {
        setSvgContent(null);
        setLoading(false);
      });
  }, [currentFloor]);

  // Clear path from SVG
  const clearPath = useCallback(() => {
    // Stop animation and clean up via ref
    if (pathLineRef.current) {
      if (pathLineRef.current.animation?.stop) {
        pathLineRef.current.animation.stop();
      } else if (pathLineRef.current.elements) {
        pathLineRef.current.elements.forEach((el) => el?.remove());
      }
      pathLineRef.current = null;
    }
    // Fallback: remove any remaining path elements
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".path-line, .path-dot, .path-arrow").forEach((el) => el.remove());
    }
  }, []);

  // Change floor function
  const changeFloor = useCallback((floorId) => {
    // Validate floor ID
    const validFloors = ["G", "1", "2"];
    if (!validFloors.includes(floorId)) {
      console.warn(`Invalid floor ID: ${floorId}. Valid floors are: ${validFloors.join(", ")}`);
      return;
    }

    // Check if floor has a map file
    const floor = FLOORS.find((f) => f.id === floorId);
    if (!floor?.file) {
      console.warn(`Floor ${floorId} does not have a map file`);
      return;
    }

    // Clear current path
    clearPath();

    // Clear destination and current location
    setDestination(null);
    setDestinationName("");
    setCurrentLocation(null);
    setCurrentName("");

    // Remove visual markers from SVG
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".destination-area, .selected-area").forEach((el) => {
        el.classList.remove("destination-area", "selected-area");
      });
    }

    // Change floor
    setCurrentFloor(floorId);
  }, [clearPath]);

  // Navigation Graph Painter - CustomPainter implementation
  class NavigationGraphPainter extends CustomPainter {
    constructor(nodes) {
      super();
      this.nodes = nodes;
    }

    paint(canvas, size) {
      if (!this.nodes || Object.keys(this.nodes).length === 0) return;

      // Create paint for path connections
      const pathPaint = Paint.stroke('#00FF00', 2);
      pathPaint.opacity = 0.4;

      // Draw all connections (avoid duplicates for bidirectional edges)
      const drawnEdges = new Set();
      Object.keys(this.nodes).forEach((nodeId) => {
        const node = this.nodes[nodeId];
        if (!node || !node.edges) return;

        node.edges.forEach((edge) => {
          const targetNode = this.nodes[edge.to];
          if (!targetNode) return;

          // Create unique key for edge (order by ID to avoid duplicates)
          const edgeKey = nodeId < edge.to ? `${nodeId}-${edge.to}` : `${edge.to}-${nodeId}`;
          if (drawnEdges.has(edgeKey)) return;
          drawnEdges.add(edgeKey);

          // Draw line using canvas API
          canvas.drawLine(node.x, node.y, targetNode.x, targetNode.y, pathPaint);
        });
      });
    }

    shouldRepaint(oldDelegate) {
      // Repaint if nodes changed
      return !oldDelegate || oldDelegate.nodes !== this.nodes;
    }
  }

  // Paint all paths from navigation graph using CustomPaint
  const paintAllPaths = useCallback(() => {
    if (!svgRef.current) return;
    
    // Dispose previous painter if exists
    if (pathPainterRef.current) {
      pathPainterRef.current.dispose();
      pathPainterRef.current = null;
    }

    const nodes = buildManualGraph();
    if (!nodes || Object.keys(nodes).length === 0) return;

    const svg = svgRef.current;
    
    // Create custom painter
    const painter = new NavigationGraphPainter(nodes);
    
    // Create CustomPaint widget
    const customPaint = new CustomPaint(svg, painter);
    customPaint.paint();
    
    // Store reference
    pathPainterRef.current = customPaint;
  }, []);

  // Clear painted paths
  const clearPaintedPaths = useCallback(() => {
    if (pathPainterRef.current) {
      pathPainterRef.current.dispose();
      pathPainterRef.current = null;
    }
  }, []);

  // Toggle path painter
  const togglePathPainter = useCallback(() => {
    setShowPathPainter((prev) => {
      if (!prev) {
        paintAllPaths();
      } else {
        clearPaintedPaths();
      }
      return !prev;
    });
  }, [paintAllPaths, clearPaintedPaths]);

  // Clear all highlights
  const clearHighlights = useCallback(() => {
    if (!svgRef.current) return;
    svgRef.current
      .querySelectorAll(".selected-area, .destination-area")
      .forEach((el) => el.classList.remove("selected-area", "destination-area"));
    clearPath();
  }, [clearPath]);

  // Reset all selections
  const resetSelection = useCallback(() => {
    setDestination(null);
    setCurrentLocation(null);
    setDestinationName("");
    setCurrentName("");
    clearHighlights();
  }, [clearHighlights]);

  // Resolve room input to ID
  const resolveRoomInput = (input) => {
    if (!input) return { id: null, name: null };
    if (nameToId[input]) return { id: nameToId[input], name: input };
    const lower = input.toLowerCase();
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase() === lower) return { id: nameToId[key], name: key };
    }
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase().includes(lower)) return { id: nameToId[key], name: key };
    }
    for (const rid of rooms) {
      if (rid.toLowerCase() === lower) return { id: rid, name: rid };
    }
    return { id: null, name: null };
  };

  // Filter suggestions
  const getFilteredRooms = (query) => {
    if (!query) return roomNames.slice(0, 8);
    const lower = query.toLowerCase();
    return roomNames.filter((r) => r.toLowerCase().includes(lower)).slice(0, 8);
  };

  // Handle destination selection
  const selectDestination = (name) => {
    setDestinationName(name);
    setShowDestDropdown(false);
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".destination-area").forEach((el) => el.classList.remove("destination-area"));
    }
    const { id } = resolveRoomInput(name);
    setDestination(id || null);
    
    // Highlight in SVG - try both navRoomId and svgRoomId
    if (id && svgRef.current) {
      // Try navRoomId first
      let el = svgRef.current.getElementById(id);
      
      // If not found and we have svgRoomId mapping, try that
      if (!el && svgRef.current.__navToSvgMap && svgRef.current.__navToSvgMap[id]) {
        el = svgRef.current.getElementById(svgRef.current.__navToSvgMap[id]);
      }
      
      // Also try room_ prefix version
      if (!el) {
        const roomId = id.replace(/^nav_room_/, "room_");
        el = svgRef.current.getElementById(roomId);
      }
      
      if (el) {
        el.classList.add("destination-area");
      }
    }
  };

  // Handle current location selection
  const selectCurrentLocation = (name) => {
    setCurrentName(name);
    setShowCurrentDropdown(false);
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".selected-area").forEach((el) => el.classList.remove("selected-area"));
    }
    const { id } = resolveRoomInput(name);
    setCurrentLocation(id || null);
    
    // Highlight in SVG - try both navRoomId and svgRoomId
    if (id && svgRef.current) {
      // Try navRoomId first
      let el = svgRef.current.getElementById(id);
      
      // If not found and we have svgRoomId mapping, try that
      if (!el && svgRef.current.__navToSvgMap && svgRef.current.__navToSvgMap[id]) {
        el = svgRef.current.getElementById(svgRef.current.__navToSvgMap[id]);
      }
      
      // Also try room_ prefix version
      if (!el) {
        const roomId = id.replace(/^nav_room_/, "room_");
        el = svgRef.current.getElementById(roomId);
      }
      
      if (el) {
        el.classList.add("selected-area");
      }
    }
  };

  // Clear destination
  const clearDestination = () => {
    setDestinationName("");
    setDestination(null);
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".destination-area").forEach((el) => el.classList.remove("destination-area"));
    }
    clearPath();
  };

  // Inject SVG and build room data from manual configuration
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    containerRef.current.innerHTML = svgContent;
    const svg = containerRef.current.querySelector("svg");
    svgRef.current = svg;

    if (svg) {
      // Make SVG responsive
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.maxWidth = "100%";
      svg.style.maxHeight = "100%";
      svg.style.pointerEvents = "auto";
      
      svg.querySelectorAll("*").forEach((el) => {
        if (el.style) el.style.pointerEvents = "visiblePainted";
      });

      // Get rooms for current floor from manual configuration
      const floorRooms = FLOOR_ROOMS[currentFloor] || [];
      
      if (floorRooms.length === 0) {
        console.warn(`Floor ${currentFloor}: No rooms configured in FLOOR_ROOMS`);
        setRooms([]);
        setRoomNames([]);
        setNameToId({});
        setIdToName({});
        return;
      }

      // Build room data from manual configuration
      const names = [];
      const map = Object.create(null); // name -> navRoomId (for pathfinding)
      const reverse = Object.create(null); // navRoomId -> name
      const navToSvgMap = Object.create(null); // navRoomId -> svgRoomId (for highlighting)
      const roomIds = [];

      for (const room of floorRooms) {
        const { name, navRoomId, svgRoomId } = room;
        
        // Use navRoomId as the primary ID for pathfinding
        roomIds.push(navRoomId);
        
        // Map display name to navRoomId (for search -> pathfinding)
        map[name] = navRoomId;
        reverse[navRoomId] = name;
        
        // Store SVG room ID mapping if provided (for highlighting SVG elements)
        if (svgRoomId) {
          navToSvgMap[navRoomId] = svgRoomId;
        }
        
        names.push(name);
      }
      
      // Store navToSvgMap in svgRef for later access
      if (svg) {
        svg.__navToSvgMap = navToSvgMap;
      }

      names.sort((a, b) => a.localeCompare(b));
      setRooms(roomIds);
      setRoomNames(names);
      setNameToId(map);
      setIdToName(reverse);
    }
  }, [svgContent, currentFloor]);

  // Paint paths when toggled and SVG is loaded
  useEffect(() => {
    if (showPathPainter && svgRef.current) {
      paintAllPaths();
    } else {
      clearPaintedPaths();
    }
  }, [showPathPainter, svgContent, paintAllPaths, clearPaintedPaths]);

  // Helper: Find nav_room_* node ID for a given room ID
  // e.g., room_123 -> nav_room_123, DropPoint -> nav_room_DropPoint
  const findNavRoomNode = (svg, roomId, manualGraph = null) => {
    if (!roomId) return null;
    
    // Try direct match first (if roomId is already nav_room_*)
    if (roomId.startsWith('nav_room_')) {
      if (manualGraph && manualGraph[roomId]) {
        return roomId;
      }
      if (svg && svg.getElementById(roomId)) {
        return roomId;
      }
    }
    
    // Try exact match: nav_room_<roomId without prefix>
    const roomSuffix = roomId.replace(/^(room_|office_|toilet_|surau_|cafe_|stair_|nav_room_)/i, "");
    const navRoomId = `nav_room_${roomSuffix}`;
    
    // Check manual graph first
    if (manualGraph && manualGraph[navRoomId]) {
      return navRoomId;
    }
    
    // Check if nav_room node exists in SVG
    if (svg && svg.getElementById(navRoomId)) {
      return navRoomId;
    }
    
    // Try with full room ID: nav_room_<fullRoomId>
    const navRoomIdFull = `nav_room_${roomId}`;
    
    // Check manual graph
    if (manualGraph && manualGraph[navRoomIdFull]) {
      return navRoomIdFull;
    }
    
    // Check SVG
    if (svg && svg.getElementById(navRoomIdFull)) {
      return navRoomIdFull;
    }
    
    // Try case-insensitive match in manual graph
    if (manualGraph) {
      for (const nodeId of Object.keys(manualGraph)) {
        if (nodeId.startsWith('nav_room_')) {
          const nodeSuffix = nodeId.replace(/^nav_room_/i, '');
          if (nodeSuffix.toLowerCase() === roomSuffix.toLowerCase() || 
              nodeSuffix.toLowerCase() === roomId.toLowerCase()) {
            return nodeId;
          }
        }
      }
    }
    
    // Fallback: Find nav_room node nearest to the room center
    const roomEl = svg.getElementById(roomId);
    if (roomEl) {
      try {
        const roomBox = roomEl.getBBox();
        const roomX = roomBox.x + roomBox.width / 2;
        const roomY = roomBox.y + roomBox.height / 2;
        
        // Find all nav_room nodes
        const navRooms = Array.from(svg.querySelectorAll('[id^="nav_room_"]'));
        if (navRooms.length > 0) {
          let nearest = null;
          let nearestDist = Infinity;
          
          for (const navRoom of navRooms) {
            let navX, navY;
            if (navRoom.tagName.toLowerCase() === 'circle') {
              navX = parseFloat(navRoom.getAttribute('cx') || '0');
              navY = parseFloat(navRoom.getAttribute('cy') || '0');
            } else {
              try {
                const navBox = navRoom.getBBox();
                navX = navBox.x + navBox.width / 2;
                navY = navBox.y + navBox.height / 2;
              } catch {
                continue;
              }
            }
            
            const dist = Math.hypot(navX - roomX, navY - roomY);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearest = navRoom.id;
            }
          }
          
          if (nearest && nearestDist < 500) { // Only if within reasonable distance
            return nearest;
          }
        }
      } catch {
        // Ignore errors
      }
    }
    
    return null;
  };

  // Draw navigation path
  const drawPath = useCallback((startRoomId, endRoomId) => {
    if (!svgRef.current || !startRoomId || !endRoomId) return false;
    const svg = svgRef.current;

    try {
      // Clear existing path
      clearPath();

      // Build navigation graph using manual definitions
      const nodes = buildManualGraph();
      if (!nodes || Object.keys(nodes).length === 0) {
        console.warn('No navigation graph found');
        return false;
      }

      // Find nav_room nodes for start and end
      // First try to find in manual graph directly, then fallback to SVG lookup
      let startNavRoomId = null;
      let endNavRoomId = null;
      
      // Check if the room IDs directly match nav_room nodes in the graph
      if (nodes[startRoomId] && nodes[startRoomId].type === 'nav_room') {
        startNavRoomId = startRoomId;
      } else {
        startNavRoomId = findNavRoomNode(svg, startRoomId, nodes);
      }
      
      if (nodes[endRoomId] && nodes[endRoomId].type === 'nav_room') {
        endNavRoomId = endRoomId;
      } else {
        endNavRoomId = findNavRoomNode(svg, endRoomId, nodes);
      }
      
      if (!startNavRoomId || !endNavRoomId) {
        console.warn(`Could not find nav_room nodes: start=${startRoomId}(${startNavRoomId}), end=${endRoomId}(${endNavRoomId})`);
        console.warn('Available nav_room nodes:', Object.keys(nodes).filter(id => nodes[id].type === 'nav_room'));
        // Fallback: try to find nearest node
        const startEl = svg.getElementById(startRoomId);
        const endEl = svg.getElementById(endRoomId);
        if (!startEl || !endEl) return false;
        
        const startBox = startEl.getBBox();
        const endBox = endEl.getBBox();
        const startX = startBox.x + startBox.width / 2;
        const startY = startBox.y + startBox.height / 2;
        const endX = endBox.x + endBox.width / 2;
        const endY = endBox.y + endBox.height / 2;
        
        const sNode = findNearestNode(nodes, startX, startY);
        const eNode = findNearestNode(nodes, endX, endY);
        
        if (sNode && eNode) {
          const nodePath = astar(nodes, sNode, eNode);
          if (nodePath?.length) {
            const points = [[startX, startY]];
            for (const nid of nodePath) {
              if (nodes[nid]) points.push([nodes[nid].x, nodes[nid].y]);
            }
            points.push([endX, endY]);
            
            // Animate path with moving dot (fallback path)
            const animation = animatePath(svg, points, {
              // Colors use defaults from animatedPath.js
              pathWidth: 4,
              dotRadius: 6,
              duration: 3000 // 3 seconds animation
            });

            pathLineRef.current = {
              animation,
              elements: animation ? animation.getElements() : [],
              remove: () => {
                if (animation) {
                  animation.stop();
                }
                if (pathLineRef.current?.elements) {
                  pathLineRef.current.elements.forEach(el => el.remove());
                }
              }
            };
            return true;
          }
        }
        return false;
      }

      // Check if nav_room nodes exist in the graph
      if (!nodes[startNavRoomId] || !nodes[endNavRoomId]) {
        console.warn(`nav_room nodes not found in graph: ${startNavRoomId}, ${endNavRoomId}`);
        return false;
      }

      // Route from nav_room to nav_room (path will go through nav_path nodes)
      const nodePath = astar(nodes, startNavRoomId, endNavRoomId);
      if (nodePath?.length) {
        const points = [];
        for (const nid of nodePath) {
          if (nodes[nid]) {
            points.push([nodes[nid].x, nodes[nid].y]);
          }
        }
        
        // Only draw path if we have at least 2 points
        if (points.length >= 2) {
          // Animate path with moving dot
          const animation = animatePath(svg, points, {
            // Colors use defaults from animatedPath.js
            pathWidth: 4,
            dotRadius: 6,
            duration: 3000 // 3 seconds animation
          });

          pathLineRef.current = {
            animation,
            elements: animation ? animation.getElements() : [],
            remove: () => {
              if (animation) {
                animation.stop();
              }
              if (pathLineRef.current?.elements) {
                pathLineRef.current.elements.forEach(el => el.remove());
              }
            }
          };
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('Error drawing path:', err);
      return false;
    }
  }, [clearPath]);

  // Auto-navigate when both selected
  useEffect(() => {
    if (currentLocation && destination) {
      drawPath(currentLocation, destination);
    }
  }, [currentLocation, destination, drawPath]);

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-4 shadow-sm flex-shrink-0">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
        >
          <ArrowLeft size={20} className="text-gray-600 md:w-6 md:h-6" />
        </button>

        {/* Current Location Input */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 md:px-4 py-1.5 md:py-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 flex-shrink-0" />
            <input
              type="text"
              value={currentName}
              onChange={(e) => {
                setCurrentName(e.target.value);
                setShowCurrentDropdown(true);
              }}
              onFocus={() => setShowCurrentDropdown(true)}
              placeholder="Your location..."
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />
          </div>
          {showCurrentDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 md:max-h-60 overflow-auto">
              {getFilteredRooms(currentName).map((room) => (
                <button
                  key={room}
                  onClick={() => selectCurrentLocation(room)}
                  className="w-full text-left px-3 md:px-4 py-2 hover:bg-gray-50 text-sm truncate"
                >
                  {room}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input (Mobile: in header) */}
        <div className="relative flex-1 min-w-0 md:hidden">
          <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-3 py-1.5">
            <MapPin size={14} className="text-red-500 flex-shrink-0" />
            <input
              type="text"
              value={destinationName}
              onChange={(e) => {
                setDestinationName(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              placeholder="Destination..."
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />
            {destinationName && (
              <button onClick={clearDestination} className="flex-shrink-0">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
          {showDestDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-auto">
              {getFilteredRooms(destinationName).map((room) => (
                <button
                  key={room}
                  onClick={() => selectDestination(room)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm truncate"
                >
                  {room}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Destination Bar (Desktop only when selected) */}
      {destinationName && (
        <div className="hidden md:flex bg-white border-b px-4 py-2 items-center gap-3 flex-shrink-0">
          <MapPin size={18} className="text-red-500" />
          <span className="flex-1 font-medium text-sm">{destinationName}</span>
          <button onClick={clearDestination} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} className="text-gray-500" />
          </button>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{currentFloor}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Floor Selector */}
        <div className="absolute left-2 md:left-4 top-2 md:top-4 z-20 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          {FLOORS.map((floor) => (
            <button
              key={floor.id}
              onClick={() => floor.file && changeFloor(floor.id)}
              disabled={!floor.file}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-semibold text-xs md:text-sm transition ${
                currentFloor === floor.id
                  ? "bg-purple-600 text-white"
                  : floor.file
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {floor.label}
            </button>
          ))}
        </div>

        {/* Path Painter Toggle */}
        <div className="absolute left-2 md:left-4 bottom-32 md:bottom-24 z-20">
          <button
            onClick={togglePathPainter}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg shadow-lg transition ${
              showPathPainter
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            title="Toggle Path Painter"
          >
            <Route size={18} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute left-2 md:left-4 bottom-20 md:bottom-4 z-20 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <button onClick={zoomIn} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200">
            <Plus size={18} className="text-gray-600" />
          </button>
          <button onClick={resetZoom} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 border-y">
            <Locate size={18} className="text-gray-600" />
          </button>
          <button onClick={zoomOut} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200">
            <Minus size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0 overflow-auto flex items-center justify-center p-2 md:p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading map...</span>
            </div>
          ) : !svgContent ? (
            <div className="text-center text-gray-500">
              <Navigation size={40} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Floor map not available</p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="transition-transform duration-200 w-full h-full flex items-center justify-center"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            />
          )}
        </div>

        {/* Destination Search (Desktop floating) */}
        {!destinationName && (
          <div className="hidden md:block absolute right-4 top-4 z-20 w-64">
            <div className="relative">
              <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2.5 shadow-lg">
                <MapPin size={16} className="text-red-500 flex-shrink-0" />
                <input
                  type="text"
                  value={destinationName}
                  onChange={(e) => {
                    setDestinationName(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  placeholder="Search destination..."
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {getFilteredRooms(destinationName).map((room) => (
                    <button
                      key={room}
                      onClick={() => selectDestination(room)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      {room}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clear Navigation Button */}
        {destination && currentLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={resetSelection}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition text-sm md:text-base"
            >
              <X size={16} className="md:w-[18px] md:h-[18px]" />
              Clear Path
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showDestDropdown || showCurrentDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowDestDropdown(false);
            setShowCurrentDropdown(false);
          }}
        />
      )}

      {/* Styles for SVG */}
      <style>{`
        .destination-area path,
        .destination-area rect,
        .destination-area polygon {
          fill: #3B82F6 !important;
          fill-opacity: 0.5 !important;
          stroke: #1D4ED8 !important;
          stroke-width: 3 !important;
        }
        .selected-area path,
        .selected-area rect,
        .selected-area polygon {
          fill: #22C55E !important;
          fill-opacity: 0.5 !important;
          stroke: #15803D !important;
          stroke-width: 3 !important;
        }
        .path-line {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
