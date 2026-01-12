/**
 * Alternative Solution Approaches
 *
 * This file demonstrates different architectural patterns and paradigms
 * for solving the submarine kata, each with different trade-offs.
 */

import { Command, PositionWithAim, parseCommand } from './submarine';

// ============================================================================
// APPROACH 1: Strategy Pattern (OOP Design Pattern)
// ============================================================================

/**
 * Strategy Pattern Implementation
 *
 * Why:
 * - Open/Closed Principle: Open for extension, closed for modification
 * - Easy to add new navigation strategies without changing existing code
 * - Testable in isolation
 * - Runtime strategy switching
 *
 * Pros:
 * - Very flexible and extensible
 * - Clear separation of concerns
 * - Easy to add new navigation modes
 *
 * Cons:
 * - More boilerplate code
 * - Overkill for simple use cases
 * - More classes to maintain
 */

interface NavigationStrategy {
  execute(command: Command, state: PositionWithAim): PositionWithAim;
}

export class SimpleNavigationStrategy implements NavigationStrategy {
  execute(command: Command, state: PositionWithAim): PositionWithAim {
    const newState = { ...state };

    switch (command.direction) {
      case 'forward':
        newState.horizontal += command.value;
        break;
      case 'down':
        newState.depth += command.value;
        break;
      case 'up':
        newState.depth -= command.value;
        break;
    }

    return newState;
  }
}

export class AimNavigationStrategy implements NavigationStrategy {
  execute(command: Command, state: PositionWithAim): PositionWithAim {
    const newState = { ...state };

    switch (command.direction) {
      case 'forward':
        newState.horizontal += command.value;
        newState.depth += newState.aim * command.value;
        break;
      case 'down':
        newState.aim += command.value;
        break;
      case 'up':
        newState.aim -= command.value;
        break;
    }

    return newState;
  }
}

export class StrategySubmarine {
  private state: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };

  constructor(private strategy: NavigationStrategy) {}

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);
    this.state = this.strategy.execute(command, this.state);
  }

  getPosition(): PositionWithAim {
    return { ...this.state };
  }

  getResult(): number {
    return this.state.horizontal * this.state.depth;
  }

  // Runtime strategy switching
  setStrategy(strategy: NavigationStrategy): void {
    this.strategy = strategy;
  }
}

// ============================================================================
// APPROACH 2: Pure Functional with Type-Safe State Transitions
// ============================================================================

/**
 * Pure Functional Approach with Explicit State Transitions
 *
 * Why:
 * - Immutability guarantees
 * - Easy to test (pure functions)
 * - Composable and predictable
 * - No hidden state or side effects
 *
 * Pros:
 * - Complete immutability
 * - Easy to reason about
 * - Time-travel debugging possible
 * - Concurrent/parallel execution safe
 *
 * Cons:
 * - Memory overhead (new objects)
 * - May be less intuitive for OOP developers
 * - Performance cost for large datasets
 */

type StateTransition = (state: PositionWithAim) => PositionWithAim;

const moveForward = (value: number): StateTransition => (state) => ({
  ...state,
  horizontal: state.horizontal + value
});

const moveDown = (value: number): StateTransition => (state) => ({
  ...state,
  depth: state.depth + value
});

const moveUp = (value: number): StateTransition => (state) => ({
  ...state,
  depth: state.depth - value
});

const increaseAim = (value: number): StateTransition => (state) => ({
  ...state,
  aim: state.aim + value
});

const decreaseAim = (value: number): StateTransition => (state) => ({
  ...state,
  aim: state.aim - value
});

const moveForwardWithAim = (value: number): StateTransition => (state) => ({
  ...state,
  horizontal: state.horizontal + value,
  depth: state.depth + state.aim * value
});

// Compose multiple state transitions (exported for potential use)
export const compose = (...fns: StateTransition[]): StateTransition =>
  (state) => fns.reduce((acc, fn) => fn(acc), state);

export const functionalNavigatePart1 = (commands: string[]): PositionWithAim => {
  const initialState: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };

  return commands.reduce((state, commandStr) => {
    const cmd = parseCommand(commandStr);

    const transitions: Record<string, StateTransition> = {
      forward: moveForward(cmd.value),
      down: moveDown(cmd.value),
      up: moveUp(cmd.value)
    };

    return transitions[cmd.direction](state);
  }, initialState);
};

