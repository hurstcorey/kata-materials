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

import { readFileSync } from 'fs';
// import { join } from 'path';

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

export function checkScanner(postition:PositionWithAim): ScannerMap{
  // const inputPath = join(__dirname, '..', 'scanner-data.json');
  const content = readFileSync('./src/scanner-data.json', 'utf-8');
  const scannerData = JSON.parse(content);

  const horiztonal = postition.horizontal
  const depth = postition.depth
  console.log(scannerData[`(${horiztonal},${depth})`])
  

  return scannerData
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

        checkScanner(this.getPosition())
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
