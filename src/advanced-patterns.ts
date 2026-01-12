/**
 * Advanced Design Patterns for Submarine Kata
 *
 * This file demonstrates additional GoF and architectural patterns
 * applied to the submarine navigation problem.
 */

import { Command, PositionWithAim, parseCommand } from './submarine';

// ============================================================================
// PATTERN 1: State Machine Pattern
// ============================================================================

/**
 * State Machine Pattern
 *
 * Why:
 * - Models submarine operational states explicitly
 * - Enforces valid state transitions
 * - Encapsulates state-specific behavior
 * - Prevents invalid operations
 *
 * Pros:
 * - Clear state modeling
 * - Type-safe state transitions
 * - Easy to visualize and understand
 * - Prevents invalid state bugs
 * - Self-documenting state flow
 *
 * Cons:
 * - More complex for simple cases
 * - State explosion for complex systems
 * - More boilerplate code
 * - Can be rigid for dynamic behavior
 *
 * When to Use:
 * - System has distinct operational modes
 * - State transitions need validation
 * - Different behavior per state
 * - UI workflows (forms, wizards)
 * - Game character states
 * - Connection state management
 */

enum SubmarineState {
  SURFACED = 'SURFACED',
  DIVING = 'DIVING',
  CRUISING = 'CRUISING',
  ASCENDING = 'ASCENDING',
  EMERGENCY = 'EMERGENCY'
}

interface StateContext {
  currentState: SubmarineState;
  position: PositionWithAim;
}

abstract class NavigationState {
  abstract canExecute(command: Command): boolean;
  abstract execute(command: Command, context: StateContext): StateContext;
  abstract getNextState(command: Command): SubmarineState;
}

class SurfacedState extends NavigationState {
  canExecute(command: Command): boolean {
    // Can only go down or forward when surfaced
    return command.direction === 'forward' || command.direction === 'down';
  }

  execute(command: Command, context: StateContext): StateContext {
    if (!this.canExecute(command)) {
      throw new Error('Cannot go up when surfaced');
    }

    const newPosition = { ...context.position };
    if (command.direction === 'forward') {
      newPosition.horizontal += command.value;
    } else {
      newPosition.aim += command.value;
    }

    return {
      currentState: this.getNextState(command),
      position: newPosition
    };
  }

  getNextState(command: Command): SubmarineState {
    return command.direction === 'down' ? SubmarineState.DIVING : SubmarineState.SURFACED;
  }
}

class CruisingState extends NavigationState {
  canExecute(_command: Command): boolean {
    return true; // Can do anything while cruising
  }

  execute(command: Command, context: StateContext): StateContext {
    const newPosition = { ...context.position };

    switch (command.direction) {
      case 'forward':
        newPosition.horizontal += command.value;
        newPosition.depth += newPosition.aim * command.value;
        break;
      case 'down':
        newPosition.aim += command.value;
        break;
      case 'up':
        newPosition.aim -= command.value;
        break;
    }

    return {
      currentState: this.getNextState(command),
      position: newPosition
    };
  }

  getNextState(command: Command): SubmarineState {
    if (command.direction === 'up' && command.value > 5) {
      return SubmarineState.ASCENDING;
    }
    if (command.direction === 'down' && command.value > 5) {
      return SubmarineState.DIVING;
    }
    return SubmarineState.CRUISING;
  }
}

export class StateMachineSubmarine {
  private context: StateContext;
  private states: Map<SubmarineState, NavigationState>;

  constructor() {
    this.context = {
      currentState: SubmarineState.SURFACED,
      position: { horizontal: 0, depth: 0, aim: 0 }
    };

    this.states = new Map([
      [SubmarineState.SURFACED, new SurfacedState()],
      [SubmarineState.CRUISING, new CruisingState()],
      [SubmarineState.DIVING, new CruisingState()],
      [SubmarineState.ASCENDING, new CruisingState()]
    ]);
  }

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);
    const currentState = this.states.get(this.context.currentState);

    if (!currentState) {
      throw new Error(`Unknown state: ${this.context.currentState}`);
    }

    if (!currentState.canExecute(command)) {
      throw new Error(`Cannot execute ${command.direction} in state ${this.context.currentState}`);
    }

    this.context = currentState.execute(command, this.context);
  }

  getState(): SubmarineState {
    return this.context.currentState;
  }

  getPosition(): PositionWithAim {
    return { ...this.context.position };
  }

  getResult(): number {
    return this.context.position.horizontal * this.context.position.depth;
  }
}