export const functionalNavigatePart2 = (commands: string[]): PositionWithAim => {
  const initialState: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };

  return commands.reduce((state, commandStr) => {
    const cmd = parseCommand(commandStr);

    const transitions: Record<string, StateTransition> = {
      forward: moveForwardWithAim(cmd.value),
      down: increaseAim(cmd.value),
      up: decreaseAim(cmd.value)
    };

    return transitions[cmd.direction](state);
  }, initialState);
};

// ============================================================================
// APPROACH 3: Command Pattern with Command Objects
// ============================================================================

/**
 * Full Command Pattern Implementation
 *
 * Why:
 * - Classic GoF design pattern
 * - Supports undo/redo operations
 * - Command history tracking
 * - Macro commands (combine multiple commands)
 *
 * Pros:
 * - Can implement undo/redo
 * - Commands can be queued, logged, or serialized
 * - History tracking built-in
 * - Great for event sourcing
 *
 * Cons:
 * - Most complex solution
 * - Highest boilerplate
 * - Overkill unless undo/history needed
 */

interface ICommand {
  execute(state: PositionWithAim): PositionWithAim;
  undo(state: PositionWithAim): PositionWithAim;
}

export class ForwardCommand implements ICommand {
  constructor(private value: number) {}

  execute(state: PositionWithAim): PositionWithAim {
    return { ...state, horizontal: state.horizontal + this.value };
  }

  undo(state: PositionWithAim): PositionWithAim {
    return { ...state, horizontal: state.horizontal - this.value };
  }
}

export class DownCommand implements ICommand {
  constructor(private value: number) {}

  execute(state: PositionWithAim): PositionWithAim {
    return { ...state, depth: state.depth + this.value };
  }

  undo(state: PositionWithAim): PositionWithAim {
    return { ...state, depth: state.depth - this.value };
  }
}

export class UpCommand implements ICommand {
  constructor(private value: number) {}

  execute(state: PositionWithAim): PositionWithAim {
    return { ...state, depth: state.depth - this.value };
  }

  undo(state: PositionWithAim): PositionWithAim {
    return { ...state, depth: state.depth + this.value };
  }
}

export class CommandPatternSubmarine {
  private state: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private history: ICommand[] = [];

  executeCommand(command: ICommand): void {
    this.state = command.execute(this.state);
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      this.state = command.undo(this.state);
    }
  }

  getPosition(): PositionWithAim {
    return { ...this.state };
  }

  getHistory(): number {
    return this.history.length;
  }
}

// ============================================================================
// APPROACH 4: Functional Pipeline with Point-Free Style
// ============================================================================

/**
 * Point-Free Functional Programming Style
 *
 * Why:
 * - Tacit programming (functions without explicit parameters)
 * - Highly composable
 * - Declarative pipeline
 *
 * Pros:
 * - Very concise
 * - Highly reusable
 * - Easy to compose complex behaviors
 *
 * Cons:
 * - Can be hard to read for beginners
 * - Debugging can be challenging
 * - May sacrifice readability for elegance
 */

const processCommands = (part: 1 | 2) => (commands: string[]) =>
  commands
    .map(parseCommand)
    .reduce(
      (state, cmd) => {
        if (part === 1) {
          return {
            ...state,
            horizontal: cmd.direction === 'forward' ? state.horizontal + cmd.value : state.horizontal,
            depth: state.depth + (cmd.direction === 'down' ? cmd.value : cmd.direction === 'up' ? -cmd.value : 0)
          };
        } else {
          return cmd.direction === 'forward'
            ? { ...state, horizontal: state.horizontal + cmd.value, depth: state.depth + state.aim * cmd.value }
            : cmd.direction === 'down'
            ? { ...state, aim: state.aim + cmd.value }
            : { ...state, aim: state.aim - cmd.value };
        }
      },
      { horizontal: 0, depth: 0, aim: 0 } as PositionWithAim
    );

const calculateProduct = (state: PositionWithAim) => ({
  ...state,
  product: state.horizontal * state.depth
});

export const pipelineNavigate = (commands: string[], part: 1 | 2) => {
  const state = processCommands(part)(commands);
  return calculateProduct(state);
};
