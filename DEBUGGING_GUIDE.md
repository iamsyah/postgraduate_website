# Indoor Directory Debugging Guide

## Issue
When entering destination and current location, the route is not showing on the map.

**UPDATE:** Console shows successful pathfinding, but the red path line is not visible. This indicates the path is being calculated correctly but there's a rendering/visibility issue.

## Changes Made

### 1. Enhanced Graph Building (`src/utils/graph.js`)
- **Added visibility handling**: Nav nodes reference rooms via `data-room` attribute, but the nav group has `display:none`. Added code to temporarily make rooms visible when getting bounding boxes.
- **Added comprehensive logging**: Debug messages now show:
  - Which nav nodes are being processed
  - Room coordinates being extracted
  - Edge count before and after auto-connect
  - Warnings for missing rooms or zero coordinates

### 2. Enhanced Path Drawing (`src/pages/IndoorDirectory.jsx`)
- **Added detailed debugging**: Now logs:
  - Node details (ID, coordinates, edge count)
  - Start/end points and their nearest nodes
  - Path calculation results

## Testing Instructions

### 1. Open Browser Console
1. Navigate to `http://localhost:5173/indoordirectory`
2. Open Developer Tools (F12)
3. Go to Console tab

### 2. Test Room Selection
Try these room pairs (all should have nav nodes):

**Test Case 1: Adjacent Rooms**
- Destination: `BK36` or `room_BK36`
- Current Location: `BK37` or `room_BK37`

**Test Case 2: Distant Rooms**
- Destination: `DK2` or `room_DK2`
- Current Location: `BK33` or `room_BK33`

**Test Case 3: Simulation Rooms**
- Destination: `Simulation2` or `room_Simulation2`
- Current Location: `Simulation3` or `room_Simulation3`

**Test Case 4: Special Rooms**
- Destination: `StudentHub` or `room_StudentHub`
- Current Location: `SOC` or `room_SOC`

### 3. Check Console Output

You should see messages like:
```
Nav node nav_room_BK36 -> room room_BK36 at (1396.305, 332.2035)
Graph has 13 nodes, 0 total edges, avg degree: 0.00
Average degree < 1, auto-connecting nearby nodes...
After auto-connect: 78 total edges
Graph built successfully with 13 nodes
Node details: [{id: 'nav_room_BK36', x: 1396.305, y: 332.2035, edges: 3}, ...]
Start point: 1396.305 332.2035 -> nearest node: nav_room_BK36
End point: 1454.385 475.909 -> nearest node: nav_room_BK37
nodePath: ['nav_room_BK36', 'nav_room_BK37']
```

### 4. Expected Behavior

✅ **Success Indicators:**
- Green highlight appears on current location
- Blue highlight appears on destination
- Red dashed line connects the two rooms
- Console shows successful path calculation

❌ **Failure Indicators:**
- No path line appears
- Console shows "Could not compute path"
- Coordinates are (0, 0)
- No edges in graph

## Available Rooms

The SVG contains these rooms (13 total):
1. `room_BK36` - Has nav node
2. `room_BK37` - Has nav node
3. `room_DK2` - Has nav node
4. `room_DK3` - Has nav node
5. `room_Simulation2` - Has nav node
6. `room_Simulation3` - Has nav node
7. `room_StudentHub` - Has nav node
8. `room_BK33` - Has nav node
9. `room_BK34` - Has nav node
10. `room_BK35` - Has nav node
11. `room_SOC` - Has nav node
12. `room_SmartClassroom` - Has nav node
13. `room_OmarKhayyam` - Has nav node

**Note:** There are also additional rooms without nav nodes (like `room_Hallway1`, `room_Hallway2`, etc.) but they may not work for pathfinding.

## Common Issues & Solutions

### Issue 1: Coordinates are (0, 0)
**Cause:** `getBBox()` fails when element is hidden
**Solution:** ✅ Fixed - Code now temporarily makes elements visible

### Issue 2: No edges in graph
**Cause:** No explicit nav-edge elements in SVG
**Solution:** ✅ Fixed - Auto-connect creates edges between nearby nodes (K=3 nearest neighbors)

### Issue 3: Path not found
**Cause:** Nodes are disconnected or too far apart
**Solution:** Auto-connect uses max distance = 1/4 of bounding box diagonal

### Issue 4: Straight line instead of proper path
**Cause:** Pathfinding failed, fallback to direct line
**Check:** Console should show why (no nodes, no path, etc.)

## Troubleshooting Steps

If the route still doesn't show:

1. **Check if rooms are being highlighted**
   - If YES: Problem is in pathfinding
   - If NO: Problem is in room selection/matching

2. **Check console for "graph nodes: X"**
   - Should show 13 nodes
   - If 0: SVG not loaded or nav nodes not found

3. **Check "Node details" output**
   - All nodes should have non-zero x, y coordinates
   - Each node should have 2-3 edges (after auto-connect)

4. **Check "nearest nodes" output**
   - Should match nav node IDs
   - If null: Coordinates might be wrong

5. **Check "nodePath" output**
   - Should be an array of node IDs
   - If null: No path exists between nodes

## Manual Testing Checklist

- [ ] Dev server is running (`yarn dev`)
- [ ] Navigate to `/indoordirectory`
- [ ] Console is open
- [ ] Enter destination (e.g., "BK36")
- [ ] Destination highlights in blue
- [ ] Enter current location (e.g., "BK37")
- [ ] Current location highlights in green
- [ ] Click "Start Navigation"
- [ ] Red dashed path appears
- [ ] Console shows successful path calculation
- [ ] Click "Reset" clears everything

## Next Steps

If issues persist after these changes:

1. **Check SVG structure**: Verify all rooms have proper `<g id="room_X">` wrappers
2. **Add explicit edges**: Create `<line class="nav-edge" data-from="nav1" data-to="nav2"/>` elements
3. **Adjust auto-connect parameters**: Increase K (neighbors) or maxDist
4. **Add manual node positions**: Set `cx` and `cy` attributes on nav nodes