// ============================================================================
// PATTERN 2: Observer Pattern
// ============================================================================

/**
 * Observer Pattern (Pub/Sub)
 *
 * Why:
 * - Decouples observers from subject
 * - Multiple subscribers to position changes
 * - Event-driven architecture
 * - Reactive programming foundation
 *
 * Pros:
 * - Loose coupling between components
 * - Dynamic subscription/unsubscription
 * - Multiple observers can react independently
 * - Supports event-driven architecture
 * - Easy to add new observers
 *
 * Cons:
 * - Memory leaks if not unsubscribed
 * - Order of notification is unpredictable
 * - Debugging can be difficult
 * - Performance overhead with many observers
 *
 * When to Use:
 * - UI updates based on model changes
 * - Event logging and analytics
 * - Real-time dashboards
 * - Notification systems
 * - State synchronization across components
 * - MVC/MVVM patterns
 */

interface PositionObserver {
  onPositionChanged(position: PositionWithAim): void;
}

interface CommandObserver {
  onCommandExecuted(command: Command): void;
}

export class ObservableSubmarine {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private positionObservers: Set<PositionObserver> = new Set();
  private commandObservers: Set<CommandObserver> = new Set();

  subscribeToPosition(observer: PositionObserver): () => void {
    this.positionObservers.add(observer);
    // Return unsubscribe function
    return () => this.positionObservers.delete(observer);
  }

  subscribeToCommands(observer: CommandObserver): () => void {
    this.commandObservers.add(observer);
    return () => this.commandObservers.delete(observer);
  }

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    // Execute command
    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }

    // Notify all observers
    this.notifyPositionObservers();
    this.notifyCommandObservers(command);
  }

  private notifyPositionObservers(): void {
    const position = { ...this.position };
    this.positionObservers.forEach(observer => {
      observer.onPositionChanged(position);
    });
  }

  private notifyCommandObservers(command: Command): void {
    this.commandObservers.forEach(observer => {
      observer.onCommandExecuted(command);
    });
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }
}

// Example observers
export class PositionLogger implements PositionObserver {
  private log: PositionWithAim[] = [];

  onPositionChanged(position: PositionWithAim): void {
    this.log.push({ ...position });
  }

  getLog(): PositionWithAim[] {
    return [...this.log];
  }
}

export class DepthAlarm implements PositionObserver {
  private alarmTriggered = false;
  constructor(private maxDepth: number) {}

  onPositionChanged(position: PositionWithAim): void {
    if (position.depth > this.maxDepth) {
      this.alarmTriggered = true;
    }
  }

  isAlarmTriggered(): boolean {
    return this.alarmTriggered;
  }
}

// ============================================================================
// PATTERN 3: Decorator Pattern
// ============================================================================

/**
 * Decorator Pattern
 *
 * Why:
 * - Add behavior dynamically without modifying original class
 * - Compose multiple decorators
 * - Alternative to subclassing
 * - Single Responsibility Principle
 *
 * Pros:
 * - Flexible alternative to inheritance
 * - Add/remove behavior at runtime
 * - Compose multiple decorators
 * - Each decorator has single responsibility
 * - Open/Closed Principle compliant
 *
 * Cons:
 * - Many small classes
 * - Decoration order matters
 * - Can be complex to debug
 * - Identity comparison issues
 *
 * When to Use:
 * - Add logging to existing classes
 * - Add caching, validation, security
 * - Input/output stream wrappers
 * - Middleware pipelines
 * - Cross-cutting concerns
 * - UI component enhancement
 */

interface SubmarineInterface {
  executeCommand(commandStr: string): void;
  getPosition(): PositionWithAim;
  getResult(): number;
}

class BasicSubmarine implements SubmarineInterface {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }
}

// Base decorator
abstract class SubmarineDecorator implements SubmarineInterface {
  constructor(protected submarine: SubmarineInterface) {}

  executeCommand(commandStr: string): void {
    this.submarine.executeCommand(commandStr);
  }

  getPosition(): PositionWithAim {
    return this.submarine.getPosition();
  }

