import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/IndoorDirectory.css";
import { buildNavGraphFromSvg, findNearestNode } from "../utils/graph";
import { astar } from "../utils/astar";

// selection is via text input; helper predicates not needed

export default function IndoorDirectory() {
  const [svgContent, setSvgContent] = useState(null);
  const [destination, setDestination] = useState(null); // blue
  const [currentLocation, setCurrentLocation] = useState(null); // green
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [pathLine, setPathLine] = useState(null); // store navigation line element
  const [rooms, setRooms] = useState([]);
  const [roomNames, setRoomNames] = useState([]);
  const [nameToId, setNameToId] = useState({});
  const [idToName, setIdToName] = useState({}); // Reverse map: id -> friendly name
  const [destinationName, setDestinationName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Load SVG
  useEffect(() => {
    fetch("/maps/ground_floor.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent("<div style='color:red;padding:1rem'>Map failed to load</div>"));
  }, []);

  

  

  // --- Helpers for visuals ---
  const clearHighlights = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    console.debug('clearHighlights called');
    svg.querySelectorAll(".selected-area, .destination-area, .path-line").forEach((el) =>
      el.classList.remove("selected-area", "destination-area", "path-line")
    );
    if (pathLine) {
      console.debug('Removing existing path line');
      if (pathLine.remove) {
        pathLine.remove(); // New structure with multiple elements
      } else if (pathLine.elements) {
        pathLine.elements.forEach(el => el.remove());
      } else {
        pathLine.remove?.(); // Fallback for old structure
      }
      setPathLine(null);
    }
  }, [pathLine]);

  const resetSelection = () => {
    setDestination(null);
    setCurrentLocation(null);
    setDestinationName("");
    setCurrentName("");
    setToastMessage("");
    clearHighlights();
  };

  // Remove only the current-location highlight and path (used when updating current location)
  const removeCurrentHighlight = () => {
    if (!svgRef.current) return;
    for (const el of svgRef.current.querySelectorAll('.selected-area')) el.classList.remove('selected-area');
  };

  // --- Selection by text inputs (no map clicks) ---
  const resolveRoomInput = (input) => {
    if (!input) return { id: null, name: null };
    // exact display name
    if (nameToId[input]) return { id: nameToId[input], name: input };
    const lower = input.toLowerCase();
    // case-insensitive display name
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase() === lower) return { id: nameToId[key], name: key };
    }
    // partial match on display name
    for (const key of Object.keys(nameToId)) {
      if (key.toLowerCase().includes(lower)) return { id: nameToId[key], name: key };
    }
    // try raw id match (case-insensitive)
    for (const rid of rooms) {
      if (rid.toLowerCase() === lower) return { id: rid, name: rid };
    }
    // try adding room_ prefix + uppercase
    const candidate = `room_${input.toUpperCase()}`;
    if (svgRef.current && svgRef.current.getElementById(candidate)) return { id: candidate, name: candidate };
    return { id: null, name: null };
  };
  const handleDestinationInput = (e) => {
    const raw = e.target.value || "";
    setDestinationName(raw);
    // remove previous destination highlight but keep current selection
    if (svgRef.current) {
      for (const el of svgRef.current.querySelectorAll('.destination-area')) el.classList.remove('destination-area');
    }
    const { id, name } = resolveRoomInput(raw);
    setDestination(id || null);
    if (!id) return;
    const destEl = svgRef.current?.getElementById(id);
    if (destEl) destEl.classList.add('destination-area');
    console.debug('Destination resolved', raw, '->', id, name);
  };

  const handleCurrentInput = (e) => {
    const raw = e.target.value || "";
    setCurrentName(raw);
    // remove previous current highlight only (do not clear destination)
    removeCurrentHighlight();
    const { id, name } = resolveRoomInput(raw);
    setCurrentLocation(id || null);
    if (!id) return;
    const curEl = svgRef.current?.getElementById(id);
    if (curEl) curEl.classList.add('selected-area');
    console.debug('Current resolved', raw, '->', id, name);
  };

  const startNavigation = () => {
    if (!currentLocation || !destination) {
      setToastMessage('Please choose both Destination and Current Location (use the suggestions).');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    // remove old path if any
    if (pathLine) {
      if (pathLine.remove) {
        pathLine.remove();
      } else if (pathLine.elements) {
        pathLine.elements.forEach(el => el.remove());
      }
      setPathLine(null);
    }
    const ok = drawPath(currentLocation, destination);
    if (!ok) {
      setToastMessage('Could not compute path for the selected rooms.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // Inject SVG (after helpers are declared so clearHighlights is available)
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    containerRef.current.innerHTML = svgContent;
    const container = containerRef.current;
    const svg = container.querySelector("svg");
    svgRef.current = svg;

      if (svg) {
      svg.style.pointerEvents = "auto";
      for (const el of svg.querySelectorAll("*")) {
        if (el.style) el.style.pointerEvents = "visiblePainted";
      }
      // collect room ids for text-based selection
      try {
        const roomEls = Array.from(svg.querySelectorAll('g[id^="room_"], g[id^="office_"], g[id^="toilet_"], g[id^="surau_"], g[id^="cafe_"], g[id^="stair_"]'));
        const ids = roomEls.map((g) => g.id).filter(Boolean);
        setRooms(ids);
        // build human-friendly names -> id map
        const names = [];
        const map = Object.create(null);
        const idToName = Object.create(null); // reverse map for display
        
        for (const g of roomEls) {
          let name = null;
          const gId = g.id;
          
          // Method 1: prefer data-name attribute
          if (g.dataset && g.dataset.name) {
            name = g.dataset.name.trim();
          }
          
          // Method 2: Look for path elements with text-like IDs (your SVG format)
          // Your SVG has paths like <path id="BK 35" ...> or <path id="BILIK SIMULASI 2" ...>
          if (!name) {
            const pathEls = g.querySelectorAll('path[id]');
            for (const p of pathEls) {
              const pathId = p.id;
              // Skip shape paths (they have _shape suffix or are the main room shape)
              if (pathId && !pathId.includes('_shape') && !pathId.startsWith('room_') && !pathId.startsWith('office_')) {
                // This is likely a text label path
                name = pathId.replace(/_/g, ' ').trim();
                break;
              }
            }
          }
          
          // Method 3: Look for <text> element
          if (!name) {
            const t = g.querySelector('text');
            if (t && t.textContent) name = t.textContent.trim();
          }
          
          // Method 4: Look for <title> element
          if (!name) {
            const title = g.querySelector('title');
            if (title && title.textContent) name = title.textContent.trim();
          }
          
          // Method 5: Generate friendly name from ID
          if (!name) {
            // Convert room_BK36 -> BK36, office_PascaSiswazah -> Pasca Siswazah
            name = gId
              .replace(/^(room_|office_|toilet_|surau_|cafe_|stair_)/i, '')
              .replace(/([A-Z])/g, ' $1') // Add space before capitals
              .replace(/_/g, ' ')
              .trim();
          }
          
          // Ensure unique display names
          let display = name;
          let i = 1;
          while (map[display] && map[display] !== gId) {
            i += 1;
            display = `${name} (${i})`;
          }
          map[display] = gId;
          idToName[gId] = display;
          names.push(display);
        }
        
        // Sort names alphabetically
        names.sort((a, b) => a.localeCompare(b));
        
        setRoomNames(names);
        setNameToId(map);
        setIdToName(idToName);
        
        console.debug('Room names loaded:', names.length, 'rooms');
      } catch (err) {
        console.error('Failed to load room names:', err);
        setRooms([]);
      }
    }

    // Don't clear highlights here - only clear on initial load or reset
    // clearHighlights();
  }, [svgContent]);

  // --- Path drawing ---
  // drawPath uses external graph utilities and A* for routing
  const drawPath = (startId, endId) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const startEl = svg.getElementById(startId);
    const endEl = svg.getElementById(endId);
    if (!startEl || !endEl) return false;

    try {
      const startBox = startEl.getBBox();
      const endBox = endEl.getBBox();

      const startX = startBox.x + startBox.width / 2;
      const startY = startBox.y + startBox.height / 2;
      const endX = endBox.x + endBox.width / 2;
      const endY = endBox.y + endBox.height / 2;

      if (pathLine) {
        if (pathLine.remove) {
          pathLine.remove();
        } else if (pathLine.elements) {
          pathLine.elements.forEach(el => el.remove());
        }
      }
      console.debug('drawPath start:', startId, endId);

      // Build graph from the injected SVG
      const nodes = buildNavGraphFromSvg(svg);
      console.debug('graph nodes:', nodes ? Object.keys(nodes).length : 0);
      if (nodes) {
        // Debug: log node details
        console.debug('Node details:', Object.keys(nodes).map(k => ({
          id: k,
          x: nodes[k].x,
          y: nodes[k].y,
          edges: nodes[k].edges.length
        })));
        
        const sNode = findNearestNode(nodes, startX, startY);
        const eNode = findNearestNode(nodes, endX, endY);
        console.debug('Start point:', startX, startY, '-> nearest node:', sNode);
        console.debug('End point:', endX, endY, '-> nearest node:', eNode);
        
        if (sNode && eNode) {
          console.debug('🔍 Starting A* pathfinding...');
          console.debug('  From:', sNode, `(${startX.toFixed(1)}, ${startY.toFixed(1)})`);
          console.debug('  To:', eNode, `(${endX.toFixed(1)}, ${endY.toFixed(1)})`);
          
          const nodePath = astar(nodes, sNode, eNode);
          
          if (!nodePath) {
            console.warn('❌ A* pathfinding failed - nodes may be disconnected');
            console.debug('Start node:', sNode, 'edges:', nodes[sNode]?.edges?.length || 0);
            console.debug('End node:', eNode, 'edges:', nodes[eNode]?.edges?.length || 0);
            
            // Check if nodes are in different clusters
            const startConnected = new Set([sNode]);
            const toVisit = [sNode];
            while (toVisit.length > 0) {
              const current = toVisit.pop();
              const edges = nodes[current]?.edges || [];
              for (const edge of edges) {
                if (!startConnected.has(edge.to)) {
                  startConnected.add(edge.to);
                  toVisit.push(edge.to);
                }
              }
            }
            
            if (!startConnected.has(eNode)) {
              console.error('🚫 Nodes are in DISCONNECTED clusters!');
              console.debug('Start cluster size:', startConnected.size);
              console.debug('Nodes in start cluster:', Array.from(startConnected).slice(0, 10));
            }
          }
          
          if (nodePath && nodePath.length) {
            console.debug('✅ Path found!');
            console.debug('  Path length:', nodePath.length, 'nodes');
            console.debug('  Route:', nodePath.join(' → '));
            
            // Identify junctions in path
            const junctions = nodePath.filter(n => n.includes('junction'));
            if (junctions.length > 0) {
              console.debug('  Via junctions:', junctions.join(', '));
            }
            const points = [];
            points.push([startX, startY]);
            for (const nid of nodePath) points.push([nodes[nid].x, nodes[nid].y]);
            points.push([endX, endY]);

            const ns = "http://www.w3.org/2000/svg";
            
            // Create main path polyline
            const poly = document.createElementNS(ns, "polyline");
            const pointsStr = points.map((p) => p.join(",")).join(" ");
            poly.setAttribute("points", pointsStr);
            poly.setAttribute("fill", "none");
            poly.setAttribute("stroke", "#FF0000");
            poly.setAttribute("stroke-width", "8");
            poly.setAttribute("stroke-dasharray", "10,5");
            poly.setAttribute("stroke-linecap", "round");
            poly.setAttribute("stroke-linejoin", "round");
            poly.setAttribute("opacity", "0.9");
            poly.setAttribute("pointer-events", "none");
            poly.style.zIndex = "9999";
            poly.classList.add("path-line");
            
            // Append main path
            svg.appendChild(poly);
            
            // Add visual markers for junction waypoints
            const junctionMarkers = [];
            for (let i = 1; i < nodePath.length - 1; i++) {
              const nodeId = nodePath[i];
              if (nodeId.includes('junction')) {
                const jNode = nodes[nodeId];
                const marker = document.createElementNS(ns, "circle");
                marker.setAttribute("cx", jNode.x);
                marker.setAttribute("cy", jNode.y);
                marker.setAttribute("r", "8");
                marker.setAttribute("fill", "#FFA500");
                marker.setAttribute("stroke", "#FF6600");
                marker.setAttribute("stroke-width", "2");
                marker.setAttribute("opacity", "0.8");
                marker.setAttribute("pointer-events", "none");
                marker.classList.add("path-line");
                svg.appendChild(marker);
                junctionMarkers.push(marker);
              }
            }
            
            console.debug('✨ Path visualization created:');
            console.debug('  Main polyline points:', pointsStr);
            console.debug('  Junction markers:', junctionMarkers.length);
            console.debug('  Total waypoints:', nodePath.length);
            
            // Store all path elements for cleanup
            const allPathElements = [poly, ...junctionMarkers];
            setPathLine({ elements: allPathElements, remove: () => {
              allPathElements.forEach(el => el.remove());
            }});
            
            return true;
          }
        }
      }

      // Fallback straight line
      console.debug('Using fallback straight line');
      const ns = "http://www.w3.org/2000/svg";
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", startX);
      line.setAttribute("y1", startY);
      line.setAttribute("x2", endX);
      line.setAttribute("y2", endY);
      line.setAttribute("stroke", "red");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("stroke-dasharray", "6,4");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("opacity", "1");
      line.setAttribute("pointer-events", "none");
      line.classList.add("path-line");
      
      console.debug('Creating fallback line:', {x1: startX, y1: startY, x2: endX, y2: endY});
      svg.appendChild(line);
      console.debug('Line appended to SVG');
      setPathLine(line);
      return true;
    } catch (err) {
      console.error("Failed to draw path:", err);
      return false;
    }
  };

  

  return (
    <div className="p-6 max-w-6xl mx-auto">
    
            <h1 className="text-2xl font-semibold mb-4">FSKM Indoor Directory (Ground Floor)</h1>
            {toastMessage && (
              <div className="mb-3 p-2 bg-yellow-100 text-yellow-900 rounded">{toastMessage}</div>
            )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map section */}
        <div className="lg:col-span-2 w-full bg-white rounded-lg border shadow p-3">
          <div
            ref={containerRef}
            className="svg-wrapper w-full h-[72vh] overflow-auto"
          >
            {!svgContent && <div className="p-4 text-gray-500">Loading map…</div>}
          </div>

            <div className="mt-3 flex gap-3">
            <button
              onClick={resetSelection}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Reset
            </button>
            <button
              onClick={startNavigation}
              disabled={!currentLocation || !destination}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Start Navigation
            </button>
          </div>
        </div>

        {/* Info panel */}
        <aside className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-medium mb-2">Selection</h2>
            <p className="text-sm text-gray-600">
              Use the fields below to choose <strong>Destination</strong> and <strong>Current Location</strong>.
            </p>

            <div className="mt-3">
              <label className="text-sm text-gray-500 block">Destination</label>
              <input
                list="rooms-list"
                value={destinationName || ""}
                onChange={handleDestinationInput}
                placeholder="Enter room name"
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>

            <div className="mt-3">
              <label className="text-sm text-gray-500 block">Current Location</label>
              <input
                list="rooms-list"
                value={currentName || ""}
                onChange={handleCurrentInput}
                placeholder="Enter room name"
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>

            <datalist id="rooms-list">
              {roomNames.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>

            <div className="mt-3">
              <div className="text-sm text-gray-500">Selected Destination</div>
              <div className="font-semibold mt-1">{destination ? (idToName[destination] || destination) : "-"}</div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-500">Selected Current Location</div>
              <div className="font-semibold mt-1">{currentLocation ? (idToName[currentLocation] || currentLocation) : "-"}</div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-medium mb-2">Legend</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 block"></span> Destination
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 block"></span> Current Location
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 block"></span> Path
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
