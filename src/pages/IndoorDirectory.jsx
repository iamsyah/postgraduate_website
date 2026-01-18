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
    { name: "Bilik Omar Khayyam", navRoomId: "nav_room_BilikOmarKhayyam" },
    { name: "Smart Classroom", navRoomId: "nav_room_SmartClassroom" },
    { name: "Pejabat Pasca Siswazah", navRoomId: "nav_room_PejabatPascaSiswazah" },
    { name: "SOC", navRoomId: "nav_room_SOC" },
    { name: "Student Hub", navRoomId: "nav_room_StudentHub" },
    { name: "Institud Analitik Data Raya dan Kepintaraan Buatan (IBDAAI)", navRoomId: "nav_room_IBDAAI" },
    { name: "BK33", navRoomId: "nav_room_BK33" },
    { name: "BK34", navRoomId: "nav_room_BK34" },
    { name: "BK35", navRoomId: "nav_room_BK35" },
    { name: "BK36", navRoomId: "nav_room_BK36" },
    { name: "BK37", navRoomId: "nav_room_BK37" },
    { name: "EVO City Development Centre", navRoomId: "nav_room_evoCity" },
    { name: "National Autism Resource Centre", navRoomId: "nav_room_autism" },
    { name: "Cloud Operation Centre", navRoomId: "nav_room_Cloud" },
    { name: "iDACC", navRoomId: "nav_room_iDACC" },
  ],

  // 1st Floor - Available Rooms
  "1": [
    { name: "Global Learning Space", navRoomId: "nav_room_GLS" },
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
    { name: "Pejabat HEP", navRoomId: "nav_room_HEP" },
  ],

  // 2nd Floor - Available Rooms
  "2": [
    { name: "Postgraduate Lab", navRoomId: "nav_room_postgraduateLab" },
    { name: "Software Lab 1", navRoomId: "nav_room_softlab1" },
    { name: "Software Lab 2", navRoomId: "nav_room_softlab2" },
    { name: "User Science", navRoomId: "nav_room_userScience" },
    { name: "High Performance Computing (HPC)", navRoomId: "nav_room_HPC" },
    { name: "Intelligent Information Systems (IIS)", navRoomId: "nav_room_IIS" },
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
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showPathPainter, setShowPathPainter] = useState(false);
  const pathPainterRef = useRef(null);
  const [pathSegments, setPathSegments] = useState(null); // { floor: string, points: [x, y][] }[]
  const [pathInfo, setPathInfo] = useState(null); // { startFloor, endFloor, transitions: { from, to, via }[] }

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
  const changeFloor = useCallback((floorId, preservePath = false) => {
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

    if (currentFloor === floorId) return; // No change needed

    // Clear current path visualization
    clearPath();

    // Only clear selections if not preserving path (for manual floor switching)
    if (!preservePath) {
      // Clear destination and current location
      setDestination(null);
      setDestinationName("");
      setCurrentLocation(null);
      setCurrentName("");
      setPathSegments(null);
      setPathInfo(null);

      // Remove visual markers from SVG
      if (svgRef.current) {
        svgRef.current.querySelectorAll(".destination-area, .selected-area").forEach((el) => {
          el.classList.remove("destination-area", "selected-area");
        });
      }
    } else {
      // When preserving path, just remove visual markers but keep selections
      // The path will be redrawn by the useEffect hook
      if (svgRef.current) {
        svgRef.current.querySelectorAll(".destination-area, .selected-area").forEach((el) => {
          el.classList.remove("destination-area", "selected-area");
        });
      }
    }

    // Change floor
    setCurrentFloor(floorId);
  }, [clearPath, currentFloor]);

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

  // Resolve room input to ID (checks all floors, not just current floor)
  const resolveRoomInput = (input) => {
    if (!input) {
      console.log('resolveRoomInput: empty input');
      return { id: null, name: null };
    }
    
    // First try current floor's nameToId (faster lookup)
    if (nameToId[input]) {
      console.log('resolveRoomInput: direct match in nameToId:', nameToId[input]);
      return { id: nameToId[input], name: input };
    }
    
    // If not found, search all floors in FLOOR_ROOMS
    const lower = input.toLowerCase();
    for (const [floorId, floorRooms] of Object.entries(FLOOR_ROOMS)) {
      for (const room of floorRooms) {
        if (room.name.toLowerCase() === lower || room.name.toLowerCase().includes(lower)) {
          console.log('resolveRoomInput: match found in floor', floorId, ':', room.navRoomId);
          return { id: room.navRoomId, name: room.name };
        }
      }
    }
    
    // Also check current floor's nameToId for case-insensitive/partial matches
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase() === lower) {
        console.log('resolveRoomInput: case-insensitive match:', nameToId[key]);
        return { id: nameToId[key], name: key };
      }
    }
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase().includes(lower)) {
        console.log('resolveRoomInput: partial match:', nameToId[key]);
        return { id: nameToId[key], name: key };
      }
    }
    
    // Last resort: check rooms array (current floor only)
    for (const rid of rooms) {
      if (rid.toLowerCase() === lower) {
        console.log('resolveRoomInput: match in rooms array:', rid);
        return { id: rid, name: rid };
      }
    }
    
    console.warn('resolveRoomInput: no match found for:', input, {
      nameToIdKeys: Object.keys(nameToId).slice(0, 5),
      roomsCount: rooms.length,
      searchedAllFloors: true
    });
    return { id: null, name: null };
  };

  // Get all rooms grouped by floor
  const getAllRoomsByFloor = useCallback(() => {
    const roomsByFloor = {
      'G': { label: 'Ground Floor', rooms: [] },
      '1': { label: '1st Floor', rooms: [] },
      '2': { label: '2nd Floor', rooms: [] }
    };

    // Use explicit floor order to ensure correct processing order
    const floorOrder = ['G', '1', '2'];
    for (const floorId of floorOrder) {
      const rooms = FLOOR_ROOMS[floorId];
      if (rooms && roomsByFloor[floorId]) {
        roomsByFloor[floorId].rooms = rooms.map(room => room.name).sort((a, b) => a.localeCompare(b));
      }
    }

    return roomsByFloor;
  }, []);

  // Define floor order: Ground Floor, 1st Floor, 2nd Floor
  const FLOOR_ORDER = ['G', '1', '2'];

  // Filter suggestions - returns rooms grouped by floor in correct order
  const getFilteredRoomsByFloor = (query) => {
    const allRoomsByFloor = getAllRoomsByFloor();
    const lower = query ? query.toLowerCase() : '';

    const filtered = {};

    // Process floors in the specified order
    for (const floorId of FLOOR_ORDER) {
      const floorData = allRoomsByFloor[floorId];
      if (!floorData) continue;

      const filteredRooms = lower
        ? floorData.rooms.filter(room => room.toLowerCase().includes(lower))
        : floorData.rooms;
      
      if (filteredRooms.length > 0) {
        filtered[floorId] = {
          label: floorData.label,
          rooms: filteredRooms
        };
      }
    }

    return filtered;
  };

  // Get filtered rooms by floor as an ordered array for rendering
  const getFilteredRoomsByFloorArray = (query) => {
    const filtered = getFilteredRoomsByFloor(query);
    // Return as array in correct order
    return FLOOR_ORDER
      .map(floorId => ({ floorId, floorData: filtered[floorId] }))
      .filter(item => item.floorData); // Only include floors that have rooms
  };

  // Handle destination selection
  const selectDestination = (name) => {
    console.log('selectDestination called with:', name);
    setDestinationName(name);
    setShowDestDropdown(false);
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".destination-area").forEach((el) => el.classList.remove("destination-area"));
    }
    const { id } = resolveRoomInput(name);
    console.log('resolveRoomInput returned:', { id, name });
    setDestination(id || null);
    console.log('Destination set to:', id || null);
    
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
    console.log('selectCurrentLocation called with:', name);
    setCurrentName(name);
    setShowCurrentDropdown(false);
    if (svgRef.current) {
      svgRef.current.querySelectorAll(".selected-area").forEach((el) => el.classList.remove("selected-area"));
    }
    const { id } = resolveRoomInput(name);
    console.log('resolveRoomInput returned:', { id, name });
    setCurrentLocation(id || null);
    console.log('CurrentLocation set to:', id || null);
    
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
      // Make SVG fill container
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.display = "block";
      svg.style.pointerEvents = "auto";
      svg.style.objectFit = "cover";
      svg.style.minWidth = "100%";
      svg.style.minHeight = "100%";
      
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

  // Helper: Get floor for a node ID (prefers stored floor from graph if available)
  const getNodeFloor = useCallback((nodeId, nodes = null) => {
    if (!nodeId) return null;
    
    // First, check if node object has floor property (from buildManualGraph)
    if (nodes && nodes[nodeId] && nodes[nodeId].floor !== undefined && nodes[nodeId].floor !== null) {
      return nodes[nodeId].floor;
    }
    
    // Fallback: Check for stair/lift nodes with floor suffix
    // nav_stair_1_G -> G, nav_stair_1_1 -> 1, nav_stair_1_2 -> 2
    // nav_lift_CS2_G -> G, nav_lift_CS2_1 -> 1, nav_lift_CS2_2 -> 2
    
    // Check for floor suffix: _G, _1, or _2 at the end
    // Must match the entire suffix to avoid false positives
    if (nodeId.endsWith('_G')) return 'G';
    if (nodeId.endsWith('_2')) return '2';
    if (nodeId.endsWith('_1')) {
      // Make sure it's not something like _1_G or _1_2
      // Since we checked _G and _2 first, if it ends with _1, it's floor 1
      // But double-check: _1_1 would be floor 1, which is correct
      return '1';
    }
    
    // Check FLOOR_ROOMS for room nodes
    for (const [floorId, rooms] of Object.entries(FLOOR_ROOMS)) {
      if (rooms.some((room) => room.navRoomId === nodeId)) {
        return floorId;
      }
    }
    
    return null;
  }, []);

  // Helper: Check if a node is a stair or lift
  const isStairOrLift = useCallback((nodeId) => {
    return nodeId?.startsWith('nav_stair_') || nodeId?.startsWith('nav_lift_');
  }, []);

  // Helper: Validate that path only uses stairs/lifts for floor transitions
  const validatePathFloorTransitions = useCallback((nodePath, nodes) => {
    if (!nodePath || nodePath.length < 2) return true; // Valid if too short to have transitions

    for (let i = 0; i < nodePath.length - 1; i++) {
      const currentNodeId = nodePath[i];
      const nextNodeId = nodePath[i + 1];
      
      if (!currentNodeId || !nextNodeId) continue;
      
      const currentFloor = getNodeFloor(currentNodeId, nodes);
      const nextFloor = getNodeFloor(nextNodeId, nodes);
      
      // If floors are different, both nodes must be stairs/lifts for valid floor transition
      if (currentFloor && nextFloor && currentFloor !== nextFloor) {
        const currentIsStairLift = isStairOrLift(currentNodeId);
        const nextIsStairLift = isStairOrLift(nextNodeId);
        
        // Both nodes must be stairs/lifts for floor transitions
        if (!currentIsStairLift || !nextIsStairLift) {
          console.error(`❌ Invalid floor transition: ${currentFloor} -> ${nextFloor}`);
          console.error(`   From: ${currentNodeId} (isStair/Lift: ${currentIsStairLift})`);
          console.error(`   To: ${nextNodeId} (isStair/Lift: ${nextIsStairLift})`);
          console.error(`   Floor transitions must use stairs/lifts on both sides`);
          return false;
        }
        
        console.log(`✓ Valid floor transition: ${currentFloor} -> ${nextFloor} via ${currentNodeId} -> ${nextNodeId}`);
      }
    }
    
    return true;
  }, [getNodeFloor, isStairOrLift]);

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

  // Draw path segments for the current floor
  const drawPathForCurrentFloor = useCallback((segments) => {
    if (!svgRef.current || !segments || segments.length === 0) {
      console.log('Cannot draw path: svgRef or segments missing', {
        hasSvgRef: !!svgRef.current,
        hasSegments: !!(segments && segments.length > 0)
      });
      return;
    }

    // Clear existing path first
    clearPath();

    // Find segments for current floor
    // Use string comparison to handle type mismatches (e.g., "1" vs 1)
    const currentFloorSegments = segments.filter(seg => String(seg.floor) === String(currentFloor));
    
    console.log(`Drawing path for floor ${currentFloor}:`, {
      totalSegments: segments.length,
      currentFloorSegments: currentFloorSegments.length,
      floorsWithSegments: segments.map(s => `${s.floor}(${typeof s.floor})`),
      currentFloor: `${currentFloor}(${typeof currentFloor})`,
      segmentDetails: segments.map(s => ({ floor: s.floor, points: s.points?.length || 0 }))
    });
    
    if (currentFloorSegments.length === 0) {
      // No path on current floor
      console.log(`No path segments found for floor ${currentFloor}. Available floors: ${segments.map(s => s.floor).join(', ')}`);
      return;
    }

    // Combine all points from current floor segments
    const points = [];
    for (const segment of currentFloorSegments) {
      points.push(...segment.points);
    }

    console.log(`Combined ${points.length} points for floor ${currentFloor}`);

    // Only draw if we have at least 2 points
    if (points.length >= 2) {
      const svg = svgRef.current;
      
      // Animate path with moving dot
      const animation = animatePath(svg, points, {
        pathWidth: 4,
        dotRadius: 6,
        duration: 3000
      });

      if (animation) {
        const elements = animation.getElements();
        pathLineRef.current = {
          animation,
          elements,
          remove: () => {
            if (animation) {
              animation.stop();
            }
            if (pathLineRef.current?.elements) {
              pathLineRef.current.elements.forEach(el => el.remove());
            }
          }
        };
        console.log(`Path drawn successfully on floor ${currentFloor}`, {
          elementsCount: elements.length,
          pathElement: elements[0],
          svgChildrenCount: svg.children.length,
          pathInSVG: svg.querySelector('.path-line') !== null
        });
      } else {
        console.warn('Animation creation failed');
      }
    } else {
      console.warn(`Not enough points to draw path: ${points.length}`);
    }
  }, [currentFloor, clearPath]);

  // Draw navigation path with multi-floor support
  const drawPath = useCallback((startRoomId, endRoomId) => {
    console.log('drawPath called:', { startRoomId, endRoomId, hasSvgRef: !!svgRef.current });
    
    if (!svgRef.current || !startRoomId || !endRoomId) {
      console.warn('drawPath early return:', {
        hasSvgRef: !!svgRef.current,
        hasStartRoom: !!startRoomId,
        hasEndRoom: !!endRoomId
      });
      return false;
    }

    try {
      // Clear existing path
      clearPath();
      setPathSegments(null);
      setPathInfo(null);

      // Build navigation graph using manual definitions
      const nodes = buildManualGraph();
      if (!nodes || Object.keys(nodes).length === 0) {
        console.warn('No navigation graph found');
        return false;
      }

      // Find nav_room nodes for start and end
      let startNavRoomId = null;
      let endNavRoomId = null;
      
      // Check if the room IDs directly match nav_room nodes in the graph
      if (nodes[startRoomId] && nodes[startRoomId].type === 'nav_room') {
        startNavRoomId = startRoomId;
      } else {
        startNavRoomId = findNavRoomNode(svgRef.current, startRoomId, nodes);
      }
      
      if (nodes[endRoomId] && nodes[endRoomId].type === 'nav_room') {
        endNavRoomId = endRoomId;
      } else {
        endNavRoomId = findNavRoomNode(svgRef.current, endRoomId, nodes);
      }
      
      if (!startNavRoomId || !endNavRoomId) {
        console.warn(`Could not find nav_room nodes: start=${startRoomId}(${startNavRoomId}), end=${endRoomId}(${endNavRoomId})`);
        return false;
      }

      // Check if nav_room nodes exist in the graph
      if (!nodes[startNavRoomId] || !nodes[endNavRoomId]) {
        console.warn(`nav_room nodes not found in graph: ${startNavRoomId}, ${endNavRoomId}`);
        return false;
      }

      // Get floors for start and end (use graph's stored floor info)
      const startFloor = getNodeFloor(startNavRoomId, nodes);
      const endFloor = getNodeFloor(endNavRoomId, nodes);

      // Find path using A* (enforces floor transitions only via stairs/lifts)
      console.log('Calling A* pathfinding...');
      const nodePath = astar(nodes, startNavRoomId, endNavRoomId);
      
      if (!nodePath || nodePath.length === 0) {
        console.error('No path found between nodes');
        console.error('Start node:', startNavRoomId, 'edges:', nodes[startNavRoomId]?.edges?.map(e => e.to) || 'none');
        console.error('End node:', endNavRoomId, 'edges:', nodes[endNavRoomId]?.edges?.map(e => e.to) || 'none');
        console.error('Start floor:', startFloor, 'End floor:', endFloor);
        
        // Debug: Check graph connectivity
        const visited = new Set();
        const queue = [{ id: startNavRoomId, path: [startNavRoomId] }];
        let reachableNodes = new Set();
        
        // BFS to find reachable nodes
        while (queue.length > 0 && queue.length < 100) {
          const { id, path } = queue.shift();
          if (visited.has(id)) continue;
          visited.add(id);
          reachableNodes.add(id);
          
          const node = nodes[id];
          if (node && node.edges) {
            for (const edge of node.edges) {
              if (!visited.has(edge.to)) {
                queue.push({ id: edge.to, path: [...path, edge.to] });
              }
            }
          }
        }
        
        console.error('Graph connectivity check:');
        console.error(`- Total nodes reachable from ${startNavRoomId}: ${reachableNodes.size}`);
        console.error(`- Can reach ${endNavRoomId}?`, reachableNodes.has(endNavRoomId));
        if (!reachableNodes.has(endNavRoomId)) {
          console.error('⚠️ Destination is not reachable from start node!');
        }
        
        return false;
      }
      
      console.log('A* found path with', nodePath.length, 'nodes');
      
      // Validate that path only uses stairs/lifts for floor transitions
      const isValidPath = validatePathFloorTransitions(nodePath, nodes);
      if (!isValidPath) {
        console.error('Invalid path: floor transitions must only occur via stairs or lifts');
        console.error('Path:', nodePath);
        return false;
      }
      
      console.log('Path validated: all floor transitions use stairs/lifts');

      // Split path into segments by floor
      const segments = [];
      const transitions = [];
      let currentSegment = null;
      let currentFloor = startFloor;

      console.log('=== PATHFINDING DEBUG ===');
      console.log('From:', startNavRoomId, '(Floor', startFloor, ')');
      console.log('To:', endNavRoomId, '(Floor', endFloor, ')');
      console.log('Full path:', nodePath);
      console.log('Path length:', nodePath.length);

      // First pass: identify floors for all nodes in the path
      const nodeFloors = new Map();
      let lastKnownFloor = startFloor;

      for (let i = 0; i < nodePath.length; i++) {
        const nodeId = nodePath[i];
        // Use graph's stored floor info (from buildManualGraph)
        let nodeFloor = getNodeFloor(nodeId, nodes);
        
        // For nav_path nodes, if still no floor, use the floor of nearby nodes
        if (!nodeFloor && nodeId.startsWith('nav_path')) {
          // Look ahead and behind to find a node with a known floor
          let foundFloor = null;
          
          // Look ahead (max 3 nodes)
          for (let j = i + 1; j < Math.min(i + 4, nodePath.length); j++) {
            const aheadFloor = getNodeFloor(nodePath[j], nodes);
            if (aheadFloor) {
              foundFloor = aheadFloor;
              break;
            }
          }
          
          // Look behind if not found ahead (max 3 nodes)
          if (!foundFloor) {
            for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
              const behindFloor = getNodeFloor(nodePath[j], nodes);
              if (behindFloor) {
                foundFloor = behindFloor;
                break;
              }
            }
          }
          
          // Use last known floor as fallback
          nodeFloor = foundFloor || lastKnownFloor;
        }
        
        if (nodeFloor) {
          lastKnownFloor = nodeFloor;
        }
        
        nodeFloors.set(nodeId, nodeFloor || lastKnownFloor);
      }

      // Second pass: build segments with known floor information
      for (let i = 0; i < nodePath.length; i++) {
        const nodeId = nodePath[i];
        const node = nodes[nodeId];
        
        if (!node) {
          console.warn(`[${i}] Node not found in graph:`, nodeId);
          continue;
        }

        // Get floor for this node (from our pre-computed map)
        const nodeFloor = nodeFloors.get(nodeId) || startFloor;
        const isStairLift = isStairOrLift(nodeId);

        console.log(`[${i}] ${nodeId}`, {
          floor: nodeFloor,
          currentFloor,
          isStairLift,
          coords: `(${node.x}, ${node.y})`
        });

        // Initialize segment if needed
        if (!currentSegment) {
          currentSegment = {
            floor: nodeFloor,
            points: [[node.x, node.y]]
          };
          currentFloor = nodeFloor;
          console.log(`  → Started first segment on floor ${nodeFloor}`);
          continue;
        }

        // Check if floor changed
        if (nodeFloor !== currentFloor) {
          console.log(`  ⚠️ FLOOR CHANGE: ${currentFloor} → ${nodeFloor} via ${nodeId}`);
          
          // Save previous segment before floor change
          if (currentSegment && currentSegment.points.length > 0) {
            segments.push({...currentSegment});
            console.log(`  ✓ Saved segment for floor ${currentSegment.floor} (${currentSegment.points.length} points)`);
          }
          
          // Record transition (only if it's via stair/lift)
          if (isStairLift) {
            transitions.push({
              from: currentFloor,
              to: nodeFloor,
              via: nodeId
            });
          }
          
          // Start new segment on new floor
          currentSegment = {
            floor: nodeFloor,
            points: [[node.x, node.y]]
          };
          currentFloor = nodeFloor;
          console.log(`  → Started new segment on floor ${nodeFloor}`);
        } else {
          // Same floor, continue current segment
          currentSegment.points.push([node.x, node.y]);
        }
      }

      // Add final segment
      if (currentSegment && currentSegment.points.length > 0) {
        segments.push({...currentSegment});
        console.log(`✓ Saved final segment for floor ${currentSegment.floor} (${currentSegment.points.length} points)`);
      }

      console.log('=== PATH SEGMENTS ===');
      segments.forEach((seg, idx) => {
        console.log(`Segment ${idx + 1}: Floor ${seg.floor}, ${seg.points.length} points`);
      });
      console.log('=== TRANSITIONS ===');
      transitions.forEach((trans, idx) => {
        console.log(`Transition ${idx + 1}: Floor ${trans.from} → ${trans.to} via ${trans.via}`);
      });
      console.log('=== END DEBUG ===');

      // Store path info
      setPathInfo({
        startFloor,
        endFloor,
        transitions
      });
      setPathSegments(segments);

      // Don't draw here - let the redraw useEffect handle it
      // This prevents double-drawing and ensures proper timing

      // If multi-floor path and we're not on a floor with a path segment, show message
      if (startFloor !== endFloor && segments.length > 0) {
        const hasPathOnCurrentFloor = segments.some(seg => String(seg.floor) === String(currentFloor));
        if (!hasPathOnCurrentFloor) {
          console.log(`Path exists but not on current floor ${currentFloor}. Path segments available on floors: ${segments.map(s => s.floor).join(', ')}`);
        }
      }

      return true;
    } catch (err) {
      console.error('Error drawing path:', err);
      return false;
    }
  }, [clearPath, getNodeFloor, isStairOrLift, drawPathForCurrentFloor]);

  // Auto-navigate when both selected
  useEffect(() => {
    console.log('Pathfinding useEffect triggered:', {
      currentLocation,
      destination,
      hasSvgRef: !!svgRef.current
    });
    
    if (currentLocation && destination) {
      console.log('Both locations selected, calling drawPath...');
      drawPath(currentLocation, destination);
    } else {
      console.log('Locations not complete, clearing path');
      // Clear path when selection is cleared
      clearPath();
      setPathSegments(null);
      setPathInfo(null);
    }
  }, [currentLocation, destination, drawPath, clearPath]);

  // Redraw path when floor changes if we have a path
  // Wait for SVG to be loaded before drawing
  useEffect(() => {
    if (pathSegments && pathSegments.length > 0 && svgRef.current) {
      // Use a small delay to ensure SVG is fully rendered
      const timeoutId = setTimeout(() => {
        drawPathForCurrentFloor(pathSegments);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentFloor, pathSegments, svgContent, drawPathForCurrentFloor]);

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 1.0)); // Minimum zoom: 1.0 (no zoom out beyond default)
  const resetZoom = () => {
    setScale(1);
    setPanX(0);
    setPanY(0);
  };

  // Pan/drag handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault(); // Prevent scrolling
      setPanX(e.touches[0].clientX - dragStart.x);
      setPanY(e.touches[0].clientY - dragStart.y);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentName) {
                  e.preventDefault();
                  const { id, name } = resolveRoomInput(currentName);
                  if (id) {
                    selectCurrentLocation(name || currentName);
                    setShowCurrentDropdown(false);
                  }
                }
              }}
              placeholder="Your location..."
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />
          </div>
          {showCurrentDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 md:max-h-96 overflow-auto">
              {getFilteredRoomsByFloorArray(currentName).map(({ floorId, floorData }) => (
                <div key={floorId}>
                  <div className="sticky top-0 bg-gray-100 px-3 md:px-4 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200">
                    {floorData.label}
                  </div>
                  {floorData.rooms.map((room) => (
                    <button
                      key={`${floorId}-${room}`}
                      onClick={() => selectCurrentLocation(room)}
                      className="w-full text-left px-3 md:px-4 py-2.5 md:py-2 hover:bg-gray-50 active:bg-gray-100 text-sm truncate touch-manipulation min-h-[44px] flex items-center"
                    >
                      {room}
                    </button>
                  ))}
                </div>
              ))}
              {getFilteredRoomsByFloorArray(currentName).length === 0 && (
                <div className="px-3 md:px-4 py-4 text-sm text-gray-500 text-center">
                  No rooms found
                </div>
              )}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && destinationName) {
                  e.preventDefault();
                  const { id, name } = resolveRoomInput(destinationName);
                  if (id) {
                    selectDestination(name || destinationName);
                    setShowDestDropdown(false);
                  }
                }
              }}
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
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
              {getFilteredRoomsByFloorArray(destinationName).map(({ floorId, floorData }) => (
                <div key={floorId}>
                  <div className="sticky top-0 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200">
                    {floorData.label}
                  </div>
                  {floorData.rooms.map((room) => (
                    <button
                      key={`${floorId}-${room}`}
                      onClick={() => selectDestination(room)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100 text-sm truncate touch-manipulation min-h-[44px] flex items-center"
                    >
                      {room}
                    </button>
                  ))}
                </div>
              ))}
              {getFilteredRoomsByFloorArray(destinationName).length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No rooms found
                </div>
              )}
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
              onClick={() => {
                if (floor.file) {
                  // Preserve selections if we have an active path (multi-floor navigation)
                  const hasActivePath = pathSegments && pathSegments.length > 0 && currentLocation && destination;
                  changeFloor(floor.id, hasActivePath);
                }
              }}
              disabled={!floor.file}
              className={`min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center font-semibold text-xs md:text-sm transition touch-manipulation active:scale-95 ${
                currentFloor === floor.id
                  ? "bg-purple-600 text-white"
                  : floor.file
                  ? "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label={`Switch to floor ${floor.label}`}
            >
              {floor.label}
            </button>
          ))}
        </div>

        {/* Path Painter Toggle */}
        <div className="absolute left-2 md:left-4 bottom-32 md:bottom-24 z-20">
          <button
            onClick={togglePathPainter}
            className={`min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-lg shadow-lg transition touch-manipulation active:scale-95 ${
              showPathPainter
                ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
                : "bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200"
            }`}
            title="Toggle Path Painter"
            aria-label="Toggle path painter"
          >
            <Route size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute left-2 md:left-4 bottom-20 md:bottom-4 z-20 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <button 
            onClick={zoomIn} 
            className="min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 touch-manipulation active:scale-95 transition-colors"
            aria-label="Zoom in"
          >
            <Plus size={18} className="text-gray-600 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={resetZoom} 
            className="min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 border-y touch-manipulation active:scale-95 transition-colors"
            aria-label="Reset zoom"
          >
            <Locate size={18} className="text-gray-600 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={zoomOut} 
            className="min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 touch-manipulation active:scale-95 transition-colors"
            aria-label="Zoom out"
          >
            <Minus size={18} className="text-gray-600 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div 
          ref={mapContainerRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
              <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading map...</span>
            </div>
          ) : !svgContent ? (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <Navigation size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Floor map not available</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                ref={containerRef}
                className={scale > 1 ? '' : 'transition-transform duration-200'}
                style={{
                  transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
                  transformOrigin: "center center",
                  width: '100%',
                  height: '100%',
                  transition: scale > 1 ? 'none' : 'transform 200ms',
                }}
              />
            </div>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && destinationName) {
                      e.preventDefault();
                      const { id, name } = resolveRoomInput(destinationName);
                      if (id) {
                        selectDestination(name || destinationName);
                        setShowDestDropdown(false);
                      }
                    }
                  }}
                  placeholder="Search destination..."
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-auto">
                  {getFilteredRoomsByFloorArray(destinationName).map(({ floorId, floorData }) => (
                    <div key={floorId}>
                      <div className="sticky top-0 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200">
                        {floorData.label}
                      </div>
                      {floorData.rooms.map((room) => (
                        <button
                          key={`${floorId}-${room}`}
                          onClick={() => selectDestination(room)}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100 text-sm touch-manipulation min-h-[44px] flex items-center"
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  ))}
                  {getFilteredRoomsByFloorArray(destinationName).length === 0 && (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      No rooms found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Path Info - Top Right Corner */}
        {destination && currentLocation && pathInfo && pathInfo.startFloor !== pathInfo.endFloor && (
          <div className={`absolute right-2 md:right-4 z-20 max-w-[calc(100vw-4rem)] md:max-w-sm ${
            destinationName ? 'top-2 md:top-2' : 'top-20 md:top-20'
          }`}>
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs md:text-sm">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-gray-700">Route:</span>
                <span className="bg-blue-100 px-2 py-1 rounded font-medium">Floor {pathInfo.startFloor}</span>
                {pathInfo.transitions.map((trans, idx) => {
                  const viaName = trans.via.replace(/nav_(stair|lift)_/, '').replace(/_G$|_1$|_2$/, '');
                  const viaType = trans.via.includes('stair') ? 'Stair' : 'Lift';
                  return (
                    <React.Fragment key={idx}>
                      <span className="text-gray-400">→</span>
                      <span className="bg-yellow-100 px-2 py-1 rounded">{viaType} {viaName}</span>
                      <span className="text-gray-400">→</span>
                    </React.Fragment>
                  );
                })}
                <span className="bg-purple-100 px-2 py-1 rounded font-medium">Floor {pathInfo.endFloor}</span>
              </div>
              {pathInfo.endFloor !== currentFloor && (
                <div className="text-orange-600 font-medium text-xs">
                  Switch to Floor {pathInfo.endFloor} to see remaining path
                </div>
              )}
              {/* Show which floors have path segments */}
              {pathSegments && pathSegments.length > 0 && (
                <div className="mt-1 text-gray-500 text-xs">
                  Path visible on: {pathSegments.map(seg => seg.floor).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clear Button - Bottom Center */}
        {destination && currentLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={resetSelection}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition text-sm md:text-base touch-manipulation active:scale-95 min-h-[44px]"
              aria-label="Clear navigation path"
            >
              <X size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
              <span>Clear Path</span>
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
        .path-line {
          pointer-events: none;
        }
        /* Improve touch targets on mobile */
        @media (max-width: 768px) {
          .destination-area,
          .selected-area {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