  getResult(): number {
    return this.submarine.getResult();
  }
}

// Logging decorator
export class LoggingDecorator extends SubmarineDecorator {
  private commandLog: string[] = [];

  executeCommand(commandStr: string): void {
    this.commandLog.push(`Executing: ${commandStr}`);
    super.executeCommand(commandStr);
    const pos = this.getPosition();
    this.commandLog.push(`Position: (${pos.horizontal}, ${pos.depth})`);
  }

  getCommandLog(): string[] {
    return [...this.commandLog];
  }
}

// Validation decorator
export class ValidationDecorator extends SubmarineDecorator {
  constructor(submarine: SubmarineInterface, private maxDepth: number) {
    super(submarine);
  }

  executeCommand(commandStr: string): void {
    super.executeCommand(commandStr);

    const pos = this.getPosition();
    if (pos.depth > this.maxDepth) {
      throw new Error(`Depth limit exceeded: ${pos.depth} > ${this.maxDepth}`);
    }
  }
}

// Caching decorator
export class CachingDecorator extends SubmarineDecorator {
  private cache = new Map<string, PositionWithAim>();

  executeCommand(commandStr: string): void {
    if (this.cache.has(commandStr)) {
      // In real scenario, would restore cached state
      return;
    }

    super.executeCommand(commandStr);
    this.cache.set(commandStr, this.getPosition());
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Telemetry decorator
export class TelemetryDecorator extends SubmarineDecorator {
  private commandCount = 0;
  private totalDistance = 0;

  executeCommand(commandStr: string): void {
    const beforePos = this.getPosition();
    super.executeCommand(commandStr);
    const afterPos = this.getPosition();

    this.commandCount++;
    this.totalDistance += Math.abs(afterPos.horizontal - beforePos.horizontal);
  }

  getCommandCount(): number {
    return this.commandCount;
  }

  getTotalDistance(): number {
    return this.totalDistance;
  }
}

// Factory function to compose decorators
export function createDecoratedSubmarine(
  options: {
    logging?: boolean;
    validation?: { maxDepth: number };
    caching?: boolean;
    telemetry?: boolean;
  } = {}
): SubmarineInterface & {
  getCommandLog?: () => string[];
  getCacheSize?: () => number;
  getCommandCount?: () => number;
  getTotalDistance?: () => number;
} {
  let submarine: any = new BasicSubmarine();

  if (options.logging) {
    submarine = new LoggingDecorator(submarine);
  }

  if (options.validation) {
    submarine = new ValidationDecorator(submarine, options.validation.maxDepth);
  }

  if (options.caching) {
    submarine = new CachingDecorator(submarine);
  }

  if (options.telemetry) {
    submarine = new TelemetryDecorator(submarine);
  }

  return submarine;
}

// ============================================================================
// PATTERN 4: Chain of Responsibility
// ============================================================================

/**
 * Chain of Responsibility Pattern
 *
 * Why:
 * - Decouple senders from receivers
 * - Multiple handlers can process request
 * - Dynamic chain configuration
 * - Single Responsibility per handler
 *
 * Pros:
 * - Reduced coupling
 * - Flexible handler assignment
 * - Easy to add new handlers
 * - Each handler has single responsibility
 * - Can stop or continue chain
 *
 * Cons:
 * - No guarantee request is handled
 * - Debugging can be difficult
 * - Performance overhead
 * - Implicit handling flow
 *
 * When to Use:
 * - Request validation pipeline
 * - Middleware systems
 * - Event bubbling
 * - Authorization chains
 * - Logging and filtering
 * - HTTP request processing
 */

interface CommandHandler {
  setNext(handler: CommandHandler): CommandHandler;
  handle(command: Command, position: PositionWithAim): PositionWithAim;
}

abstract class BaseHandler implements CommandHandler {
  private nextHandler?: CommandHandler;

  setNext(handler: CommandHandler): CommandHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(command: Command, position: PositionWithAim): PositionWithAim {
    if (this.nextHandler) {
      return this.nextHandler.handle(command, position);
    }
    return position;
  }
}

// Validation handler
class DepthLimitHandler extends BaseHandler {
  constructor(private maxDepth: number) {
    super();
  }

  handle(command: Command, position: PositionWithAim): PositionWithAim {
    // Predict depth after command execution
    let predictedDepth = position.depth;
    if (command.direction === 'forward') {
      predictedDepth += position.aim * command.value;
    }

    if (predictedDepth > this.maxDepth) {
      throw new Error(`Depth limit would be exceeded: ${predictedDepth}`);
    }
    return super.handle(command, position);
  }
}

// Speed limit handler
class SpeedLimitHandler extends BaseHandler {
  constructor(private maxSpeed: number) {
    super();
  }

  handle(command: Command, position: PositionWithAim): PositionWithAim {
    if (command.direction === 'forward' && command.value > this.maxSpeed) {
      throw new Error(`Speed limit exceeded: ${command.value} > ${this.maxSpeed}`);
    }
    return super.handle(command, position);
  }
}

// Logging handler
class LoggingHandler extends BaseHandler {
  private logs: string[] = [];

  handle(command: Command, position: PositionWithAim): PositionWithAim {
    this.logs.push(`Processing ${command.direction} ${command.value} at (${position.horizontal}, ${position.depth})`);
    return super.handle(command, position);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// Execution handler (end of chain)
class ExecutionHandler extends BaseHandler {
  handle(command: Command, position: PositionWithAim): PositionWithAim {
    const newPosition = { ...position };

    switch (command.direction) {
      case 'forward':
        newPosition.horizontal += command.value;
        newPosition.depth += newPosition.aim * command.value;
        break;
      case 'down':
        newPosition.aim += command.value;
        break;
      case 'up':
        newPosition.aim -= command.value;
        break;
    }

    return super.handle(command, newPosition);
  }
}

export class ChainOfResponsibilitySubmarine {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private chain: CommandHandler;
  private loggingHandler?: LoggingHandler;

  constructor(options: { maxDepth?: number; maxSpeed?: number; logging?: boolean } = {}) {
    // Build the chain
    const execution = new ExecutionHandler();
    let currentHandler: CommandHandler = execution;

    if (options.maxSpeed) {
      const speedLimit = new SpeedLimitHandler(options.maxSpeed);
      speedLimit.setNext(currentHandler);
      currentHandler = speedLimit;
    }

    if (options.maxDepth) {
      const depthLimit = new DepthLimitHandler(options.maxDepth);
      depthLimit.setNext(currentHandler);
      currentHandler = depthLimit;
    }

    if (options.logging) {
      this.loggingHandler = new LoggingHandler();
      this.loggingHandler.setNext(currentHandler);
      currentHandler = this.loggingHandler;
    }

    this.chain = currentHandler;
  }

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);
    this.position = this.chain.handle(command, this.position);
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }

  getLogs(): string[] {
    return this.loggingHandler?.getLogs() || [];
  }
}

// ============================================================================
// PATTERN 5: Builder Pattern
// ============================================================================

/**
 * Builder Pattern
 *
 * Why:
 * - Construct complex objects step-by-step
 * - Different representations with same construction
 * - Immutable object creation
 * - Fluent interface
 *
 * Pros:
 * - Clear object construction process
 * - Fluent/chainable API
 * - Immutable objects
 * - Avoids telescoping constructors
 * - Can create different representations
 *
 * Cons:
 * - More code (builder class)
 * - Overkill for simple objects
 * - Mutable builder for immutable object
 *
 * When to Use:
 * - Complex object construction
 * - Many optional parameters
 * - Immutable object creation
 * - Configuration objects
 * - Test data builders
 * - Query builders
 */

export interface SubmarineConfig {
  readonly initialPosition: PositionWithAim;
  readonly maxDepth: number;
  readonly maxSpeed: number;
  readonly enableLogging: boolean;
  readonly enableTelemetry: boolean;
  readonly observers: PositionObserver[];
  readonly validationRules: Array<(cmd: Command, pos: PositionWithAim) => void>;
}

export class SubmarineBuilder {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private maxDepth: number = 1000;
  private maxSpeed: number = 100;
  private logging: boolean = false;
  private telemetry: boolean = false;
  private observers: PositionObserver[] = [];
  private validationRules: Array<(cmd: Command, pos: PositionWithAim) => void> = [];

  setInitialPosition(horizontal: number, depth: number, aim: number = 0): this {
    this.position = { horizontal, depth, aim };
    return this;
  }

  setMaxDepth(maxDepth: number): this {
    this.maxDepth = maxDepth;
    return this;
  }

  setMaxSpeed(maxSpeed: number): this {
    this.maxSpeed = maxSpeed;
    return this;
  }

  enableLogging(): this {
    this.logging = true;
    return this;
  }

  enableTelemetry(): this {
    this.telemetry = true;
    return this;
  }

  addObserver(observer: PositionObserver): this {
    this.observers.push(observer);
    return this;
  }

  addValidationRule(rule: (cmd: Command, pos: PositionWithAim) => void): this {
    this.validationRules.push(rule);
    return this;
  }

  // Preset configurations
  surfaceMode(): this {
    return this.setInitialPosition(0, 0, 0)
      .setMaxDepth(0)
      .setMaxSpeed(50);
  }

  deepDiveMode(): this {
    return this.setInitialPosition(0, 100, 10)
      .setMaxDepth(5000)
      .setMaxSpeed(20);
  }

  testMode(): this {
    return this.enableLogging()
      .enableTelemetry()
      .setMaxDepth(100)
      .setMaxSpeed(50);
  }

  build(): SubmarineConfig {
    return {
      initialPosition: { ...this.position },
      maxDepth: this.maxDepth,
      maxSpeed: this.maxSpeed,
      enableLogging: this.logging,
      enableTelemetry: this.telemetry,
      observers: [...this.observers],
      validationRules: [...this.validationRules]
    };
  }
}

export class ConfigurableSubmarine {
  private position: PositionWithAim;
  private config: SubmarineConfig;
  private commandLog: string[] = [];
  private commandCount: number = 0;

  constructor(config: SubmarineConfig) {
    this.config = config;
    this.position = { ...config.initialPosition };
  }

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    // Run validation rules
    this.config.validationRules.forEach(rule => rule(command, this.position));

    // Check max speed
    if (command.direction === 'forward' && command.value > this.config.maxSpeed) {
      throw new Error(`Speed limit exceeded: ${command.value} > ${this.config.maxSpeed}`);
    }

    // Execute command
    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }

    // Check max depth after execution
    if (this.position.depth > this.config.maxDepth) {
      throw new Error(`Depth limit exceeded: ${this.position.depth} > ${this.config.maxDepth}`);
    }

    // Logging
    if (this.config.enableLogging) {
      this.commandLog.push(commandStr);
    }

    // Telemetry
    if (this.config.enableTelemetry) {
      this.commandCount++;
    }

    // Notify observers
    this.config.observers.forEach(observer => {
      observer.onPositionChanged(this.position);
    });
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }

