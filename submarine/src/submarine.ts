/**
 * Submarine Navigation Kata - TypeScript Implementation
 *
 * This implementation demonstrates:
 * - Object-Oriented Design (classes for state management)
 * - Functional Programming (pure functions for calculations)
 * - Command Pattern (discrete command execution)
 * - Single Responsibility Principle (separate parsing, execution, calculation)
 * - Type Safety (TypeScript interfaces and types)
 */

export type Direction = 'forward' | 'down' | 'up';

export interface Command {
  direction: Direction;
  value: number;
}

export interface Position {
  horizontal: number;
  depth: number;
}

export interface PositionWithAim extends Position {
  aim: number;
}

export interface ScannerMap {
  horizontal: number;
  depth: number;
  points:string[];
}

export interface  visitedPositions {
  visitedPositions:Array<{horizontal:number;depth:number;}>;
}

export interface ScanData {
  position: { horizontal: number; depth: number };
  scanResult: string[];
}

export interface MapPoint {
  horizontal: number;
  depth: number;
  character: string;
}

/**
 * Parses a command string into a structured Command object
 * @param commandStr - String in format "direction value" (e.g., "forward 5")
 * @returns Command object with direction and value
 * @throws Error if command format is invalid
 *
 * Why: Separation of concerns - parsing logic isolated from execution logic
 */
export function parseCommand(commandStr: string): Command {
  const parts = commandStr.trim().split(' ');

  if (parts.length !== 2) {
    throw new Error(`Invalid command format: "${commandStr}". Expected "direction value"`);
  }

  const [direction, valueStr] = parts;
  const value = parseInt(valueStr, 10);

  if (isNaN(value)) {
    throw new Error(`Invalid value: "${valueStr}". Expected a number`);
  }

  if (!['forward', 'down', 'up'].includes(direction)) {
    throw new Error(`Invalid direction: "${direction}". Expected forward, down, or up`);
  }

  return { direction: direction as Direction, value };
}

export function checkScanner(position: PositionWithAim): string[] | null {
  const scannerData = require('./scanner-data.json');
  const key = `(${position.horizontal},${position.depth})`;
  
  if (key in scannerData) {
    return scannerData[key];
  }
  
  return null;
}

/**
 * Part 1: Simple submarine navigation
 *
 * Design Pattern: Encapsulation
 * - State (horizontal, depth) is private
 * - Mutation only through public methods
 * - Provides clear interface for interaction
 *
 * Why OOP here:
 * - Maintains state across multiple commands
 * - Clear object lifecycle (create, execute commands, get result)
 * - Easy to test and extend
 */
export class SubmarinePart1 {
  private horizontal: number = 0;
  private depth: number = 0;

  /**
   * Executes a navigation command
   * @param commandStr - Command string to execute
   *
   * Why: Single method for all commands (Command Pattern)
   */
  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    switch (command.direction) {
      case 'forward':
        this.horizontal += command.value;
        break;
      case 'down':
        this.depth += command.value;
        break;
      case 'up':
        this.depth -= command.value;
        break;
    }


  }

  /**
   * Gets current position (immutable copy)
   * Why: Prevents external mutation of internal state
   */
  getPosition(): Position {
    return { horizontal: this.horizontal, depth: this.depth };
  }

  /**
   * Calculates the product of horizontal position and depth
   * Why: Domain-specific calculation encapsulated in the class
   */
  getResult(): number {
    return this.horizontal * this.depth;
  }
}

/**
 * Part 2: Submarine with aim mechanism
 *
 * Design Pattern: Extension with new behavior
 * - Could extend Part1, but kept separate for clarity
 * - forward command now has compound behavior
 * - Demonstrates requirement evolution
 */
export class SubmarinePart2 {
  private horizontal: number = 0;
  private depth: number = 0;
  private aim: number = 0;

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    switch (command.direction) {
      case 'forward':
        // Compound action: move horizontally AND adjust depth based on aim
        this.horizontal += command.value;
        this.depth += this.aim * command.value;
        break;
      case 'down':
        // Now affects aim, not depth
        this.aim += command.value;
        break;
      case 'up':
        this.aim -= command.value;
        break;
    }
  }

  getPosition(): PositionWithAim {
    return { horizontal: this.horizontal, depth: this.depth, aim: this.aim };
  }

  getResult(): number {
    return this.horizontal * this.depth;
  }
}

/**
 * Part 2: Submarine with aim mechanism
 *
 * Design Pattern: Extension with new behavior
 * - Extends Part2 for further modification
 */
export class SubmarinePart3 extends SubmarinePart2 {
  
  private visitedPositions: visitedPositions = {visitedPositions: []};
  private scannedData: ScanData[] = [];
  private mapPoints: Map<string, string> = new Map();

