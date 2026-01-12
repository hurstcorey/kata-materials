# Quick Pattern Reference Guide

## All 13 Patterns at a Glance

| # | Pattern | Code Example | Best For | Avoid When |
|---|---------|-------------|----------|------------|
| 1 | **OOP Class** | `new SubmarinePart1()` | Learning, debugging | Need immutability |
| 2 | **Functional Reduce** | `calculateFinalPosition(cmds, 1)` | Production, pipelines | Team unfamiliar with FP |
| 3 | **Strategy** | `new StrategySubmarine(strategy)` | Multiple algorithms | Only one algorithm |
| 4 | **Command** | `sub.executeCommand(new ForwardCommand(5))` | Undo/redo needed | No history requirements |
| 5 | **Pure Functional** | `functionalNavigatePart1(cmds)` | Event sourcing | Memory constrained |
| 6 | **Pipeline** | `pipelineNavigate(cmds, 1)` | Data transformation | Complex branching |
| 7 | **State Machine** | `sub.getState() // 'SURFACED'` | Distinct states | Simple boolean flags |
| 8 | **Observer** | `sub.subscribeToPosition(logger)` | Event-driven UI | Only one listener |
| 9 | **Decorator** | `new LoggingDecorator(submarine)` | Add features dynamically | Static behavior |
| 10 | **Chain of Responsibility** | `new ChainOfResponsibilitySubmarine({...})` | Validation pipeline | Only one validator |
| 11 | **Builder** | `new SubmarineBuilder().setMaxDepth(500).build()` | Complex configuration | Simple objects |
| 12 | **Factory** | `SubmarineFactory.create(SubmarineType.MILITARY)` | Multiple types | Only one type |
| 13 | **Memento** | `caretaker.undo(submarine)` | Undo/redo | Memory constrained |

---

## Complexity vs Flexibility

```
      High Flexibility
            │
    Command │  Strategy
    Memento │  Decorator
            │  Observer
            │  Chain of Resp
   Builder  │  Pure Functional
            │  Factory
   Pipeline │  State Machine
            │  Functional Reduce
   OOP      │
            │
      Low Complexity ────────────► High Complexity
```

---

## Pattern Selection Flowchart

```
START: What do you need?

┌─ Undo/Redo?
│  ├─ With history → Memento
│  └─ With commands → Command
│
├─ Multiple algorithms?
│  └─ Yes → Strategy
│
├─ Notify multiple components?
│  └─ Yes → Observer
│
├─ Add behavior dynamically?
│  └─ Yes → Decorator
│
├─ Validation pipeline?
│  └─ Yes → Chain of Responsibility
│
├─ Complex configuration?
│  └─ Yes → Builder
│
├─ Create different types?
│  └─ Yes → Factory
│
├─ Distinct operational states?
│  └─ Yes → State Machine
│
├─ Functional programming?
│  ├─ Pure FP → Pure Functional
│  ├─ Data flow → Pipeline
│  └─ Simple → Functional Reduce
│
└─ Default choice → OOP Class
```

---

## Real-World Application Map

### Web Development
- **Observer** → React components, Vue reactivity
- **Decorator** → Express middleware, HOCs
- **Chain of Responsibility** → Express middleware pipeline
- **Builder** → API request builders (Axios)
- **Factory** → Component factories

### Backend/API
- **Strategy** → Payment processing, auth methods
- **Chain of Responsibility** → Request validation
- **Decorator** → Logging, caching, rate limiting
- **Factory** → Database connections
- **Command** → Message queues, job schedulers

### UI/UX
- **Observer** → MVC/MVVM frameworks
- **State Machine** → Form wizards, UI workflows
- **Command** → Undo/redo in editors
- **Memento** → Document versioning
- **Decorator** → UI component enhancement

### Data Processing
- **Pipeline** → ETL pipelines
- **Functional Reduce** → Data transformation
- **Chain of Responsibility** → Data validation
- **Pure Functional** → Event sourcing

---

## Pattern Combinations That Work Well

### 1. Factory + Strategy
```typescript
const strategy = StrategyFactory.create('aim-navigation');
const submarine = new StrategySubmarine(strategy);
```
**Use Case:** Plugin systems, configurable algorithms

### 2. Builder + Observer
```typescript
const config = new SubmarineBuilder()
  .addObserver(logger)
  .build();
```
**Use Case:** Configurable event-driven systems

### 3. Decorator + Chain of Responsibility
```typescript
let sub = new BasicSubmarine();
sub = new LoggingDecorator(sub);
sub = new ValidationDecorator(sub);
```
**Use Case:** Middleware with different concerns

### 4. Command + Memento
```typescript
submarine.executeCommand(cmd);
caretaker.save(submarine);
```
**Use Case:** Full undo/redo with command history

### 5. Factory + Builder
```typescript
const submarine = SubmarineFactory.createConfigured(
  SubmarineType.MILITARY,
  new SubmarineBuilder().setMaxDepth(1000).build()
);
```
**Use Case:** Complex object creation with configuration

---

## Testing Each Pattern