  getCommandLog(): string[] {
    return [...this.commandLog];
  }

  getCommandCount(): number {
    return this.commandCount;
  }
}

// ============================================================================
// PATTERN 6: Factory Pattern (Abstract Factory)
// ============================================================================

/**
 * Factory Pattern
 *
 * Why:
 * - Encapsulate object creation
 * - Create families of related objects
 * - Decouple creation from usage
 * - Dependency Inversion Principle
 *
 * Pros:
 * - Loose coupling
 * - Single place for creation logic
 * - Easy to add new types
 * - Hides complexity
 * - Consistent object families
 *
 * Cons:
 * - Can be overkill for simple cases
 * - More classes and abstraction
 * - Indirection
 *
 * When to Use:
 * - Multiple product families
 * - Object creation is complex
 * - Need to hide creation details
 * - Plugin systems
 * - Dependency injection
 * - Testing (mock factories)
 */

export enum SubmarineType {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  MILITARY = 'MILITARY',
  RESEARCH = 'RESEARCH'
}

export interface ISubmarine {
  executeCommand(commandStr: string): void;
  getPosition(): PositionWithAim;
  getResult(): number;
  getType(): SubmarineType;
  getCapabilities(): string[];
}

class MilitarySubmarine implements ISubmarine {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private readonly maxDepth = 1000;
  private readonly maxSpeed = 50;

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    // Military submarine has speed and depth limits
    if (command.direction === 'forward' && command.value > this.maxSpeed) {
      throw new Error('Military speed limit exceeded');
    }

    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }

    if (this.position.depth > this.maxDepth) {
      throw new Error('Military depth limit exceeded');
    }
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }

  getType(): SubmarineType {
    return SubmarineType.MILITARY;
  }

  getCapabilities(): string[] {
    return ['stealth', 'weapons', 'sonar'];
  }
}

