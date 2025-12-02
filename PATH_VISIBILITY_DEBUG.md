# Path Visibility Debugging

## Issue
Console shows successful pathfinding but the red path line is not visible on the map.

## Latest Changes (Just Applied)

### 1. Enhanced Path Styling
- **Increased stroke width**: 4 → 8 pixels (more visible)
- **Changed color**: "red" → "#FF0000" (explicit hex)
- **Increased dash pattern**: "6,4" → "10,5" (more prominent)
- **Added opacity**: 0.9 (slightly transparent)
- **Added CSS rules**: Force path-line styling with !important

### 2. Added Comprehensive Debugging
The console will now show:
- Polyline creation details
- Point coordinates and count
- Bounding box of the created path
- Number of path elements in SVG

### 3. CSS Enhancements
Added explicit `.path-line` class styling to ensure visibility.

## Testing Steps

1. **Clear Browser Cache**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open DevTools → Network tab → Check "Disable cache"

2. **Open Console** (F12 → Console)

3. **Enter Rooms**
   - Destination: `BK36`
   - Current Location: `BK37`
   - Click "Start Navigation"

4. **Check Console Output**

You should see:
```javascript
Creating polyline with points: 1396.305,332.2035 1396.305,332.2035 1454.385,475.909 1454.385,475.909
Polyline attributes: {
  stroke: "#FF0000",
  strokeWidth: "8",
  points: "1396.305,332.2035 ...",
  pointCount: 4
}
Path elements in SVG: 1
Polyline bounding box: {x: 1396.305, y: 332.2035, width: 58.08, height: 143.7065}
```

## What to Check

### ✅ If Path is Still Not Visible

1. **Check if polyline was created:**
   ```javascript
   // In browser console, type:
   document.querySelectorAll('.path-line')
   ```
   - Should return 1 element
   - Inspect the element to see its attributes

2. **Check polyline position:**
   ```javascript
   // In browser console:
   const path = document.querySelector('.path-line');
   console.log(path.getBBox());
   ```
   - Coordinates should be within viewBox (0-1920, 0-1080)
   - Width and height should be > 0

3. **Check if path is behind other elements:**
   - Right-click on the map → Inspect
   - Look for `<polyline class="path-line">` in the DOM
   - Check if it's the last child of `<svg>` (should be on top)

4. **Check SVG overflow:**
   - The path might be outside the visible area
   - Try zooming out or scrolling the map

5. **Check computed styles:**
   ```javascript
   // In browser console:
   const path = document.querySelector('.path-line');
   console.log(window.getComputedStyle(path));
   ```
   - Verify stroke, stroke-width, opacity are correct

## Manual Inspection

### In Browser DevTools:

1. **Elements Tab**
   - Find the `<svg>` element
   - Look for `<polyline class="path-line" ...>` at the bottom
   - Should have attributes:
     - `points="x1,y1 x2,y2 ..."`
     - `stroke="#FF0000"`
     - `stroke-width="8"`

2. **Computed Tab** (while polyline is selected)
   - Check `stroke`: should be `rgb(255, 0, 0)`
   - Check `stroke-width`: should be `8px`
   - Check `opacity`: should be `0.9`
   - Check `display`: should be `inline` or `block` (not `none`)

## Common Issues & Solutions

### Issue 1: Path is created but immediately removed
**Check:** Console shows "Removing existing path line" right after creation
**Solution:** ✅ Already handled - clearHighlights only called on reset

### Issue 2: Path coordinates are outside viewBox
**Check:** Bounding box x/y values > 1920 or > 1080
**Solution:** Verify room coordinates are correct

### Issue 3: Path is hidden by CSS
**Check:** Computed style shows `display: none` or `visibility: hidden`
**Solution:** ✅ Fixed with !important rules in CSS

### Issue 4: SVG rendering issue
**Check:** Other SVG elements (rooms) are visible but path is not
**Try:** 
- Use a solid line instead of dashed
- Increase stroke-width to 20
- Change stroke to a bright color like `#00FF00` (green)

## Quick Test: Force Visible Path

If path still doesn't show, try this in the browser console:

```javascript
// After clicking "Start Navigation", run:
const svg = document.querySelector('.svg-wrapper svg');
const testLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
testLine.setAttribute('x1', '100');
testLine.setAttribute('y1', '100');
testLine.setAttribute('x2', '500');
testLine.setAttribute('y2', '500');
testLine.setAttribute('stroke', '#00FF00');
testLine.setAttribute('stroke-width', '20');
svg.appendChild(testLine);
```

If you see a bright green line, then SVG rendering works and the issue is with path coordinates or timing.

## Expected Console Output (Full)

```
Nav node nav_room_BK36 -> room room_BK36 at (1396.305, 332.2035)
Nav node nav_room_BK37 -> room room_BK37 at (1454.385, 475.909)
... (more nav nodes)
Graph has 13 nodes, 0 total edges, avg degree: 0.00
Average degree < 1, auto-connecting nearby nodes...
After auto-connect: 78 total edges
Graph built successfully with 13 nodes

drawPath start: room_BK36 room_BK37
graph nodes: 13
Node details: [
  {id: 'nav_room_BK36', x: 1396.305, y: 332.2035, edges: 3},
  {id: 'nav_room_BK37', x: 1454.385, y: 475.909, edges: 3},
  ...
]
Start point: 1396.305 332.2035 -> nearest node: nav_room_BK36
End point: 1454.385 475.909 -> nearest node: nav_room_BK37
nodePath: ['nav_room_BK36', 'nav_room_BK37']

Creating polyline with points: 1396.305,332.2035 1396.305,332.2035 1454.385,475.909 1454.385,475.909
Polyline attributes: {stroke: '#FF0000', strokeWidth: '8', points: '...', pointCount: 4}
Path elements in SVG: 1
Polyline bounding box: {x: 1396.305, y: 332.2035, width: 58.08, height: 143.7065}
```

## Next Steps

Please share:
1. **Screenshot** of the map (showing if path is visible or not)
2. **Console output** (especially the polyline creation logs)
3. **DOM inspection** (screenshot of the `<polyline>` element in DevTools)

This will help identify exactly where the issue is!

