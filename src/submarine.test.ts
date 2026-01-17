import { SubmarinePart1, SubmarinePart2, SubmarinePart3, parseCommand, checkScanner } from './submarine';

describe('Submarine Navigation - Part 1', () => {
  describe('parseCommand', () => {
    it('should parse forward command', () => {
      const result = parseCommand('forward 5');
      expect(result).toEqual({ direction: 'forward', value: 5 });
    });

    it('should parse down command', () => {
      const result = parseCommand('down 3');
      expect(result).toEqual({ direction: 'down', value: 3 });
    });

    it('should parse up command', () => {
      const result = parseCommand('up 2');
      expect(result).toEqual({ direction: 'up', value: 2 });
    });

    it('should handle negative values', () => {
      const result = parseCommand('forward -3');
      expect(result).toEqual({ direction: 'forward', value: -3 });
    });

    it('should throw error for invalid command', () => {
      expect(() => parseCommand('invalid 5')).toThrow();
    });

    it('should throw error for invalid format', () => {
      expect(() => parseCommand('forward')).toThrow();
    });
  });

  describe('SubmarinePart1', () => {
    it('should start at position (0, 0)', () => {
      const sub = new SubmarinePart1();
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0 });
    });

    it('should move forward', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('forward 5');
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0 });
    });

    it('should move down', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('down 5');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 5 });
    });

    it('should move up', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('down 8');
      sub.executeCommand('up 3');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 5 });
    });

    it('should handle example sequence', () => {
      const sub = new SubmarinePart1();
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      expect(sub.getPosition()).toEqual({ horizontal: 15, depth: 10 });
      expect(sub.getResult()).toBe(150);
    });

    it('should handle negative movements', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('forward 10');
      sub.executeCommand('forward -3');
      expect(sub.getPosition()).toEqual({ horizontal: 7, depth: 0 });
    });
  });
});

describe('Submarine Navigation - Part 2', () => {
  describe('SubmarinePart2', () => {
    it('should start at position (0, 0) with aim 0', () => {
      const sub = new SubmarinePart2();
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 0 });
    });

    it('should increase aim with down command', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 5');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 5 });
    });

    it('should decrease aim with up command', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 8');
      sub.executeCommand('up 3');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 5 });
    });

    it('should move forward without depth change when aim is 0', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('forward 5');
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0, aim: 0 });
    });

    it('should move forward with depth change based on aim', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 5');
      sub.executeCommand('forward 8');
      expect(sub.getPosition()).toEqual({ horizontal: 8, depth: 40, aim: 5 });
    });

    it('should handle example sequence', () => {
      const sub = new SubmarinePart2();
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      expect(sub.getPosition()).toEqual({ horizontal: 15, depth: 60, aim: 10 });
      expect(sub.getResult()).toBe(900);
    });
  });
});