class ResearchSubmarine implements ISubmarine {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };
  private readonly maxDepth = 5000; // Can go much deeper
  private samples: number = 0;

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        // Research submarine collects samples
        if (this.position.depth > 100) {
          this.samples++;
        }
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }

    if (this.position.depth > this.maxDepth) {
      throw new Error('Research depth limit exceeded');
    }
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }

  getType(): SubmarineType {
    return SubmarineType.RESEARCH;
  }

  getCapabilities(): string[] {
    return ['deep-dive', 'sampling', 'sensors', 'cameras'];
  }

  getSampleCount(): number {
    return this.samples;
  }
}

export class SubmarineFactory {
  static create(type: SubmarineType): ISubmarine {
    switch (type) {
      case SubmarineType.MILITARY:
        return new MilitarySubmarine();
      case SubmarineType.RESEARCH:
        return new ResearchSubmarine();
      case SubmarineType.BASIC:
      case SubmarineType.ADVANCED:
        // For now, return basic implementation
        return new MilitarySubmarine(); // Simplified
      default:
        throw new Error(`Unknown submarine type: ${type}`);
    }
  }

  static createByMission(mission: 'combat' | 'exploration' | 'training'): ISubmarine {
    switch (mission) {
      case 'combat':
        return SubmarineFactory.create(SubmarineType.MILITARY);
      case 'exploration':
        return SubmarineFactory.create(SubmarineType.RESEARCH);
      case 'training':
        return SubmarineFactory.create(SubmarineType.BASIC);
      default:
        throw new Error(`Unknown mission: ${mission}`);
    }
  }
}

