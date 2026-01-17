/**
 * Main entry point for Submarine Kata
 *
 * Demonstrates OOP solution for submarine navigation
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  SubmarinePart1,
  SubmarinePart2,
  SubmarinePart3,
} from './submarine';

function loadCommands(): string[] {
  const inputPath = join(__dirname, '..', 'input.txt');
  const content = readFileSync(inputPath, 'utf-8');
  return content.split('\n').filter(line => line.trim().length > 0);
}

function measurePerformance<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(3)}ms`);
  return result;
}

function main() {
  console.log('='.repeat(60));
  console.log('SUBMARINE NAVIGATION KATA - OOP SOLUTION');
  console.log('='.repeat(60));
  console.log();

  const commands = loadCommands();
  console.log(`Loaded ${commands.length} commands from input.txt\n`);

  // Part 1: Simple Navigation
  console.log('--- PART 1: Simple Navigation ---\n');

  const result1 = measurePerformance(() => {
    const sub = new SubmarinePart1();
    commands.forEach(cmd => sub.executeCommand(cmd));
    return { position: sub.getPosition(), result: sub.getResult() };
  }, 'OOP Class (SubmarinePart1)');

  console.log(`   Position: (${result1.position.horizontal}, ${result1.position.depth})`);
  console.log(`   Result: ${result1.result}\n`);

  console.log('='.repeat(60));
  console.log();

  // Part 2: Navigation with Aim
  console.log('--- PART 2: Navigation with Aim ---\n');

  const result2 = measurePerformance(() => {
    const sub = new SubmarinePart2();
    commands.forEach(cmd => sub.executeCommand(cmd));
    return { position: sub.getPosition(), result: sub.getResult() };
  }, 'OOP Class (SubmarinePart2)');

  console.log(`   Position: (${result2.position.horizontal}, ${result2.position.depth}), Aim: ${result2.position.aim}`);
  console.log(`   Result: ${result2.result}\n`);

  console.log('='.repeat(60));

  // Part 3: Map Building
  console.log('--- PART 3: Map Building ---\n');

  measurePerformance(() => {
    const sub = new SubmarinePart3();
    commands.forEach(cmd => sub.executeCommand(cmd));

    const dimensions = sub.getMapDimensions();
    const visitedCount = sub.getVisitedPositions().length;
    const scannedCount = sub.getScannedData().length;
    const mapPointsCount = sub.getMapPoints().size;

    console.log(`   Visited Positions: ${visitedCount}`);
    console.log(`   Scanned Data Points: ${scannedCount}`);
    console.log(`   Map Dimensions: Width=${dimensions.width}, Height=${dimensions.height}`);
    console.log(`   Mapped Points: ${mapPointsCount}\n`);

    sub.printMap();
    
    return sub.getResult();
  }, 'OOP Class (SubmarinePart3)');

}

if (require.main === module) {
  main();
}

export { main };
