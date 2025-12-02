# Complete SVG Indoor Map Creation Guide

## 🎯 Goal
Create a fully functional indoor navigation map with proper pathfinding that follows hallways and corridors instead of cutting through walls.

## 📋 Table of Contents
1. [SVG Structure Overview](#svg-structure-overview)
2. [Layer Organization](#layer-organization)
3. [Creating Navigation Nodes](#creating-navigation-nodes)
4. [Creating Navigation Edges](#creating-navigation-edges)
5. [Best Practices](#best-practices)
6. [Tools & Workflow](#tools--workflow)
7. [Testing & Validation](#testing--validation)

---

## 1. SVG Structure Overview

Your SVG should have these main layers:

```xml
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  
  <!-- Background -->
  <rect width="1920" height="1080" fill="#F5F5F5"/>
  
  <!-- Main floor plan group -->
  <g id="Floor_G">
    
    <!-- 1. Base layer: Walls and structure -->
    <g id="walls">
      <!-- Wall paths, building outline -->
    </g>
    
    <!-- 2. Walkable areas: Hallways, corridors -->
    <g id="walkable">
      <!-- Hallway paths (for visual reference) -->
    </g>
    
    <!-- 3. Rooms: Interactive areas -->
    <g id="rooms">
      <g id="room_BK36" data-name="Lecture Hall BK36">
        <text>BK 36</text>
        <path id="room_BK36_2" d="..." stroke="#FF0505"/>
      </g>
      <!-- More rooms... -->
    </g>
    
    <!-- 4. Navigation graph: Hidden layer for pathfinding -->
    <g id="nav" style="display:none">
      <!-- Navigation nodes -->
      <circle class="nav-node" id="nav_1" cx="500" cy="300" r="5"/>
      <!-- Navigation edges -->
      <line class="nav-edge" data-from="nav_1" data-to="nav_2"/>
    </g>
    
    <!-- 5. Labels and annotations -->
    <g id="labels">
      <!-- Room numbers, signs, etc. -->
    </g>
    
  </g>
</svg>
```

---

## 2. Layer Organization

### Layer 1: Walls (Visual Only)
```xml
<g id="walls" opacity="0.8">
  <path d="M100,100 L1800,100 L1800,900 L100,900 Z" 
        fill="none" 
        stroke="#333" 
        stroke-width="8"/>
</g>
```

### Layer 2: Walkable Areas (Visual Reference)
```xml
<g id="walkable" opacity="0.3">
  <path id="hallway_main" 
        d="M200,500 L1700,500" 
        stroke="#90EE90" 
        stroke-width="80" 
        fill="none"/>
</g>
```

### Layer 3: Rooms (Interactive)
```xml
<g id="rooms">
  <g id="room_BK36" data-name="Lecture Hall BK36">
    <!-- Room label text -->
    <text x="1380" y="340" 
          font-size="24" 
          fill="#000">BK 36</text>
    
    <!-- Room boundary (clickable area) -->
    <path id="room_BK36_2" 
          d="M1443.13,275.952 L1306.78,302.08 L1349.24,429.455 L1479.88,388.63 Z" 
          fill="#E8F4F8" 
          stroke="#2196F3" 
          stroke-width="2"/>
  </g>
</g>
```

### Layer 4: Navigation Graph (Hidden)
This is the key layer for pathfinding!

```xml
<g id="nav" style="display:none">
  <title>Navigation Graph</title>
  
  <!-- Navigation nodes -->
  <circle class="nav-node" id="nav_1" cx="500" cy="300" r="5" 
          data-label="Hallway Junction 1"/>
  <circle class="nav-node" id="nav_2" cx="800" cy="300" r="5" 
          data-label="Hallway Junction 2"/>
  <circle class="nav-node" id="nav_room_BK36" 
          data-room="room_BK36" r="5"
          data-label="BK36 Entrance"/>
  
  <!-- Navigation edges (connections) -->
  <line class="nav-edge" data-from="nav_1" data-to="nav_2" 
        stroke="#FF0000" stroke-width="1" opacity="0.3"/>
  <line class="nav-edge" data-from="nav_2" data-to="nav_room_BK36" 
        stroke="#FF0000" stroke-width="1" opacity="0.3"/>
</g>
```

---

## 3. Creating Navigation Nodes

### Types of Navigation Nodes

#### A. Room Nodes (Entrance Points)
Place at room entrances/doorways:

```xml
<circle class="nav-node" 
        id="nav_room_BK36" 
        data-room="room_BK36"
        cx="1400" 
        cy="330" 
        r="5"
        data-label="BK36 Door"/>
```

**Attributes:**
- `class="nav-node"` - Required for detection
- `id` - Unique identifier (prefix with `nav_`)
- `data-room` - Links to room ID (optional, for auto-positioning)
- `cx`, `cy` - Coordinates (required for proper positioning)
- `r` - Radius (visual only, use 5)
- `data-label` - Human-readable description

#### B. Hallway Junction Nodes
Place at hallway intersections:

```xml
<circle class="nav-node" 
        id="nav_junction_1" 
        cx="900" 
        cy="500" 
        r="5"
        data-label="Main Hall Junction"/>
```

#### C. Corridor Waypoint Nodes
Place along long corridors for smooth paths:

```xml
<circle class="nav-node" 
        id="nav_corridor_1" 
        cx="1200" 
        cy="500" 
        r="5"
        data-label="Corridor Waypoint"/>
```

### Node Placement Strategy

```
1. Room Entrance Nodes:
   - Place at each doorway
   - Position just outside the room boundary
   - One node per entrance

2. Hallway Junction Nodes:
   - Place at every corridor intersection
   - Place at T-junctions
   - Place at corners (90° turns)

3. Corridor Waypoint Nodes:
   - Every 200-300 pixels along straight corridors
   - Before/after stairs or elevators
   - At significant landmarks

4. Spacing Guidelines:
   - Minimum distance: 100px between nodes
   - Maximum distance: 400px between nodes
   - Ideal distance: 200-250px
```

### Visual Guide for Node Placement

```
        nav_1 -------- nav_2 -------- nav_3
          |              |              |
          |              |              |
     [Room A]       [Room B]       [Room C]
     nav_room_A    nav_room_B    nav_room_C
          |              |              |
          |              |              |
        nav_4 -------- nav_5 -------- nav_6
                         |
                         |
                    [Room D]
                   nav_room_D
```

---

## 4. Creating Navigation Edges

### Manual Edge Creation (Recommended)

Explicitly define connections between nodes:

```xml
<g id="nav-edges" style="display:none">
  <!-- Hallway connections -->
  <line class="nav-edge" 
        data-from="nav_1" 
        data-to="nav_2"
        x1="500" y1="300" 
        x2="800" y2="300"/>
  
  <!-- Room to hallway connections -->
  <line class="nav-edge" 
        data-from="nav_room_BK36" 
        data-to="nav_junction_1"
        x1="1400" y1="330" 
        x2="1200" y2="500"/>
  
  <!-- Bidirectional connections (automatic) -->
  <line class="nav-edge" 
        data-from="nav_2" 
        data-to="nav_3"/>
</g>
```

**Attributes:**
- `class="nav-edge"` - Required for detection
- `data-from` - Start node ID
- `data-to` - End node ID
- `x1`, `y1`, `x2`, `y2` - Visual coordinates (optional)

### Edge Creation Rules

```
✅ DO Connect:
- Room entrance → Nearest hallway junction
- Hallway junction → Adjacent hallway junctions
- Corridor waypoints → Next waypoint in sequence
- Intersections → All connecting corridors

❌ DON'T Connect:
- Through walls
- Across rooms
- Diagonal shortcuts through non-walkable areas
- Nodes more than 500px apart (unless direct corridor)
```

---

## 5. Best Practices

### Naming Conventions

```xml
<!-- Rooms -->
<g id="room_BK36">           <!-- room_ prefix -->
<g id="room_DK2">
<g id="room_StudentHub">

<!-- Navigation nodes -->
<circle id="nav_room_BK36">  <!-- nav_room_ for room entrances -->
<circle id="nav_junction_1"> <!-- nav_junction_ for intersections -->
<circle id="nav_corridor_1"> <!-- nav_corridor_ for waypoints -->
<circle id="nav_stairs_1">   <!-- nav_stairs_ for stairs -->

<!-- Navigation edges -->
<line class="nav-edge">      <!-- Always use nav-edge class -->
```

### Room Structure Template

```xml
<g id="room_[ROOM_CODE]" data-name="[HUMAN_READABLE_NAME]">
  <!-- Optional: Title for tooltips -->
  <title>[FULL_ROOM_NAME]</title>
  
  <!-- Room label text -->
  <text x="[X]" y="[Y]" 
        font-family="Arial" 
        font-size="20" 
        fill="#333"
        text-anchor="middle">
    [ROOM_CODE]
  </text>
  
  <!-- Room boundary path -->
  <path id="room_[ROOM_CODE]_2" 
        d="[PATH_DATA]" 
        fill="#E8F4F8" 
        fill-opacity="0.7"
        stroke="#2196F3" 
        stroke-width="2"/>
</g>
```

### Color Coding Recommendations

```css
/* Rooms by type */
Lecture Halls:    fill="#E3F2FD" stroke="#2196F3"  /* Light Blue */
Labs:             fill="#E8F5E9" stroke="#4CAF50"  /* Light Green */
Offices:          fill="#FFF3E0" stroke="#FF9800"  /* Light Orange */
Common Areas:     fill="#F3E5F5" stroke="#9C27B0"  /* Light Purple */
Restrooms:        fill="#FAFAFA" stroke="#757575"  /* Light Gray */

/* Navigation (hidden but useful for debugging) */
Nav Nodes:        fill="#FF0000" stroke="#FF0000"  /* Red */
Nav Edges:        stroke="#FF0000" opacity="0.3"   /* Semi-transparent Red */
```

---

## 6. Tools & Workflow

### Recommended Tools

#### A. **Inkscape** (Free, Best for Floor Plans)
- Download: https://inkscape.org/
- Best for: Creating and editing SVG floor plans
- Supports layers, precise measurements

**Workflow:**
1. Import floor plan image (PNG/JPG)
2. Trace walls and rooms with Pen tool
3. Create layers for rooms, nav nodes, nav edges
4. Export as Plain SVG

#### B. **Adobe Illustrator** (Paid)
- Professional vector editing
- Precise alignment tools
- Layer management

#### C. **Figma** (Free/Paid, Web-based)
- Collaborative editing
- Export to SVG
- Good for team projects

#### D. **draw.io** (Free, Simple)
- Quick floor plan sketches
- Basic SVG export
- Good for prototyping

### Step-by-Step Workflow

#### Step 1: Prepare Floor Plan
```
1. Get building floor plan (PDF, image, or CAD file)
2. Import into SVG editor
3. Set canvas size (e.g., 1920x1080)
4. Set viewBox to match canvas
```

#### Step 2: Trace Structure
```
1. Create "walls" layer
2. Trace building outline
3. Trace interior walls
4. Mark doorways
```

#### Step 3: Define Rooms
```
1. Create "rooms" layer
2. Draw room boundaries as closed paths
3. Add room IDs: room_[CODE]
4. Add room labels (text elements)
5. Add data-name attributes
```

#### Step 4: Create Navigation Graph
```
1. Create "nav" layer (set display:none)
2. Place nav nodes at:
   - Each room entrance
   - Hallway intersections
   - Corridor waypoints
3. Set cx, cy coordinates precisely
4. Add descriptive IDs and labels
```

#### Step 5: Connect Navigation Edges
```
1. Create "nav-edges" group in nav layer
2. Draw lines between connected nodes
3. Add data-from and data-to attributes
4. Ensure bidirectional connections
```

#### Step 6: Test & Refine
```
1. Save SVG
2. Load in your app
3. Test pathfinding between rooms
4. Add missing nodes/edges
5. Adjust node positions for smoother paths
```

---

## 7. Testing & Validation

### Validation Checklist

```
✅ SVG Structure:
[ ] Valid SVG syntax
[ ] Proper viewBox defined
[ ] All groups have IDs
[ ] No duplicate IDs

✅ Rooms:
[ ] All rooms have id="room_[CODE]"
[ ] All rooms have data-name attributes
[ ] Room boundaries are closed paths
[ ] Room labels are readable

✅ Navigation Nodes:
[ ] All nodes have class="nav-node"
[ ] All nodes have unique IDs
[ ] All nodes have cx, cy coordinates
[ ] Room entrance nodes have data-room attribute

✅ Navigation Edges:
[ ] All edges have class="nav-edge"
[ ] All edges have data-from and data-to
[ ] Referenced node IDs exist
[ ] No edges through walls

✅ Connectivity:
[ ] All rooms have at least one nav node
[ ] All nav nodes are connected to graph
[ ] No isolated node clusters
[ ] Path exists between all room pairs
```

### Testing in Browser Console

After loading your SVG, run these tests:

```javascript
// 1. Check room count
const rooms = document.querySelectorAll('g[id^="room_"]');
console.log('Rooms found:', rooms.length);

// 2. Check nav nodes
const navNodes = document.querySelectorAll('.nav-node');
console.log('Nav nodes found:', navNodes.length);
navNodes.forEach(n => {
  console.log(n.id, 'cx:', n.getAttribute('cx'), 'cy:', n.getAttribute('cy'));
});

// 3. Check nav edges
const navEdges = document.querySelectorAll('.nav-edge');
console.log('Nav edges found:', navEdges.length);
navEdges.forEach(e => {
  console.log('Edge:', e.dataset.from, '->', e.dataset.to);
});

// 4. Test graph connectivity
// (Your app will show this in console when you test pathfinding)
```

### Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Nodes at (0,0) | Paths go to corner | Add cx, cy attributes |
| No path found | nodePath: null | Add more edges, reduce distances |
| Straight line fallback | Path cuts through walls | Add waypoint nodes in hallways |
| Room not found | Can't select room | Check room ID format (room_XXX) |
| Duplicate IDs | Unexpected behavior | Make all IDs unique |

---

## 8. Example: Complete Room with Navigation

Here's a complete example of a room with proper navigation setup:

```xml
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  
  <!-- Background -->
  <rect width="1920" height="1080" fill="#F5F5F5"/>
  
  <g id="Floor_G">
    
    <!-- Walls -->
    <g id="walls">
      <path d="M100,100 L1800,100 L1800,900 L100,900 Z" 
            fill="none" stroke="#333" stroke-width="8"/>
      <path d="M100,500 L1800,500" 
            fill="none" stroke="#333" stroke-width="8"/>
    </g>
    
    <!-- Rooms -->
    <g id="rooms">
      
      <!-- Room BK36 -->
      <g id="room_BK36" data-name="Lecture Hall BK36">
        <title>Lecture Hall BK36 - Capacity 50</title>
        <text x="500" y="290" font-size="24" fill="#333" text-anchor="middle">
          BK 36
        </text>
        <path id="room_BK36_2" 
              d="M300,200 L700,200 L700,350 L300,350 Z" 
              fill="#E3F2FD" 
              stroke="#2196F3" 
              stroke-width="2"/>
      </g>
      
      <!-- Room BK37 -->
      <g id="room_BK37" data-name="Lecture Hall BK37">
        <title>Lecture Hall BK37 - Capacity 50</title>
        <text x="1200" y="290" font-size="24" fill="#333" text-anchor="middle">
          BK 37
        </text>
        <path id="room_BK37_2" 
              d="M1000,200 L1400,200 L1400,350 L1000,350 Z" 
              fill="#E3F2FD" 
              stroke="#2196F3" 
              stroke-width="2"/>
      </g>
      
      <!-- Room DK2 -->
      <g id="room_DK2" data-name="Computer Lab DK2">
        <title>Computer Lab DK2 - 30 Workstations</title>
        <text x="500" y="690" font-size="24" fill="#333" text-anchor="middle">
          DK 2
        </text>
        <path id="room_DK2_2" 
              d="M300,600 L700,600 L700,750 L300,750 Z" 
              fill="#E8F5E9" 
              stroke="#4CAF50" 
              stroke-width="2"/>
      </g>
      
    </g>
    
    <!-- Navigation Graph -->
    <g id="nav" style="display:none">
      
      <!-- Room entrance nodes -->
      <circle class="nav-node" id="nav_room_BK36" 
              cx="500" cy="350" r="5" 
              data-room="room_BK36"
              data-label="BK36 Door"/>
      
      <circle class="nav-node" id="nav_room_BK37" 
              cx="1200" cy="350" r="5" 
              data-room="room_BK37"
              data-label="BK37 Door"/>
      
      <circle class="nav-node" id="nav_room_DK2" 
              cx="500" cy="600" r="5" 
              data-room="room_DK2"
              data-label="DK2 Door"/>
      
      <!-- Hallway junction nodes -->
      <circle class="nav-node" id="nav_junction_1" 
              cx="500" cy="475" r="5" 
              data-label="Central Junction"/>
      
      <circle class="nav-node" id="nav_junction_2" 
              cx="850" cy="475" r="5" 
              data-label="East Junction"/>
      
      <circle class="nav-node" id="nav_junction_3" 
              cx="1200" cy="475" r="5" 
              data-label="Far East Junction"/>
      
      <!-- Navigation edges -->
      <g id="nav-edges">
        <!-- BK36 to hallway -->
        <line class="nav-edge" 
              data-from="nav_room_BK36" 
              data-to="nav_junction_1"/>
        
        <!-- BK37 to hallway -->
        <line class="nav-edge" 
              data-from="nav_room_BK37" 
              data-to="nav_junction_3"/>
        
        <!-- DK2 to hallway -->
        <line class="nav-edge" 
              data-from="nav_room_DK2" 
              data-to="nav_junction_1"/>
        
        <!-- Hallway connections -->
        <line class="nav-edge" 
              data-from="nav_junction_1" 
              data-to="nav_junction_2"/>
        
        <line class="nav-edge" 
              data-from="nav_junction_2" 
              data-to="nav_junction_3"/>
      </g>
      
    </g>
    
  </g>
</svg>
```

This creates a simple floor plan with 3 rooms connected by a hallway, with proper navigation nodes and edges for pathfinding.

---

## 9. Quick Start Template

Use this template to start your floor plan:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  
  <!-- Background -->
  <rect width="1920" height="1080" fill="#F5F5F5"/>
  
  <g id="Floor_G">
    
    <!-- Layer 1: Walls -->
    <g id="walls">
      <!-- Add your wall paths here -->
    </g>
    
    <!-- Layer 2: Walkable areas (optional, for visual reference) -->
    <g id="walkable" opacity="0.2">
      <!-- Add hallway paths here -->
    </g>
    
    <!-- Layer 3: Rooms -->
    <g id="rooms">
      <!-- Add your rooms here using the template:
      
      <g id="room_XXX" data-name="Room Name">
        <title>Full Room Description</title>
        <text x="X" y="Y" font-size="20" fill="#333">XXX</text>
        <path d="..." fill="#E3F2FD" stroke="#2196F3" stroke-width="2"/>
      </g>
      
      -->
    </g>
    
    <!-- Layer 4: Navigation Graph (HIDDEN) -->
    <g id="nav" style="display:none">
      <title>Navigation Graph</title>
      
      <!-- Add navigation nodes here:
      
      <circle class="nav-node" id="nav_XXX" cx="X" cy="Y" r="5"/>
      
      -->
      
      <!-- Add navigation edges here:
      
      <g id="nav-edges">
        <line class="nav-edge" data-from="nav_1" data-to="nav_2"/>
      </g>
      
      -->
      
    </g>
    
    <!-- Layer 5: Labels -->
    <g id="labels">
      <!-- Add additional labels, signs, etc. -->
    </g>
    
  </g>
</svg>
```

---

## 10. Next Steps

1. **Choose your tool** (Inkscape recommended for beginners)
2. **Import your floor plan** image
3. **Trace rooms** and create room groups
4. **Place navigation nodes** at strategic points
5. **Connect nodes** with edges
6. **Test in your app** and refine
7. **Iterate** until pathfinding works smoothly

---

## 📚 Additional Resources

- **SVG Specification**: https://www.w3.org/TR/SVG2/
- **Inkscape Tutorials**: https://inkscape.org/learn/tutorials/
- **SVG Path Reference**: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
- **A* Algorithm**: https://en.wikipedia.org/wiki/A*_search_algorithm

---

## 💡 Pro Tips

1. **Start simple**: Begin with 5-10 rooms, test, then expand
2. **Use a grid**: Align nodes to a 50px or 100px grid for consistency
3. **Label everything**: Use data-label attributes for debugging
4. **Test incrementally**: Add a few rooms, test, add more
5. **Keep it organized**: Use layers and groups religiously
6. **Version control**: Save versions as you progress (v1, v2, etc.)
7. **Document**: Add comments in SVG for complex areas

---

Good luck creating your complete indoor map! 🗺️✨