// ============================================================================
// PATTERN 7: Memento Pattern
// ============================================================================

/**
 * Memento Pattern
 *
 * Why:
 * - Save and restore object state
 * - Undo/redo functionality
 * - Snapshot creation
 * - Encapsulation preservation
 *
 * Pros:
 * - Encapsulation not violated
 * - Simplifies originator
 * - State history management
 * - Time-travel debugging
 *
 * Cons:
 * - Memory overhead
 * - Caretaker management complexity
 * - Expensive for large objects
 *
 * When to Use:
 * - Undo/redo operations
 * - State snapshots
 * - Checkpointing
 * - Transaction rollback
 * - Game save states
 * - Document version history
 */

class SubmarineMemento {
  constructor(
    private readonly position: PositionWithAim,
    private readonly timestamp: Date
  ) {}

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

export class MementoSubmarine {
  private position: PositionWithAim = { horizontal: 0, depth: 0, aim: 0 };

  executeCommand(commandStr: string): void {
    const command = parseCommand(commandStr);

    switch (command.direction) {
      case 'forward':
        this.position.horizontal += command.value;
        this.position.depth += this.position.aim * command.value;
        break;
      case 'down':
        this.position.aim += command.value;
        break;
      case 'up':
        this.position.aim -= command.value;
        break;
    }
  }

  save(): SubmarineMemento {
    return new SubmarineMemento({ ...this.position }, new Date());
  }

  restore(memento: SubmarineMemento): void {
    this.position = memento.getPosition();
  }

  getPosition(): PositionWithAim {
    return { ...this.position };
  }

  getResult(): number {
    return this.position.horizontal * this.position.depth;
  }
}

export class SubmarineCaretaker {
  private mementos: SubmarineMemento[] = [];
  private currentIndex: number = -1;

  save(submarine: MementoSubmarine): void {
    // Remove any mementos after current index (for redo branch clearing)
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);

    const memento = submarine.save();
    this.mementos.push(memento);
    this.currentIndex++;
  }

  undo(submarine: MementoSubmarine): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      submarine.restore(this.mementos[this.currentIndex]);
      return true;
    }
    return false;
  }

  redo(submarine: MementoSubmarine): boolean {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      submarine.restore(this.mementos[this.currentIndex]);
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.mementos.length - 1;
  }

  getHistory(): Array<{ position: PositionWithAim; timestamp: Date }> {
    return this.mementos.map(m => ({
      position: m.getPosition(),
      timestamp: m.getTimestamp()
    }));
  }
}