| Pattern | Easy to Test? | Test Strategy |
|---------|--------------|---------------|
| OOP | ⭐⭐⭐⭐ | Test methods directly |
| Functional | ⭐⭐⭐⭐⭐ | Pure functions → easy tests |
| Strategy | ⭐⭐⭐⭐⭐ | Test strategies in isolation |
| Command | ⭐⭐⭐⭐⭐ | Test execute/undo independently |
| State Machine | ⭐⭐⭐⭐ | Test state transitions |
| Observer | ⭐⭐⭐ | Mock observers |
| Decorator | ⭐⭐⭐⭐ | Test each decorator layer |
| Chain | ⭐⭐⭐ | Test each handler |
| Builder | ⭐⭐⭐⭐ | Test built objects |
| Factory | ⭐⭐⭐ | Mock factory in tests |
| Memento | ⭐⭐⭐⭐ | Test save/restore |

---

## Performance Characteristics

| Pattern | Memory Usage | CPU Usage | Scalability |
|---------|-------------|-----------|-------------|
| OOP | ⭐⭐⭐⭐⭐ (Low) | ⭐⭐⭐⭐⭐ (Fast) | ⭐⭐⭐ |
| Functional | ⭐⭐⭐ (Medium) | ⭐⭐⭐⭐ (Good) | ⭐⭐⭐⭐⭐ |
| Strategy | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐⭐ (Good) | ⭐⭐⭐⭐ |
| Command | ⭐⭐ (High) | ⭐⭐⭐ (OK) | ⭐⭐⭐ |
| State Machine | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐⭐ (Good) | ⭐⭐⭐ |
| Observer | ⭐⭐⭐ (Medium) | ⭐⭐⭐ (OK) | ⭐⭐⭐⭐ |
| Decorator | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐ (OK) | ⭐⭐⭐⭐ |
| Chain | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐ (OK) | ⭐⭐⭐⭐ |
| Builder | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐⭐⭐ (Fast) | ⭐⭐⭐⭐⭐ |
| Factory | ⭐⭐⭐⭐ (Low) | ⭐⭐⭐⭐⭐ (Fast) | ⭐⭐⭐⭐⭐ |
| Memento | ⭐ (Very High) | ⭐⭐⭐⭐ (Good) | ⭐⭐ |

---

## Learning Path

### Beginner (Start Here)
1. **OOP Class** - Understand encapsulation
2. **Functional Reduce** - Learn immutability
3. **Factory** - Simple abstraction

### Intermediate
4. **Strategy** - Algorithm flexibility
5. **Observer** - Event-driven programming
6. **Builder** - Fluent APIs

### Advanced
7. **Decorator** - Dynamic composition
8. **State Machine** - Complex state management
9. **Chain of Responsibility** - Pipeline processing

### Expert
10. **Command** - Advanced undo/redo
11. **Memento** - State history
12. **Pure Functional** - Complete FP
13. **Pipeline** - Advanced composition

---

## Common Mistakes

### ❌ Don't Do This

```typescript
// Using Strategy when you only have one algorithm
const sub = new StrategySubmarine(new OnlyStrategy());

// Using Command without needing undo
const cmd = new ForwardCommand(5); // Just call sub.move(5)!

// Using Factory for only one type
const sub = SubmarineFactory.create(OnlyType); // Just use new!

// Stacking too many Decorators
let sub = new Logging(new Validation(new Caching(
  new Retry(new RateLimit(new Auth(basic)))))); // Too much!
```

### ✅ Do This Instead

```typescript
// Use simplest pattern that works
const sub = new SubmarinePart1();
sub.executeCommand('forward 5');

// Only add complexity when needed
if (needsUndo) {
  // Then use Command pattern
}
```

---

## Interview Cheat Sheet

### "When would you use X pattern?"

**Strategy:** "When I have multiple algorithms and need to switch between them at runtime."

**Observer:** "When multiple components need to react to state changes without tight coupling."

**Decorator:** "When I need to add responsibilities to objects dynamically without inheritance."

**Factory:** "When object creation is complex or when I want to decouple creation from usage."

**Builder:** "When constructing complex objects with many optional parameters."

**Command:** "When I need to implement undo/redo or queue operations."

**State Machine:** "When an object has distinct states with different behaviors."

**Chain of Responsibility:** "When multiple objects can handle a request and the handler isn't known in advance."

**Memento:** "When I need to save and restore object state without violating encapsulation."

---

## Quick Decision Table

| If You Need... | Use This Pattern |
|----------------|------------------|
| Undo/Redo | Command or Memento |
| Multiple algorithms | Strategy |
| Event notifications | Observer |
| Add features dynamically | Decorator |
| Validation pipeline | Chain of Responsibility |
| Complex configuration | Builder |
| Create different types | Factory |
| State with rules | State Machine |
| Immutability | Functional Reduce or Pure Functional |
| Data transformation | Pipeline |
| Default choice | OOP Class |

---

## Files to Read Next

1. **Start:** [README.md](./README.md) - Quick start guide
2. **Learn:** [PATTERNS_GUIDE.md](./PATTERNS_GUIDE.md) - Complete pattern guide (30+ pages)
3. **Deep Dive:** [SOLUTIONS_ANALYSIS.md](./SOLUTIONS_ANALYSIS.md) - Original 6 patterns analyzed
4. **Summary:** [SUMMARY.md](./SUMMARY.md) - Complete overview

---

## Pattern Checklist

Before choosing a pattern, ask:

- [ ] Is this solving a real problem?
- [ ] Is it the simplest solution?
- [ ] Does my team understand it?
- [ ] Can I maintain it in 6 months?
- [ ] Is it appropriate for this project size?
- [ ] Have I considered alternatives?

**Remember:** The best pattern is the one that solves your problem simply and clearly!