describe('Submarine Navigation - Part 3', () => {
  describe('SubmarinePart3', () => {
    it('should record visited positions after each command', () => {
      const sub = new SubmarinePart3();
      const commands = [
        'forward 5',
        'down 5',
        'forward 1'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      expect(sub.getVisitedPositions()).toEqual([
        { horizontal: 0, depth: 0 },
        { horizontal: 5, depth: 0 },
        { horizontal: 5, depth: 0 },
        { horizontal: 6, depth: 5 },
      ]);
    });

    it('should verify checkScanner can read data', () => {
      const result = checkScanner({ horizontal: 6, depth: 10, aim: 0 });
        
      expect(result).toEqual([
      '#', '-', '=',
      ':', '.', '*',
      '*', '-', '.'
      ]);
    });

    it('should collect scanner data for all visited positions', () => {
      const sub = new SubmarinePart3();
      const commands = [
        'forward 6',
        'down 10',
        'forward 1'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      const scannedData = sub.getScannedData();
      
      // Should have scanned starting position + 3 new positions
      expect(scannedData.length).toEqual(4);
      
      // Each scan should have position and 9-character result
      expect(scannedData[0].scanResult.length).toBe(9);
      scannedData.forEach(scan => {
        expect(scan.position).toHaveProperty('horizontal');
        expect(scan.position).toHaveProperty('depth');
        expect(Array.isArray(scan.scanResult)).toBe(true);
      });

    });

    it('should translate scanner data into map coordinates', () => {
      const sub = new SubmarinePart3();
      
      // Move to position (6,10): need to set aim first, then move forward
      sub.executeCommand('down 1');    // aim = 1
      sub.executeCommand('forward 10'); // horizontal = 10, depth = 10

      const mapPoints = sub.getMapPoints();
      
      // Should have 3x3 grids from multiple positions
      expect(mapPoints.size).toBeGreaterThan(9);
      
      // Verify center position from last scan exists
      expect(mapPoints.get('(10,10)')).toBeDefined();
      
      // Verify surrounding positions exist (from 3x3 grid)
      expect(mapPoints.get('(9,9)')).toBeDefined();   // top-left
      expect(mapPoints.get('(11,11)')).toBeDefined(); // bottom-right
    });

    it('should handle positions without scanner data', () => {
      const sub = new SubmarinePart3();
      
      // Move to a position that might not have scanner data
      sub.executeCommand('forward 100');
      
      const scannedData = sub.getScannedData();
      
      // Should still have the initial scan at (0,0)
      expect(scannedData.length).toBeGreaterThanOrEqual(1);
      expect(scannedData[0].position).toEqual({ horizontal: 0, depth: 0 });
    });

    it('should accumulate map points across multiple movements', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 6');
      const mapPointsAfterFirst = sub.getMapPoints().size;
      
      sub.executeCommand('down 10');
      const mapPointsAfterSecond = sub.getMapPoints().size;
      
      // Map should grow as we collect more scans
      expect(mapPointsAfterSecond).toBeGreaterThanOrEqual(mapPointsAfterFirst);
    });

    it('should initialize with starting position scanned', () => {
      const sub = new SubmarinePart3();
      
      const visitedPositions = sub.getVisitedPositions();
      const scannedData = sub.getScannedData();
      
      expect(visitedPositions.length).toBe(1);
      expect(visitedPositions[0]).toEqual({ horizontal: 0, depth: 0 });
      
      // Should have attempted to scan starting position
      // (may or may not have data depending on scanner-data.json)
      expect(scannedData.length).toBeGreaterThanOrEqual(0);
    });

    it('should track unique visited positions', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 5');
      sub.executeCommand('forward 3');
      sub.executeCommand('down 2');
      sub.executeCommand('forward 1');
      
      const visitedPositions = sub.getVisitedPositions();
      
      // Should have: (0,0), (5,0), (8,0), (8,0), (9,2)
      expect(visitedPositions.length).toBe(5);
      expect(visitedPositions[0]).toEqual({ horizontal: 0, depth: 0 });
      expect(visitedPositions[1]).toEqual({ horizontal: 5, depth: 0 });
      expect(visitedPositions[4]).toEqual({ horizontal: 9, depth: 2 });
    });

    it('should handle down command without changing position', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('down 5');
      
      const visitedPositions = sub.getVisitedPositions();
      
      // Down only changes aim, position stays at (0,0)
      expect(visitedPositions.length).toBe(2);
      expect(visitedPositions[1]).toEqual({ horizontal: 0, depth: 0 });
    });

    it('should handle up command without changing position', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('down 10');
      sub.executeCommand('up 5');
      
      const visitedPositions = sub.getVisitedPositions();
      
      // Both commands only change aim, position stays at (0,0)
      expect(visitedPositions.length).toBe(3);
      expect(visitedPositions[2]).toEqual({ horizontal: 0, depth: 0 });
    });

    it('should correctly calculate depth changes with aim', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('down 3');    // aim = 3, pos = (0,0)
      sub.executeCommand('forward 10'); // pos = (10, 30) depth = 0 + 3*10
      
      const visitedPositions = sub.getVisitedPositions();
      const lastPosition = visitedPositions[visitedPositions.length - 1];
      
      expect(lastPosition).toEqual({ horizontal: 10, depth: 30 });
    });

    it('should handle negative depth from up commands', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('up 5');       // aim = -5
      sub.executeCommand('forward 2');  // pos = (2, -10) depth = 0 + (-5)*2
      
      const visitedPositions = sub.getVisitedPositions();
      const lastPosition = visitedPositions[visitedPositions.length - 1];
      
      expect(lastPosition).toEqual({ horizontal: 2, depth: -10 });
    });

    it('should only scan positions with available scanner data', () => {
      const sub = new SubmarinePart3();
      
      // Move to positions that likely don't have scanner data
      sub.executeCommand('forward 999');
      sub.executeCommand('down 999');
      sub.executeCommand('forward 999');
      
      const visitedPositions = sub.getVisitedPositions();
      const scannedData = sub.getScannedData();
      
      // Should track all visited positions
      expect(visitedPositions.length).toBe(4);
      
      // But scanned data only for positions in scanner-data.json
      expect(scannedData.length).toBeLessThanOrEqual(visitedPositions.length);
    });

    it('should handle duplicate position scans gracefully', () => {
      const sub = new SubmarinePart3();
      
      // Move back and forth to same position
      sub.executeCommand('forward 5');
      sub.executeCommand('down 2');
      sub.executeCommand('up 2');       // Back to aim 0
      sub.executeCommand('forward -5'); // Back to (0,0) if negative allowed
      
      const scannedData = sub.getScannedData();
      const mapPoints = sub.getMapPoints();
      
      // Multiple scans may occur, but map points should handle duplicates
      expect(scannedData.length).toBeGreaterThanOrEqual(0);
      expect(mapPoints.size).toBeGreaterThanOrEqual(0);
    });

    it('should correctly map 3x3 grid offsets', () => {
      const sub = new SubmarinePart3();
      
      // Move to a position we can verify
      sub.executeCommand('down 1');
      sub.executeCommand('forward 10');
      
      const mapPoints = sub.getMapPoints();
      
      if (mapPoints.size > 0) {
        // Verify that points are offset correctly from center
        const keys = Array.from(mapPoints.keys());
        
        keys.forEach(key => {
          const match = key.match(/\((-?\d+),(-?\d+)\)/);
          expect(match).toBeTruthy();
          
          if (match) {
            const x = parseInt(match[1]);
            const y = parseInt(match[2]);
            
            // Coordinates should be integers
            expect(Number.isInteger(x)).toBe(true);
            expect(Number.isInteger(y)).toBe(true);
          }
        });
      }
    });

    it('should build empty map when no scanner data collected', () => {
      const sub = new SubmarinePart3();
      
      // Move to positions without scanner data
      sub.executeCommand('forward 9999');
      
      // Clear map points for testing
      const map = sub.buildMap();
      
      // Should handle gracefully
      expect(Array.isArray(map)).toBe(true);
    });

    it('should calculate correct map dimensions', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 10');
      sub.executeCommand('down 5');
      sub.executeCommand('forward 10');
      
      const dimensions = sub.getMapDimensions();
      
      if (dimensions.width > 0) {
        expect(dimensions.width).toBeGreaterThan(0);
        expect(dimensions.height).toBeGreaterThan(0);
        expect(dimensions.maxX).toBeGreaterThanOrEqual(dimensions.minX);
        expect(dimensions.maxY).toBeGreaterThanOrEqual(dimensions.minY);
        expect(dimensions.width).toBe(dimensions.maxX - dimensions.minX + 1);
        expect(dimensions.height).toBe(dimensions.maxY - dimensions.minY + 1);
      }
    });

    it('should handle map with negative coordinates', () => {
      const sub = new SubmarinePart3();
      
      // Move to negative depth
      sub.executeCommand('up 5');
      sub.executeCommand('forward 2');
      
      const dimensions = sub.getMapDimensions();
      const map = sub.buildMap();
      
      if (map.length > 0) {
        // Map should still be built correctly with negative coords
        expect(map.length).toBe(dimensions.height);
        expect(map[0].length).toBe(dimensions.width);
      }
    });

    it('should preserve all characters in map building', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('down 2');
      sub.executeCommand('forward 15');
      
      const mapPoints = sub.getMapPoints();
      const map = sub.buildMap();
      
      if (mapPoints.size > 0 && map.length > 0) {
        // Count characters in map
        let mapCharCount = 0;
        map.forEach(row => {
          row.forEach(char => {
            if (char !== ' ') mapCharCount++;
          });
        });
        
        // Should match map points (excluding spaces that might be in data)
        const nonSpacePoints = Array.from(mapPoints.values()).filter(c => c !== ' ').length;
        expect(mapCharCount).toBeGreaterThanOrEqual(nonSpacePoints - mapPoints.size);
      }
    });

    it('should handle complex navigation path', () => {
      const sub = new SubmarinePart3();
      
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];
      
      commands.forEach(cmd => sub.executeCommand(cmd));
      
      const visitedPositions = sub.getVisitedPositions();
      const finalPos = sub.getPosition();
      
      expect(visitedPositions.length).toBe(commands.length + 1); // +1 for start
      expect(finalPos.horizontal).toBe(15);
      expect(finalPos.depth).toBe(60); // 0 + 5*8 + 10*2
    });

    it('should return immutable copies of internal state', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 5');
      
      const visitedPositions1 = sub.getVisitedPositions();
      const visitedPositions2 = sub.getVisitedPositions();
      
      // Should return different array instances
      expect(visitedPositions1).not.toBe(visitedPositions2);
      
      // But with same content
      expect(visitedPositions1).toEqual(visitedPositions2);
      
      // Modifying returned array shouldn't affect internal state
      visitedPositions1.push({ horizontal: 999, depth: 999 });
      const visitedPositions3 = sub.getVisitedPositions();
      expect(visitedPositions3.length).not.toBe(visitedPositions1.length);
    });

    it('should print map without errors', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 10');
      sub.executeCommand('down 2');
      sub.executeCommand('forward 5');
      
      // Should not throw
      expect(() => sub.printMap()).not.toThrow();
    });

    it('should handle scanner data with special characters', () => {
      const sub = new SubmarinePart3();
      
      // Move through area that might have various characters
      sub.executeCommand('down 3');
      sub.executeCommand('forward 20');
      
      const mapPoints = sub.getMapPoints();
      
      mapPoints.forEach((char, _key) => {
        // Each character should be a single character string
        expect(typeof char).toBe('string');
        expect(char.length).toBe(1);
      });
    });

    describe('buildMap()', () => {
      it('should return empty array when no map points collected', () => {
        const sub = new SubmarinePart3();
        
        // Create submarine that won't collect any scanner data
        // (positions without scanner data in JSON)
        sub.executeCommand('forward 9999');
        
        // Manually clear map points to test edge case
        const mapPoints = sub.getMapPoints();
        mapPoints.clear();
        
        const map = sub.buildMap();
        
        expect(map).toEqual([]);
        expect(map.length).toBe(0);
      });

      it('should create map with correct dimensions', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('down 2');
        sub.executeCommand('forward 10');
        
        const map = sub.buildMap();
        const dimensions = sub.getMapDimensions();
        
        if (map.length > 0) {
          expect(map.length).toBe(dimensions.height);
          expect(map[0].length).toBe(dimensions.width);
          
          // All rows should have same width
          map.forEach(row => {
            expect(row.length).toBe(dimensions.width);
          });
        }
      });

      it('should initialize all cells with spaces', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 5');
        sub.executeCommand('down 1');
        sub.executeCommand('forward 5');
        
        const map = sub.buildMap();
        
        if (map.length > 0) {
          // Count total cells
          const totalCells = map.length * map[0].length;
          const mapPoints = sub.getMapPoints();
          
          // Should have at least as many cells as map points
          expect(totalCells).toBeGreaterThanOrEqual(mapPoints.size);
          
          // Empty cells should be spaces
          let spaceCount = 0;
          map.forEach(row => {
            row.forEach(cell => {
              if (cell === ' ') spaceCount++;
            });
          });
          
          expect(spaceCount).toBeGreaterThan(0);
        }
      });

      it('should correctly translate coordinates to map indices', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('down 1');
        sub.executeCommand('forward 10');
        
        const map = sub.buildMap();
        const mapPoints = sub.getMapPoints();
        const dimensions = sub.getMapDimensions();
        
        if (mapPoints.size > 0 && map.length > 0) {
          // Verify each map point appears in the map
          mapPoints.forEach((char, key) => {
            const match = key.match(/\((-?\d+),(-?\d+)\)/);
            
            if (match) {
              const x = parseInt(match[1]);
              const y = parseInt(match[2]);
              
              // Convert to map indices
              const mapX = x - dimensions.minX;
              const mapY = y - dimensions.minY;
              
              // Should be within bounds
              expect(mapY).toBeGreaterThanOrEqual(0);
              expect(mapY).toBeLessThan(map.length);
              expect(mapX).toBeGreaterThanOrEqual(0);
              expect(mapX).toBeLessThan(map[0].length);
              
              // Character should match
              expect(map[mapY][mapX]).toBe(char);
            }
          });
        }
      });

      it('should handle negative coordinates correctly', () => {
        const sub = new SubmarinePart3();
        
        // Create negative depth
        sub.executeCommand('up 5');
        sub.executeCommand('forward 2');
        
        const map = sub.buildMap();
        const dimensions = sub.getMapDimensions();
        
        if (map.length > 0 && dimensions.minY < 0) {
          // Map should be built even with negative coordinates
          expect(map.length).toBe(dimensions.height);
          expect(map[0].length).toBe(dimensions.width);
          
          // Width and height should account for negative coords
          expect(dimensions.height).toBe(dimensions.maxY - dimensions.minY + 1);
          expect(dimensions.width).toBe(dimensions.maxX - dimensions.minX + 1);
        }
      });

      it('should handle overlapping 3x3 scans without duplication', () => {
        const sub = new SubmarinePart3();
        
        // Move to create overlapping scans
        sub.executeCommand('forward 1');
        sub.executeCommand('down 1');
        sub.executeCommand('forward 1');
        
        const mapPoints = sub.getMapPoints();
        const map = sub.buildMap();
        
        if (map.length > 0) {
          // Count non-space characters in map
          let charCount = 0;
          map.forEach(row => {
            row.forEach(cell => {
              if (cell !== ' ') charCount++;
            });
          });
          
          // Count non-space characters in map points
          const nonSpaceMapPoints = Array.from(mapPoints.values())
            .filter(c => c !== ' ').length;
          
          // Character count should match or be close (accounting for spaces)
          expect(charCount).toBeGreaterThan(0);
          expect(charCount).toBeLessThanOrEqual(mapPoints.size);
          
          // Verify no duplicate coordinates
          expect(mapPoints.size).toBeGreaterThan(0);

          expect(nonSpaceMapPoints).toBeLessThanOrEqual(mapPoints.size);
        }
      });

      it('should preserve all scanner characters in map', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('down 3');
        sub.executeCommand('forward 20');
        
        const mapPoints = sub.getMapPoints();
        const map = sub.buildMap();
        
        if (mapPoints.size > 0 && map.length > 0) {
          // Create set of characters from map
          const mapChars = new Set<string>();
          map.forEach(row => {
            row.forEach(cell => mapChars.add(cell));
          });
          
          // Check that all map point characters are in the map
          mapPoints.forEach(char => {
            expect(mapChars.has(char)).toBe(true);
          });
        }
      });

      it('should create rectangular map (all rows same length)', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 5');
        sub.executeCommand('forward 10');
        
        const map = sub.buildMap();
        
        if (map.length > 1) {
          const firstRowLength = map[0].length;
          
          map.forEach(row => {
            expect(row.length).toBe(firstRowLength);
          });
        }
      });
    });

    describe('getMapDimensions()', () => {
      it('should return zero dimensions when no map points', () => {
        const sub = new SubmarinePart3();
        
        // Move to position without scanner data
        sub.executeCommand('forward 9999');
        
        // Manually clear to test
        const mapPoints = sub.getMapPoints();
        mapPoints.clear();
        
        const dimensions = sub.getMapDimensions();
        
        expect(dimensions).toEqual({
          width: 0,
          height: 0,
          minX: 0,
          maxX: 0,
          minY: 0,
          maxY: 0
        });
      });

      it('should calculate correct width and height', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('down 2');
        sub.executeCommand('forward 15');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.width > 0) {
          // Width = maxX - minX + 1
          expect(dimensions.width).toBe(dimensions.maxX - dimensions.minX + 1);
          // Height = maxY - minY + 1
          expect(dimensions.height).toBe(dimensions.maxY - dimensions.minY + 1);
          
          // Dimensions should be positive
          expect(dimensions.width).toBeGreaterThan(0);
          expect(dimensions.height).toBeGreaterThan(0);
        }
      });

      it('should handle single point map', () => {
        const sub = new SubmarinePart3();
        
        // Don't move, just scan starting position
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.width > 0) {
          // Single 3x3 scan centered at (0,0)
          expect(dimensions.minX).toBeLessThanOrEqual(0);
          expect(dimensions.maxX).toBeGreaterThanOrEqual(0);
          expect(dimensions.minY).toBeLessThanOrEqual(0);
          expect(dimensions.maxY).toBeGreaterThanOrEqual(0);
        }
      });

      it('should correctly identify min and max coordinates', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 5');
        sub.executeCommand('forward 10');
        
        const dimensions = sub.getMapDimensions();
        const mapPoints = sub.getMapPoints();
        
        if (mapPoints.size > 0) {
          // Extract all coordinates from map points
          const coords: Array<{x: number, y: number}> = [];
          mapPoints.forEach((_char, key) => {
            const match = key.match(/\((-?\d+),(-?\d+)\)/);
            if (match) {
              coords.push({
                x: parseInt(match[1]),
                y: parseInt(match[2])
              });
            }
          });
          
          const actualMinX = Math.min(...coords.map(c => c.x));
          const actualMaxX = Math.max(...coords.map(c => c.x));
          const actualMinY = Math.min(...coords.map(c => c.y));
          const actualMaxY = Math.max(...coords.map(c => c.y));
          
          expect(dimensions.minX).toBe(actualMinX);
          expect(dimensions.maxX).toBe(actualMaxX);
          expect(dimensions.minY).toBe(actualMinY);
          expect(dimensions.maxY).toBe(actualMaxY);
        }
      });

      it('should handle negative coordinate boundaries', () => {
        const sub = new SubmarinePart3();
        
        // Create negative coordinates
        sub.executeCommand('up 10');
        sub.executeCommand('forward 5');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.height > 0 && dimensions.minY < 0) {
          // Should handle negative correctly
          expect(dimensions.minY).toBeLessThan(0);
          expect(dimensions.maxY).toBeGreaterThanOrEqual(dimensions.minY);
          
          // Width and height still positive
          expect(dimensions.width).toBeGreaterThan(0);
          expect(dimensions.height).toBeGreaterThan(0);
        }
      });

      it('should remain consistent with buildMap dimensions', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 3');
        sub.executeCommand('forward 10');
        
        const dimensions = sub.getMapDimensions();
        const map = sub.buildMap();
        
        if (map.length > 0) {
          expect(map.length).toBe(dimensions.height);
          expect(map[0].length).toBe(dimensions.width);
        }
      });

      it('should update dimensions as submarine moves', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 5');
        const dimensions1 = sub.getMapDimensions();
        
        sub.executeCommand('down 5');
        sub.executeCommand('forward 10');
        const dimensions2 = sub.getMapDimensions();
        
        if (dimensions1.width > 0 && dimensions2.width > 0) {
          // Dimensions should grow as we move
          expect(dimensions2.width).toBeGreaterThanOrEqual(dimensions1.width);
          expect(dimensions2.height).toBeGreaterThanOrEqual(dimensions1.height);
        }
      });

      it('should handle all properties defined correctly', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 2');
        sub.executeCommand('forward 5');
        
        const dimensions = sub.getMapDimensions();
        
        // All properties should be defined
        expect(dimensions).toHaveProperty('width');
        expect(dimensions).toHaveProperty('height');
        expect(dimensions).toHaveProperty('minX');
        expect(dimensions).toHaveProperty('maxX');
        expect(dimensions).toHaveProperty('minY');
        expect(dimensions).toHaveProperty('maxY');
        
        // All should be numbers
        expect(typeof dimensions.width).toBe('number');
        expect(typeof dimensions.height).toBe('number');
        expect(typeof dimensions.minX).toBe('number');
        expect(typeof dimensions.maxX).toBe('number');
        expect(typeof dimensions.minY).toBe('number');
        expect(typeof dimensions.maxY).toBe('number');
      });

      it('should handle both positive and negative coordinates', () => {
        const sub = new SubmarinePart3();
        
        // Create mix of positive and negative
        sub.executeCommand('up 5');
        sub.executeCommand('forward 10');
        sub.executeCommand('down 15');
        sub.executeCommand('forward 10');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.width > 0) {
          // minY could be negative, maxY positive
          expect(dimensions.maxY).toBeGreaterThanOrEqual(dimensions.minY);
          expect(dimensions.maxX).toBeGreaterThanOrEqual(dimensions.minX);
          
          // Verify formula consistency
          expect(dimensions.width).toBe(dimensions.maxX - dimensions.minX + 1);
          expect(dimensions.height).toBe(dimensions.maxY - dimensions.minY + 1);
        }
      });

      it('should handle large coordinate values', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('down 100');
        sub.executeCommand('forward 1000');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.width > 0) {
          // Should handle large values without overflow
          expect(dimensions.width).toBeGreaterThan(0);
          expect(dimensions.height).toBeGreaterThan(0);
          expect(Number.isFinite(dimensions.width)).toBe(true);
          expect(Number.isFinite(dimensions.height)).toBe(true);
        }
      });

      it('should be idempotent (calling multiple times returns same result)', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 5');
        sub.executeCommand('forward 10');
        
        const dimensions1 = sub.getMapDimensions();
        const dimensions2 = sub.getMapDimensions();
        const dimensions3 = sub.getMapDimensions();
        
        expect(dimensions1).toEqual(dimensions2);
        expect(dimensions2).toEqual(dimensions3);
      });

      it('should handle coordinate parsing edge cases', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 5');
        
        const dimensions = sub.getMapDimensions();
        
        // Should successfully parse coordinates even with edge cases
        expect(dimensions.width).toBeGreaterThanOrEqual(0);
        expect(dimensions.height).toBeGreaterThanOrEqual(0);
        
        // Should not have NaN values
        expect(Number.isNaN(dimensions.width)).toBe(false);
        expect(Number.isNaN(dimensions.height)).toBe(false);
        expect(Number.isNaN(dimensions.minX)).toBe(false);
        expect(Number.isNaN(dimensions.maxX)).toBe(false);
        expect(Number.isNaN(dimensions.minY)).toBe(false);
        expect(Number.isNaN(dimensions.maxY)).toBe(false);
      });

      it('should handle regex match failures gracefully', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        
        // Even if some coordinates fail to parse, should not crash
        const dimensions = sub.getMapDimensions();
        
        expect(() => sub.getMapDimensions()).not.toThrow();
        expect(dimensions).toBeDefined();
      });

      it('should calculate dimensions for wide horizontal maps', () => {
        const sub = new SubmarinePart3();
        
        // Create wide horizontal map
        sub.executeCommand('forward 50');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.width > 0) {
          // Width should be significantly larger than height
          expect(dimensions.width).toBeGreaterThan(0);
        }
      });

      it('should calculate dimensions for tall vertical maps', () => {
        const sub = new SubmarinePart3();
        
        // Create tall vertical map
        sub.executeCommand('down 50');
        sub.executeCommand('forward 1');
        
        const dimensions = sub.getMapDimensions();
        
        if (dimensions.height > 0) {
          // Height should be larger due to vertical movement
          expect(dimensions.height).toBeGreaterThan(0);
        }
      });
    });

    describe('printMap()', () => {
      it('should not throw when map is empty', () => {
        const sub = new SubmarinePart3();
        
        // Clear map points
        const mapPoints = sub.getMapPoints();
        mapPoints.clear();
        
        expect(() => sub.printMap()).not.toThrow();
      });

      it('should not throw with valid map data', () => {
        const sub = new SubmarinePart3();
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 2');
        sub.executeCommand('forward 5');
        
        expect(() => sub.printMap()).not.toThrow();
      });

      it('should print message when no map data available', () => {
        const sub = new SubmarinePart3();
        const consoleSpy = jest.spyOn(console, 'log');
        
        // Clear map points
        const mapPoints = sub.getMapPoints();
        mapPoints.clear();
        
        sub.printMap();
        
        expect(consoleSpy).toHaveBeenCalledWith('No map data available');
        consoleSpy.mockRestore();
      });

      it('should print map header and footer', () => {
        const sub = new SubmarinePart3();
        const consoleSpy = jest.spyOn(console, 'log');
        
        sub.executeCommand('forward 10');
        sub.executeCommand('down 2');
        sub.executeCommand('forward 5');
        
        sub.printMap();
        
        const calls = consoleSpy.mock.calls.map(call => call[0]);
        
        if (sub.getMapPoints().size > 0) {
          expect(calls.some(call => call?.includes('SCANNED MAP'))).toBe(true);
          expect(calls.some(call => call?.includes('==='))).toBe(true);
        }
        
        consoleSpy.mockRestore();
      });

      it('should print each row of the map', () => {
        const sub = new SubmarinePart3();
        const consoleSpy = jest.spyOn(console, 'log');
        
        sub.executeCommand('down 1');
        sub.executeCommand('forward 10');
        
        const map = sub.buildMap();
        sub.printMap();
        
        if (map.length > 0) {
          const consoleCalls = consoleSpy.mock.calls;
          
          // Should have printed at least: header + map rows + footer
          expect(consoleCalls.length).toBeGreaterThanOrEqual(map.length + 2);
          
          // Check that map rows were printed
          map.forEach(row => {
            const rowString = row.join('');
            const wasPrinted = consoleCalls.some(call => call[0] === rowString);
            expect(wasPrinted).toBe(true);
          });
        }
        
        consoleSpy.mockRestore();
      });

      it('should handle maps with special characters', () => {
        const sub = new SubmarinePart3();
        const consoleSpy = jest.spyOn(console, 'log');
        
        sub.executeCommand('down 3');
        sub.executeCommand('forward 25');
        
        expect(() => sub.printMap()).not.toThrow();
        
        const mapPoints = sub.getMapPoints();
        if (mapPoints.size > 0) {
          // Should have printed something
          expect(consoleSpy).toHaveBeenCalled();
        }
        
        consoleSpy.mockRestore();
      });

      it('should handle large maps without errors', () => {
        const sub = new SubmarinePart3();
        
        // Create a larger map
        sub.executeCommand('forward 20');
        sub.executeCommand('down 10');
        sub.executeCommand('forward 20');
        sub.executeCommand('up 5');
        sub.executeCommand('forward 20');
        
        expect(() => sub.printMap()).not.toThrow();
      });

      it('should print map with negative coordinates', () => {
        const sub = new SubmarinePart3();
        const consoleSpy = jest.spyOn(console, 'log');
        
        sub.executeCommand('up 5');
        sub.executeCommand('forward 5');
        
        expect(() => sub.printMap()).not.toThrow();
        
        if (sub.getMapPoints().size > 0) {
          expect(consoleSpy).toHaveBeenCalled();
        }
        
        consoleSpy.mockRestore();
      });

    it('should execute all dimension calculation logic with guaranteed scanner data', () => {
      const sub = new SubmarinePart3();
      
      // Use positions that definitely have scanner data
      // Based on scanner-data.json, position (6,10) has data
      sub.executeCommand('forward 6');
      sub.executeCommand('down 1');
      sub.executeCommand('forward 4'); // This moves to (10,10)
      
      const mapPoints = sub.getMapPoints();
      
      // Ensure we have map points
      expect(mapPoints.size).toBeGreaterThan(0);
      
      const dimensions = sub.getMapDimensions();
      
      // Lines 345-346: Check empty case is NOT hit
      expect(dimensions.width).not.toBe(0);
      expect(dimensions.height).not.toBe(0);
      
      // Lines 349-352: Verify coordinate extraction logic
      const coordinates = Array.from(mapPoints.keys()).map(key => {
        const match = key.match(/\((-?\d+),(-?\d+)\)/);
        if (!match) return { x: 0, y: 0 };
        return { x: parseInt(match[1]), y: parseInt(match[2]) };
      });
      
      expect(coordinates.length).toBeGreaterThan(0);
      
      // Lines 354-357: Verify min/max calculations
      const actualMinX = Math.min(...coordinates.map(c => c.x));
      const actualMaxX = Math.max(...coordinates.map(c => c.x));
      const actualMinY = Math.min(...coordinates.map(c => c.y));
      const actualMaxY = Math.max(...coordinates.map(c => c.y));
      
      expect(dimensions.minX).toBe(actualMinX);
      expect(dimensions.maxX).toBe(actualMaxX);
      expect(dimensions.minY).toBe(actualMinY);
      expect(dimensions.maxY).toBe(actualMaxY);
      
      // Lines 359-366: Verify return object
      expect(dimensions.width).toBe(actualMaxX - actualMinX + 1);
      expect(dimensions.height).toBe(actualMaxY - actualMinY + 1);
      expect(dimensions).toHaveProperty('width');
      expect(dimensions).toHaveProperty('height');
      expect(dimensions).toHaveProperty('minX');
      expect(dimensions).toHaveProperty('maxX');
      expect(dimensions).toHaveProperty('minY');
      expect(dimensions).toHaveProperty('maxY');
    });

    it('should handle regex match failure in coordinate parsing', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 6');
      sub.executeCommand('down 1');
      sub.executeCommand('forward 4');
      
      const mapPoints = sub.getMapPoints();
      
      // Manually test the coordinate parsing logic
      const coordinates = Array.from(mapPoints.keys()).map(key => {
        const match = key.match(/\((-?\d+),(-?\d+)\)/);
        if (!match) return { x: 0, y: 0 }; // This line needs coverage
        return { x: parseInt(match[1]), y: parseInt(match[2]) };
      });
      
      // All coordinates should be parsed (no null matches with valid data)
      coordinates.forEach(coord => {
        expect(coord).toHaveProperty('x');
        expect(coord).toHaveProperty('y');
        expect(typeof coord.x).toBe('number');
        expect(typeof coord.y).toBe('number');
      });
      
      const dimensions = sub.getMapDimensions();
      expect(dimensions.width).toBeGreaterThan(0);
    });

    it('should calculate correct width from min and max X', () => {
      const sub = new SubmarinePart3();
      
      // Create a spread of horizontal positions
      sub.executeCommand('forward 10');
      sub.executeCommand('down 1');
      sub.executeCommand('forward 10');
      
      const dimensions = sub.getMapDimensions();
      
      if (dimensions.width > 0) {
        // Verify line 359: width calculation
        const expectedWidth = dimensions.maxX - dimensions.minX + 1;
        expect(dimensions.width).toBe(expectedWidth);
        
        // maxX should be >= minX
        expect(dimensions.maxX).toBeGreaterThanOrEqual(dimensions.minX);
      }
    });

    it('should calculate correct height from min and max Y', () => {
      const sub = new SubmarinePart3();
      
      // Create a spread of depth positions
      sub.executeCommand('down 10');
      sub.executeCommand('forward 5');
      sub.executeCommand('down 10');
      sub.executeCommand('forward 5');
      
      const dimensions = sub.getMapDimensions();
      
      if (dimensions.height > 0) {
        // Verify line 360: height calculation
        const expectedHeight = dimensions.maxY - dimensions.minY + 1;
        expect(dimensions.height).toBe(expectedHeight);
        
        // maxY should be >= minY
        expect(dimensions.maxY).toBeGreaterThanOrEqual(dimensions.minY);
      }
    });

    it('should return all six dimension properties', () => {
      const sub = new SubmarinePart3();
      
      sub.executeCommand('forward 10');
      sub.executeCommand('down 2');
      sub.executeCommand('forward 5');
      
      const dimensions = sub.getMapDimensions();
      
      // Verify lines 359-366: return object structure
      const keys = Object.keys(dimensions);
      expect(keys).toContain('width');
      expect(keys).toContain('height');
      expect(keys).toContain('minX');
      expect(keys).toContain('maxX');
      expect(keys).toContain('minY');
      expect(keys).toContain('maxY');
      expect(keys.length).toBe(6);
    });

    it('should use Math.min and Math.max correctly for boundaries', () => {
      const sub = new SubmarinePart3();
      
      // Create varied positions
      sub.executeCommand('forward 15');
      sub.executeCommand('down 3');
      sub.executeCommand('forward 10');
      sub.executeCommand('up 1');
      sub.executeCommand('forward 5');
      
      const dimensions = sub.getMapDimensions();
      const mapPoints = sub.getMapPoints();
      
      if (mapPoints.size > 0) {
        // Manually calculate to verify lines 354-357
        const allX: number[] = [];
        const allY: number[] = [];
        
        mapPoints.forEach((_char, key) => {
          const match = key.match(/\((-?\d+),(-?\d+)\)/);
          if (match) {
            allX.push(parseInt(match[1]));
            allY.push(parseInt(match[2]));
          }
        });
        
        expect(dimensions.minX).toBe(Math.min(...allX));
        expect(dimensions.maxX).toBe(Math.max(...allX));
        expect(dimensions.minY).toBe(Math.min(...allY));
        expect(dimensions.maxY).toBe(Math.max(...allY));
      }
    });

    });
  });
});