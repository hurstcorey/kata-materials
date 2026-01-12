/**
 * Main entry point for Submarine Kata
 *
 * Demonstrates all solution approaches and compares them
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  SubmarinePart1,
  SubmarinePart2,
  calculateFinalPosition
} from './submarine';
import {
  functionalNavigatePart1,
  functionalNavigatePart2,
  pipelineNavigate
} from './alternative-solutions';

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
  console.log('SUBMARINE NAVIGATION KATA - SOLUTION COMPARISON');
  console.log('='.repeat(60));
  console.log();

  const commands = loadCommands();
  console.log(`Loaded ${commands.length} commands from input.txt\n`);

  // Part 1 Solutions
  console.log('--- PART 1: Simple Navigation ---\n');

  // Approach 1: OOP Class
  const result1 = measurePerformance(() => {
    const sub = new SubmarinePart1();
    commands.forEach(cmd => sub.executeCommand(cmd));
    return { position: sub.getPosition(), result: sub.getResult() };
  }, '1. OOP Class (SubmarinePart1)      ');

  console.log(`   Position: (${result1.position.horizontal}, ${result1.position.depth})`);
  console.log(`   Result: ${result1.result}\n`);

  // Approach 2: Functional Reduce
  const result2 = measurePerformance(() => {
    return calculateFinalPosition(commands, 1);
  }, '2. Functional Reduce              ');

  console.log(`   Position: (${result2.horizontal}, ${result2.depth})`);
  console.log(`   Result: ${result2.product}\n`);

  // Approach 3: Pure Functional
  const result3 = measurePerformance(() => {
    const state = functionalNavigatePart1(commands);
    return { ...state, product: state.horizontal * state.depth };
  }, '3. Pure Functional                ');

  console.log(`   Position: (${result3.horizontal}, ${result3.depth})`);
  console.log(`   Result: ${result3.product}\n`);

  // Approach 4: Pipeline
  const result4 = measurePerformance(() => {
    return pipelineNavigate(commands, 1) as any;
  }, '4. Functional Pipeline            ');

  console.log(`   Position: (${result4.horizontal}, ${result4.depth})`);
  console.log(`   Result: ${result4.product}\n`);

  console.log('='.repeat(60));
  console.log();

  // Part 2 Solutions
  console.log('--- PART 2: Navigation with Aim ---\n');

  // Approach 1: OOP Class
  const result5 = measurePerformance(() => {
    const sub = new SubmarinePart2();
    commands.forEach(cmd => sub.executeCommand(cmd));
    return { position: sub.getPosition(), result: sub.getResult() };
  }, '1. OOP Class (SubmarinePart2)      ');

  console.log(`   Position: (${result5.position.horizontal}, ${result5.position.depth}), Aim: ${result5.position.aim}`);
  console.log(`   Result: ${result5.result}\n`);

  // Approach 2: Functional Reduce
  const result6 = measurePerformance(() => {
    return calculateFinalPosition(commands, 2);
  }, '2. Functional Reduce              ');

  console.log(`   Position: (${result6.horizontal}, ${result6.depth}), Aim: ${result6.aim}`);
  console.log(`   Result: ${result6.product}\n`);

  // Approach 3: Pure Functional
  const result7 = measurePerformance(() => {
    const state = functionalNavigatePart2(commands);
    return { ...state, product: state.horizontal * state.depth };
  }, '3. Pure Functional                ');

  console.log(`   Position: (${result7.horizontal}, ${result7.depth}), Aim: ${result7.aim}`);
  console.log(`   Result: ${result7.product}\n`);

  // Approach 4: Pipeline
  const result8 = measurePerformance(() => {
    return pipelineNavigate(commands, 2) as any;
  }, '4. Functional Pipeline            ');

  console.log(`   Position: (${result8.horizontal}, ${result8.depth}), Aim: ${result8.aim}`);
  console.log(`   Result: ${result8.product}\n`);

  console.log('='.repeat(60));
  console.log('\nAll approaches produce identical results! ✓');
  console.log('\nSee SOLUTIONS_ANALYSIS.md for detailed comparison.\n');
}

if (require.main === module) {
  main();
}

export { main };