  constructor() {
    super();
    // Record starting position
    this.visitedPositions.visitedPositions.push({horizontal: 0, depth: 0});
    // Initial scan at starting position
    this.collectScanData({horizontal: 0, depth: 0, aim: 0});
  }

  executeCommand(commandStr: string): void {
    super.executeCommand(commandStr);
    
    // After each command execution, record the new position
    const pos = this.getPosition();
    this.visitedPositions.visitedPositions.push({ 
      horizontal: pos.horizontal, 
      depth: pos.depth 
    });

    // After each command execution, collect scanner data at this position
    this.collectScanData(pos);

    // translate scan data to map points
    this.translateScanToMap(this.scannedData[this.scannedData.length - 1]);

  }
  
  private collectScanData(position: PositionWithAim): void {
    const scanResult = checkScanner({ horizontal: position.horizontal, depth: position.depth, aim: position.aim });
    
    if (scanResult !== null) {
      const scanData: ScanData = {
        position: { horizontal: position.horizontal, depth: position.depth },
        scanResult: scanResult
      };
      
      this.scannedData.push(scanData);
    }

  }

  private translateScanToMap(scanData: ScanData): void {
    const { position, scanResult } = scanData;
  
    // The scan is a 3x3 grid centered on the position
    // scanResult[0-8] maps to:
    // [0,1,2]  top row    (y-1)
    // [3,4,5]  middle row (y)
    // [6,7,8]  bottom row (y+1)
    //
    // For each row:
    // column 0: x-1, column 1: x, column 2: x+1
    const offsets = [
      [-1, -1], [0, -1], [1, -1],  // Top row
      [-1,  0], [0,  0], [1,  0],  // Middle row
      [-1,  1], [0,  1], [1,  1]   // Bottom row
    ];
    
    scanResult.forEach((char, index) => {
      const [xOffset, yOffset] = offsets[index];
      const absoluteX = position.horizontal + xOffset;
      const absoluteY = position.depth + yOffset;
      const key = `(${absoluteX},${absoluteY})`;
      
      this.mapPoints.set(key, char);
    });
  }

    getScannedData(): ScanData[] {
    return this.scannedData;
  }

  getMapPoints(): Map<string, string> {
    return this.mapPoints;
  }

  getVisitedPositions(): Array<{horizontal: number, depth: number}> {
    return [...this.visitedPositions.visitedPositions]; // Return a copy
  }

  /**
   * Builds the complete map from all collected scanner data
   * @returns 2D array representing the map
   */
  buildMap(): string[][] {
    if (this.mapPoints.size === 0) {
      return [];
    }

    // Find the boundaries of the map
    const coordinates = Array.from(this.mapPoints.keys()).map(key => {
      const match = key.match(/\((-?\d+),(-?\d+)\)/);
      if (!match) return { x: 0, y: 0 };
      return { x: parseInt(match[1]), y: parseInt(match[2]) };
    });

    const minX = Math.min(...coordinates.map(c => c.x));
    const maxX = Math.max(...coordinates.map(c => c.x));
    const minY = Math.min(...coordinates.map(c => c.y));
    const maxY = Math.max(...coordinates.map(c => c.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    // Initialize map with spaces
    const map: string[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ' ')
    );

    // Fill in the map with collected points
    this.mapPoints.forEach((char, key) => {
      const match = key.match(/\((-?\d+),(-?\d+)\)/);
      if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const mapX = x - minX;
        const mapY = y - minY;
        map[mapY][mapX] = char;
      }
    });

    return map;
  }

  /**
   * Prints the map to console
   */
  printMap(): void {
    const map = this.buildMap();
    
    if (map.length === 0) {
      console.log('No map data available');
      return;
    }

    console.log('\n=== SCANNED MAP ===');
    map.forEach(row => {
      console.log(row.join(''));
    });
    console.log('===================\n');
  }

  /**
   * Gets map dimensions
   */
  getMapDimensions(): { width: number; height: number; minX: number; maxX: number; minY: number; maxY: number } {
    if (this.mapPoints.size === 0) {
      return { width: 0, height: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const coordinates = Array.from(this.mapPoints.keys()).map(key => {
      const match = key.match(/\((-?\d+),(-?\d+)\)/);
      if (!match) return { x: 0, y: 0 };
      return { x: parseInt(match[1]), y: parseInt(match[2]) };
    });

    const minX = Math.min(...coordinates.map(c => c.x));
    const maxX = Math.max(...coordinates.map(c => c.x));
    const minY = Math.min(...coordinates.map(c => c.y));
    const maxY = Math.max(...coordinates.map(c => c.y));

    return {
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      minX,
      maxX,
      minY,
      maxY
    };
  }
}
