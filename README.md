# Submarine Navigation Kata

A comprehensive Test-Driven Development (TDD) implementation of the Submarine Navigation kata, demonstrating multiple architectural approaches and design patterns.

## Problem Statement

Navigate a submarine through the ocean using text-based commands:
- **Part 1:** Simple navigation (forward, up, down)
- **Part 2:** Navigation with aim mechanism (more complex rules)

See `submarine_kata_part1.md` and `submarine_kata_part2.md` for full specifications.

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (for TDD)
npm test:watch

# Coverage report
npm test:coverage
```

### Run Solutions

```bash
# Run all approaches and compare
npm run dev
```

## Project Structure

```
kata-materials/
├── src/
│   ├── submarine.ts              # Primary OOP & Functional solutions
│   ├── submarine.test.ts         # Test suite (20 tests)
│   ├── alternative-solutions.ts  # Strategy, Command, Pipeline patterns
│   ├── advanced-patterns.ts      # State Machine, Observer, Decorator, etc.
│   ├── advanced-patterns.test.ts # Pattern tests (40 tests)
│   └── index.ts                  # Demo runner
├── input.txt                     # Puzzle input
├── SOLUTIONS_ANALYSIS.md         # Deep dive comparison (original 6 patterns)
├── PATTERNS_GUIDE.md            # Complete guide to all 13 patterns
├── SUMMARY.md                   # Complete summary and analysis
├── package.json
├── tsconfig.json
└── jest.config.js
```

## What This Kata Teaches

1. **Command Pattern** - Processing text-based commands
2. **State Management** - Tracking position, depth, and aim
3. **TDD Workflow** - Red-Green-Refactor cycle
4. **Design Patterns** - Strategy, Command, Functional patterns
5. **SOLID Principles** - Single Responsibility, Open/Closed
6. **Type Safety** - TypeScript best practices

## 13 Design Patterns Implemented

This kata demonstrates **13 different design patterns**, each with pros/cons and real-world use cases:

### Core Patterns (src/submarine.ts & alternative-solutions.ts)
1. **Object-Oriented Programming** - Classic encapsulation
2. **Functional Programming with Reduce** - Immutable transformations
3. **Strategy Pattern** - Runtime algorithm switching
4. **Command Pattern** - Undo/redo support
5. **Pure Functional with State Transitions** - Event sourcing ready
6. **Functional Pipeline** - Composable data transformation

### Advanced Patterns (src/advanced-patterns.ts)
7. **State Machine Pattern** - Explicit state management
8. **Observer Pattern** - Event-driven notifications
9. **Decorator Pattern** - Dynamic behavior composition
10. **Chain of Responsibility** - Validation pipeline
11. **Builder Pattern** - Fluent configuration
12. **Factory Pattern** - Object creation abstraction
13. **Memento Pattern** - State snapshots and history

**📖 See [PATTERNS_GUIDE.md](./PATTERNS_GUIDE.md) for complete comparison with when to use each pattern!**

## Solution Approaches

### 1. Object-Oriented Programming
Classic OOP with encapsulated state and methods.

```typescript
const submarine = new SubmarinePart1();
submarine.executeCommand('forward 5');
submarine.executeCommand('down 3');
console.log(submarine.getResult()); // 15
```

**Best for:** Learning, interactive systems, step-by-step debugging

### 2. Functional Programming (Reduce)
Immutable state transformations using reduce.

```typescript
const result = calculateFinalPosition(commands, 1);
console.log(result.product); // 150
```

**Best for:** Batch processing, pipelines, concurrent execution

### 3. Strategy Pattern
Runtime-swappable navigation algorithms.

```typescript
const submarine = new StrategySubmarine(new AimNavigationStrategy());
submarine.executeCommand('forward 5');
```

**Best for:** Multiple algorithms, plugin architectures, enterprise systems

### 4. Command Pattern (Full)
With undo/redo support and command history.

```typescript
const submarine = new CommandPatternSubmarine();
submarine.executeCommand(new ForwardCommand(5));
submarine.undo(); // Undo last command
```

**Best for:** Undo/redo, audit trails, transaction management

### 5. Functional Pipeline
Point-free style with function composition.

```typescript
const result = pipelineNavigate(commands, 1);
```

**Best for:** Data transformation, stream processing, FP enthusiasts

## Design Decisions

### Why TypeScript?
- ✅ Type safety catches errors early
- ✅ Excellent IDE support
- ✅ Modern language features
- ✅ Industry-relevant
- ✅ Supports both OOP and FP

### Why Jest?
- ✅ Zero configuration
- ✅ Built-in mocking
- ✅ Watch mode for TDD
- ✅ Coverage reports
- ✅ Fast execution

### Why Multiple Approaches?
Each approach teaches different concepts:
- **OOP:** Encapsulation, state management
- **FP:** Immutability, pure functions
- **Patterns:** Design patterns, SOLID principles

## Test Coverage

**60 passing tests** across 2 test suites:
- ✅ 20 tests for core implementations (submarine.test.ts)
- ✅ 40 tests for advanced patterns (advanced-patterns.test.ts)
- ✅ 100% function coverage on primary implementation
- ✅ Unit tests for parsing and validation
- ✅ Integration tests combining multiple patterns
- ✅ Edge cases (negative values, invalid input, state transitions)
- ✅ All example test cases from kata specification

## Best Practices Demonstrated

1. **TDD Red-Green-Refactor**
   - Tests written first
   - Minimum code to pass
   - Refactor with confidence

2. **Clean Code**
   - Meaningful names
   - Small, focused functions
   - Clear contracts with types

3. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Dependency Inversion

4. **Type Safety**
   - Strict TypeScript
   - Union types for commands
   - Interface contracts

5. **Error Handling**
   - Input validation
   - Clear error messages
   - Fail fast

## Pros and Cons of Each Approach

| Approach | Readability | Flexibility | Complexity | Best Use Case |
|----------|-------------|-------------|------------|---------------|
| OOP | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | Learning, debugging |
| Functional | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | Pipelines, batch processing |
| Strategy | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Multiple algorithms |
| Command | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Undo/redo, auditing |
| Pipeline | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | FP, data streams |

See `SOLUTIONS_ANALYSIS.md` for detailed analysis.

## Further Exploration

### Extend the Kata
1. Add new commands (e.g., `turn`, `ascend`)
2. Implement 3D navigation
3. Add collision detection
4. Implement path visualization
5. Add command validation rules

### Try Different Languages
- Python (with dataclasses)
- Rust (with enums and pattern matching)
- Go (with interfaces and structs)
- Java (with classic OOP patterns)

### Explore Patterns
- State Machine pattern
- Observer pattern (for position changes)
- Decorator pattern (for command logging)
- Chain of Responsibility

## References

- [Advent of Code](https://adventofcode.com/)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Test-Driven Development by Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

## License

MIT - Feel free to use for learning and teaching!
