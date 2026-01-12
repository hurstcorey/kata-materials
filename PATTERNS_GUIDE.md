# Complete Design Patterns Guide
## Submarine Kata - 13 Patterns with Pros, Cons, and Use Cases

This guide demonstrates **13 different design patterns** applied to the submarine navigation problem, with comprehensive analysis of when and why to use each approach.

---

## Table of Contents

1. [Object-Oriented Programming (OOP)](#1-object-oriented-programming-oop)
2. [Functional Programming with Reduce](#2-functional-programming-with-reduce)
3. [Strategy Pattern](#3-strategy-pattern)
4. [Command Pattern](#4-command-pattern)
5. [Pure Functional with State Transitions](#5-pure-functional-with-state-transitions)
6. [Functional Pipeline](#6-functional-pipeline)
7. [State Machine Pattern](#7-state-machine-pattern)
8. [Observer Pattern (Pub/Sub)](#8-observer-pattern-pubsub)
9. [Decorator Pattern](#9-decorator-pattern)
10. [Chain of Responsibility](#10-chain-of-responsibility)
11. [Builder Pattern](#11-builder-pattern)
12. [Factory Pattern](#12-factory-pattern)
13. [Memento Pattern](#13-memento-pattern)

---

## 1. Object-Oriented Programming (OOP)

**File:** `src/submarine.ts` - `SubmarinePart1`, `SubmarinePart2`

### Example

```typescript
const submarine = new SubmarinePart1();
submarine.executeCommand('forward 5');
submarine.executeCommand('down 3');
console.log(submarine.getResult()); // 0
```

### Pros

✅ **Most intuitive** - Natural mental model for beginners
✅ **Easy to debug** - Can inspect object state at any point
✅ **Familiar** - Most developers know OOP
✅ **Clear lifecycle** - Create → Use → Query
✅ **Stateful** - Maintains state across operations

### Cons

❌ **Mutable state** - Can lead to bugs from unexpected mutations
❌ **Not composable** - Hard to combine multiple objects
❌ **Not thread-safe** - Shared mutable state issues
❌ **Side effects** - Methods modify internal state

### When to Use

- **Learning/Teaching** - Best for beginners
- **Interactive systems** - Games, simulations, UI components
- **Step-by-step debugging** - Need to inspect state between operations
- **Team familiarity** - Team is comfortable with OOP
- **Stateful operations** - Operations depend on previous state

### When NOT to Use

- Concurrent/parallel processing needed
- Immutability is required
- Functional programming team
- Event sourcing architecture

---

## 2. Functional Programming with Reduce

**File:** `src/submarine.ts` - `calculateFinalPosition`

### Example

```typescript
const result = calculateFinalPosition(commands, 1);
console.log(result); // { horizontal: 15, depth: 10, product: 150 }
```

### Pros

✅ **Immutable** - No state mutation bugs
✅ **Pure functions** - Easy to test and reason about
✅ **Composable** - Easy to combine with other operations
✅ **Thread-safe** - Safe for concurrent execution
✅ **Predictable** - Same input always gives same output

### Cons

❌ **Memory overhead** - Creates new objects on each iteration
❌ **Less intuitive** - For developers unfamiliar with FP
❌ **Debugging** - Harder to inspect intermediate states
❌ **Performance** - May be slower for large datasets

### When to Use

- **Production code** - Safe, reliable, maintainable
- **Batch processing** - Process entire list at once
- **Data pipelines** - Transform data through stages
- **Concurrent systems** - Parallel processing needed
- **Functional teams** - Team prefers FP style

### When NOT to Use

- Interactive step-by-step processing
- Memory is severely constrained
- Performance is critical
- Team unfamiliar with FP

---

## 3. Strategy Pattern

**File:** `src/alternative-solutions.ts` - `StrategySubmarine`

### Example

```typescript
const submarine = new StrategySubmarine(new AimNavigationStrategy());
submarine.executeCommand('forward 5');

// Switch strategies at runtime!
submarine.setStrategy(new SimpleNavigationStrategy());
submarine.executeCommand('forward 5');
```

### Pros

✅ **Runtime flexibility** - Swap algorithms on the fly
✅ **Open/Closed Principle** - Add new strategies without modifying existing code
✅ **Testable** - Test strategies in isolation
✅ **Clear separation** - Algorithm decoupled from context
✅ **SOLID compliant** - Follows all SOLID principles

### Cons

❌ **Boilerplate** - More classes to write and maintain
❌ **Overkill** - For simple problems with few algorithms
❌ **Indirection** - Extra layer makes code harder to trace
❌ **Complexity** - More complex than direct implementation

### When to Use

- **Multiple algorithms** - Several ways to do the same thing
- **Runtime switching** - Algorithm changes based on conditions
- **Plugin architecture** - Users can provide custom strategies
- **Enterprise systems** - Need flexibility for business rules
- **A/B testing** - Switch between implementations

### When NOT to Use

- Only one algorithm will ever exist
- Algorithm never changes at runtime
- Simple implementation suffices
- Small, throwaway projects

**Real-World Examples:**
- Payment processing (credit card, PayPal, crypto)
- Sorting algorithms (quicksort, mergesort, heapsort)
- Compression (ZIP, GZIP, Brotli)
- Authentication (OAuth, JWT, SAML)

---

## 4. Command Pattern

**File:** `src/alternative-solutions.ts` - `CommandPatternSubmarine`

### Example

```typescript
const submarine = new CommandPatternSubmarine();
submarine.executeCommand(new ForwardCommand(5));
submarine.executeCommand(new DownCommand(3));
submarine.undo(); // Undo the last command!
```

### Pros

✅ **Undo/Redo** - Built-in support for undoing operations
✅ **Command history** - Track all commands executed
✅ **Queueing** - Commands can be queued for later execution
✅ **Macro commands** - Combine multiple commands
✅ **Audit trail** - Perfect for logging and compliance

### Cons

❌ **Most complex** - Highest code complexity
❌ **Most boilerplate** - Command class for each operation
❌ **Overkill** - Unless you need undo/redo or history
❌ **Memory overhead** - Storing command history

### When to Use

- **Undo/Redo required** - Text editors, drawing apps
- **Command queuing** - Job scheduling, message queues
- **Audit logging** - Financial systems, compliance
- **Transaction management** - Database transactions
- **Macro recording** - Record and replay user actions
- **Remote execution** - Send commands over network

### When NOT to Use

- No need for undo/redo
- No command history requirements
- Simple CRUD operations
- Performance is critical

**Real-World Examples:**
- Text editors (VS Code, Word)
- Graphics editors (Photoshop, Figma)
- Database transactions
- Job schedulers (Cron, Celery)
- Event sourcing systems

---

## 5. Pure Functional with State Transitions

**File:** `src/alternative-solutions.ts` - `functionalNavigatePart1/2`

### Example

```typescript
const finalState = functionalNavigatePart1(commands);
console.log(finalState); // { horizontal: 15, depth: 10, aim: 0 }
```

### Pros

✅ **Complete immutability** - No mutations whatsoever
✅ **Time-travel debugging** - Can replay state changes
✅ **Composable** - Easy to combine state transitions
✅ **Event sourcing ready** - Perfect for event-driven systems
✅ **Testable** - Pure functions are easy to test

### Cons

❌ **Memory overhead** - New state object for each transition
❌ **Verbose** - More code than imperative style
❌ **Learning curve** - Requires FP knowledge
❌ **Performance** - Slower for very large state objects

### When to Use

- **Event sourcing** - Store all state transitions
- **Audit requirements** - Need complete history
- **Redux-style state** - React/Redux applications
- **Functional architecture** - FP-first systems
- **Blockchain** - Immutable state transitions

### When NOT to Use

- Memory is constrained
- Performance is critical
- Team unfamiliar with FP
- Simple state management

**Real-World Examples:**
- Redux (React state management)
- Elm Architecture
- Blockchain transactions
- Event sourcing systems (EventStore)

---

## 6. Functional Pipeline

**File:** `src/alternative-solutions.ts` - `pipelineNavigate`

### Example

```typescript
const result = pipelineNavigate(commands, 1);
// Pipeline: parse → reduce → calculate product
```

### Pros

✅ **Declarative** - What, not how
✅ **Composable** - Easy to add pipeline stages
✅ **Readable** - Clear data flow
✅ **Testable** - Test each stage independently
✅ **Concise** - Less code than imperative

### Cons

❌ **Debugging** - Harder to debug pipeline
❌ **Stack traces** - Less clear error messages
❌ **Learning curve** - Requires FP knowledge
❌ **Performance** - Function call overhead

### When to Use

- **Data transformation** - ETL pipelines
- **Stream processing** - RxJS, Node streams
- **Middleware** - Express.js, Koa
- **Functional teams** - Team prefers FP
- **Clear data flow** - Input → Transform → Output

### When NOT to Use

- Complex branching logic
- Team unfamiliar with FP
- Need detailed debugging
- Performance critical

**Real-World Examples:**
- Unix pipes (`cat file.txt | grep error | sort`)
- RxJS operators (`map → filter → reduce`)
- Express.js middleware
- ETL data pipelines

---

## 7. State Machine Pattern

**File:** `src/advanced-patterns.ts` - `StateMachineSubmarine`

### Example

```typescript
const submarine = new StateMachineSubmarine();
console.log(submarine.getState()); // 'SURFACED'

submarine.executeCommand('down 1');
console.log(submarine.getState()); // 'DIVING'

// This throws an error - can't go up when surfaced!
submarine.executeCommand('up 1'); // Error!
```

### Pros

✅ **Explicit states** - All states are clearly defined
✅ **Validated transitions** - Invalid transitions prevented
✅ **Self-documenting** - State diagram is the code
✅ **Type-safe** - Compiler enforces valid states
✅ **Debuggable** - Always know current state

### Cons

❌ **State explosion** - Complex systems have many states
❌ **Rigid** - Hard to add dynamic behavior
❌ **Boilerplate** - State class for each state
❌ **Overkill** - For simple state management

### When to Use

- **Distinct operational modes** - System has clear states
- **State validation needed** - Invalid transitions must be prevented
- **UI workflows** - Multi-step forms, wizards
- **Game character states** - Idle, walking, running, jumping
- **Connection management** - Disconnected, connecting, connected
- **Order processing** - Draft, pending, approved, shipped

### When NOT to Use

- Simple boolean flags suffice
- State changes frequently
- No invalid transitions
- Dynamic state structure

**Real-World Examples:**
- TCP connection states (LISTEN, SYN_SENT, ESTABLISHED)
- Order processing (pending → processing → shipped → delivered)
- Game AI (patrol → chase → attack → flee)
- UI wizards (step 1 → step 2 → step 3 → complete)

---

## 8. Observer Pattern (Pub/Sub)

**File:** `src/advanced-patterns.ts` - `ObservableSubmarine`

### Example

```typescript
const submarine = new ObservableSubmarine();
const logger = new PositionLogger();
const alarm = new DepthAlarm(50);

const unsubscribe = submarine.subscribeToPosition(logger);
submarine.subscribeToPosition(alarm);

submarine.executeCommand('forward 5');
// Both logger and alarm are notified!

unsubscribe(); // Logger no longer notified
```

### Pros

✅ **Loose coupling** - Observers don't know about each other
✅ **Dynamic subscription** - Add/remove observers at runtime
✅ **Multiple observers** - Many observers for one subject
✅ **Event-driven** - Foundation of reactive programming
✅ **Separation of concerns** - Subject doesn't know observer details

### Cons

❌ **Memory leaks** - Forgetting to unsubscribe
❌ **Unpredictable order** - Observer notification order not guaranteed
❌ **Debugging** - Hard to track event flow
❌ **Performance** - Overhead with many observers

### When to Use

- **UI updates** - Model changes → UI updates (MVC, MVVM)
- **Event logging** - Log all events centrally
- **Real-time dashboards** - Multiple views of same data
- **Notification systems** - Email, SMS, push notifications
- **Analytics** - Track user actions
- **State synchronization** - Keep multiple components in sync

### When NOT to Use

- Simple callback suffices
- Only one observer
- Synchronous processing only
- Tight coupling is acceptable

**Real-World Examples:**
- React (component re-renders on state change)
- EventEmitter (Node.js)
- RxJS Observables
- DOM events (addEventListener)
- MVC frameworks

---

## 9. Decorator Pattern

**File:** `src/advanced-patterns.ts` - `LoggingDecorator`, `ValidationDecorator`, `TelemetryDecorator`

### Example

```typescript
let submarine = new BasicSubmarine();
submarine = new LoggingDecorator(submarine);
submarine = new ValidationDecorator(submarine, 100);
submarine = new TelemetryDecorator(submarine);

// All decorators are applied!
submarine.executeCommand('forward 5');
```

### Pros

✅ **Flexible** - Add/remove behavior at runtime
✅ **Open/Closed** - Add features without modifying original
✅ **Composable** - Stack multiple decorators
✅ **Single Responsibility** - Each decorator has one job
✅ **No subclass explosion** - Alternative to inheritance

### Cons

❌ **Many small classes** - Class for each decoration
❌ **Order matters** - Decorator order affects behavior
❌ **Complexity** - Can be hard to debug
❌ **Identity** - `instanceof` doesn't work as expected

### When to Use

- **Cross-cutting concerns** - Logging, caching, validation
- **Runtime behavior** - Add features conditionally
- **Middleware** - Request/response processing
- **I/O streams** - Buffered, compressed, encrypted
- **UI components** - Add borders, shadows, tooltips
- **API clients** - Add auth, retry, rate limiting

### When NOT to Use

- Behavior is static
- Only one feature to add
- Inheritance works fine
- Order independence is required

**Real-World Examples:**
- Java I/O streams (`BufferedReader`, `GZIPInputStream`)
- Express.js middleware
- React Higher-Order Components (HOCs)
- Python decorators (`@property`, `@staticmethod`)
- CSS (decorating HTML elements)

---

## 10. Chain of Responsibility

**File:** `src/advanced-patterns.ts` - `ChainOfResponsibilitySubmarine`

### Example

```typescript
const submarine = new ChainOfResponsibilitySubmarine({
  logging: true,
  maxSpeed: 50,
  maxDepth: 100
});

// Chain: Logging → Speed validation → Depth validation → Execution
submarine.executeCommand('forward 5');
```

### Pros

✅ **Decoupled** - Handlers don't know about each other
✅ **Flexible** - Easy to add/remove/reorder handlers
✅ **Single Responsibility** - Each handler has one job
✅ **Dynamic chain** - Build chain at runtime
✅ **Can stop processing** - Early termination

### Cons

❌ **No guarantee** - Request might not be handled
❌ **Debugging** - Hard to trace through chain
❌ **Performance** - Overhead of chain traversal
❌ **Implicit flow** - Not obvious who handles what

### When to Use

- **Request validation** - Multiple validation rules
- **Middleware systems** - Express, Koa, ASP.NET
- **Event bubbling** - DOM event propagation
- **Authorization** - Multiple auth checks
- **Logging pipeline** - Multiple loggers
- **HTTP request processing** - Multiple filters

### When NOT to Use

- Only one handler
- Handler must be known
- Order doesn't matter
- Simple if/else suffices

**Real-World Examples:**
- Express.js middleware chain
- Java Servlet Filters
- DOM event bubbling (capture/bubble phases)
- Spring Security filter chain
- AWS Lambda middleware (Middy)

---

## 11. Builder Pattern

**File:** `src/advanced-patterns.ts` - `SubmarineBuilder`

### Example

```typescript
const config = new SubmarineBuilder()
  .setInitialPosition(10, 20, 5)
  .setMaxDepth(500)
  .setMaxSpeed(50)
  .enableLogging()
  .addObserver(new PositionLogger())
  .build();

const submarine = new ConfigurableSubmarine(config);
```

### Pros

✅ **Fluent API** - Readable, chainable method calls
✅ **Immutable objects** - Builds immutable configurations
✅ **No telescoping constructors** - Avoid constructor with many parameters
✅ **Preset configurations** - Define common configurations
✅ **Validation** - Validate before building

### Cons

❌ **More code** - Builder class to maintain
❌ **Overkill** - For simple objects
❌ **Mutable builder** - Builder itself is mutable
❌ **Two objects** - Builder and product

### When to Use

- **Complex construction** - Many optional parameters
- **Immutable objects** - Enforce immutability
- **Configuration objects** - App configuration
- **Test data builders** - Create test fixtures
- **DSL creation** - Domain-specific languages
- **Fluent APIs** - jQuery-style chaining

### When NOT to Use

- Simple objects (< 5 parameters)
- Constructor works fine
- No optional parameters
- Object is mutable anyway

**Real-World Examples:**
- StringBuilder (Java, C#)
- jQuery method chaining
- Lodash chain
- SQL query builders (Knex.js, SQLAlchemy)
- Test data builders (Factory Bot)
- HTTP request builders (Axios, Fetch)

---

## 12. Factory Pattern

**File:** `src/advanced-patterns.ts` - `SubmarineFactory`

### Example

```typescript
const militarySub = SubmarineFactory.create(SubmarineType.MILITARY);
const researchSub = SubmarineFactory.create(SubmarineType.RESEARCH);

// Or by mission type
const combatSub = SubmarineFactory.createByMission('combat');

console.log(militarySub.getCapabilities()); // ['stealth', 'weapons', 'sonar']
console.log(researchSub.getCapabilities()); // ['deep-dive', 'sampling', 'sensors']
```

### Pros

✅ **Encapsulates creation** - Creation logic in one place
✅ **Loose coupling** - Client doesn't know concrete class
✅ **Easy to extend** - Add new types easily
✅ **Hides complexity** - Complex construction hidden
✅ **Dependency Inversion** - Depend on abstractions

### Cons

❌ **More abstraction** - Extra layer of indirection
❌ **Overkill** - For simple object creation
❌ **Rigidity** - Factory must know all types
❌ **Testing** - Hard to test with factory

### When to Use

- **Multiple product families** - Different types of related objects
- **Complex creation** - Object construction is complex
- **Hide implementation** - Client shouldn't know concrete classes
- **Plugin systems** - Load plugins dynamically
- **Dependency injection** - IoC containers
- **Testing** - Mock factories for tests

### When NOT to Use

- Simple `new` works fine
- Only one type exists
- No creation complexity
- Direct instantiation preferred

**Real-World Examples:**
- Database connection factories (MySQL, PostgreSQL, SQLite)
- UI component factories (Button, Input, Select)
- Vehicle factories (Car, Truck, Motorcycle)
- Document factories (PDF, Word, Excel)
- Logger factories (Console, File, Remote)

---

## 13. Memento Pattern

**File:** `src/advanced-patterns.ts` - `MementoSubmarine`, `SubmarineCaretaker`

### Example

```typescript
const submarine = new MementoSubmarine();
const caretaker = new SubmarineCaretaker();

caretaker.save(submarine); // Save initial state
submarine.executeCommand('forward 5');
caretaker.save(submarine); // Save after command

caretaker.undo(submarine); // Undo!
console.log(submarine.getPosition()); // Back to initial state

caretaker.redo(submarine); // Redo!
console.log(submarine.getPosition()); // Forward again
```

### Pros

✅ **State snapshots** - Save/restore complete state
✅ **Undo/Redo** - Built-in undo/redo functionality
✅ **Encapsulation** - Internal state stays private
✅ **Time-travel** - Jump to any previous state
✅ **History tracking** - Complete state history

### Cons

❌ **Memory overhead** - Stores entire state for each snapshot
❌ **Complex caretaker** - Managing mementos can be complex
❌ **Expensive** - For large objects
❌ **Serialization** - May need custom serialization

### When to Use

- **Undo/Redo** - Text editors, drawing apps
- **State snapshots** - Game save states
- **Checkpointing** - Long-running computations
- **Transaction rollback** - Database transactions
- **Version history** - Document versions
- **Audit trail** - Compliance requirements

### When NOT to Use

- Memory is constrained
- State is large and complex
- No undo requirements
- State is derived/computed

**Real-World Examples:**
- Text editors (Ctrl+Z / Ctrl+Y)
- Git commits (state snapshots)
- Database savepoints
- Game save states
- Browser history (back/forward)
- Photoshop history panel

---

## Comparison Matrix

| Pattern | Complexity | Flexibility | Testability | Performance | Use Frequency |
|---------|-----------|-------------|-------------|-------------|---------------|
| **OOP Class** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Functional Reduce** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Strategy** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Command** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Pure Functional** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Pipeline** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **State Machine** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Observer** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Decorator** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Chain of Responsibility** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Builder** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Factory** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Memento** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## Pattern Categories

### **Creational Patterns** (Object Creation)
- **Factory Pattern** - Create objects without specifying exact class
- **Builder Pattern** - Construct complex objects step-by-step

### **Structural Patterns** (Object Composition)
- **Decorator Pattern** - Add behavior dynamically
- **Strategy Pattern** - Encapsulate algorithms

### **Behavioral Patterns** (Object Interaction)
- **Observer Pattern** - Subscribe to events
- **Command Pattern** - Encapsulate requests
- **State Machine Pattern** - Manage object states
- **Chain of Responsibility** - Pass requests along chain
- **Memento Pattern** - Save/restore state

### **Paradigm Patterns** (Programming Style)
- **OOP Class** - Object-oriented approach
- **Functional Reduce** - Functional programming
- **Pure Functional** - Pure FP with state transitions
- **Pipeline** - Functional composition

---

## Decision Tree

### Start Here: What's Your Main Goal?

```
Do you need UNDO/REDO?
├─ YES → Command Pattern or Memento Pattern
└─ NO  → Continue...

Do you have MULTIPLE ALGORITHMS for the same operation?
├─ YES → Strategy Pattern
└─ NO  → Continue...

Do you need to NOTIFY MULTIPLE COMPONENTS when state changes?
├─ YES → Observer Pattern
└─ NO  → Continue...

Do you need to ADD BEHAVIOR DYNAMICALLY?
├─ YES → Decorator Pattern
└─ NO  → Continue...

Do you have DISTINCT OPERATIONAL STATES with rules?
├─ YES → State Machine Pattern
└─ NO  → Continue...

Do you need VALIDATION/MIDDLEWARE PIPELINE?
├─ YES → Chain of Responsibility
└─ NO  → Continue...

Is OBJECT CREATION COMPLEX with many options?
├─ YES → Builder Pattern
└─ NO  → Continue...

Do you need to CREATE DIFFERENT TYPES of objects?
├─ YES → Factory Pattern
└─ NO  → Continue...

Is your team FUNCTIONAL PROGRAMMING focused?
├─ YES → Functional Reduce or Pure Functional or Pipeline
└─ NO  → OOP Class (default choice)
```

---

## Best Practices

### 1. Start Simple

Always start with the simplest pattern (usually OOP or Functional Reduce). Add complexity only when needed.

### 2. Know Your Team

Choose patterns your team understands. A complex pattern poorly understood is worse than a simple pattern well understood.

### 3. Consider Maintenance

Will someone else maintain this code? Choose readability over cleverness.

### 4. Performance Second

Don't optimize prematurely. All these patterns are fast enough for most use cases.

### 5. Combine Patterns

Real systems often combine multiple patterns. Example:
- Factory + Strategy + Observer
- Builder + Decorator + Chain of Responsibility

### 6. Test Everything

All patterns benefit from comprehensive testing. TDD helps regardless of pattern choice.

---

## Conclusion

**There is no "best" pattern.** The right pattern depends on:

1. **Requirements** - What do you need to accomplish?
2. **Team** - What does your team know?
3. **Context** - What's your environment?
4. **Trade-offs** - What can you sacrifice?

The **journey of understanding trade-offs** is more valuable than finding "the answer."

Use this guide as a reference, not a prescription. Master the fundamentals first, then apply patterns when they solve real problems.

---

## Further Learning

### Books
- **Design Patterns** (Gang of Four) - Original patterns book
- **Head First Design Patterns** - Easy introduction
- **Refactoring** (Martin Fowler) - When to apply patterns
- **Clean Architecture** (Robert C. Martin) - Architectural patterns

### Online Resources
- [Refactoring Guru](https://refactoring.guru/design-patterns) - Visual pattern guide
- [Source Making](https://sourcemaking.com/design_patterns) - Pattern tutorials
- [Game Programming Patterns](https://gameprogrammingpatterns.com/) - Patterns in games

### Practice
- Implement each pattern yourself
- Try combining patterns
- Read open-source code
- Refactor existing code to use patterns
