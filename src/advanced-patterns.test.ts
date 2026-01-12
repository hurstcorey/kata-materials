import {
  StateMachineSubmarine,
  ObservableSubmarine,
  PositionLogger,
  DepthAlarm,
  createDecoratedSubmarine,
  ChainOfResponsibilitySubmarine,
  SubmarineBuilder,
  ConfigurableSubmarine,
  SubmarineFactory,
  SubmarineType,
  MementoSubmarine,
  SubmarineCaretaker
} from './advanced-patterns';

describe('Advanced Design Patterns', () => {
  // ==========================================================================
  // State Machine Pattern Tests
  // ==========================================================================
  describe('State Machine Pattern', () => {
    it('should start in SURFACED state', () => {
      const sub = new StateMachineSubmarine();
      expect(sub.getState()).toBe('SURFACED');
    });

    it('should transition to DIVING when going down while surfaced', () => {
      const sub = new StateMachineSubmarine();
      sub.executeCommand('down 1');
      expect(sub.getState()).toBe('DIVING');
    });

    it('should prevent going up when surfaced', () => {
      const sub = new StateMachineSubmarine();
      expect(() => sub.executeCommand('up 1')).toThrow('Cannot execute up in state SURFACED');
    });

    it('should allow forward movement when surfaced', () => {
      const sub = new StateMachineSubmarine();
      sub.executeCommand('forward 5');
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0, aim: 0 });
    });

    it('should execute navigation commands correctly', () => {
      const sub = new StateMachineSubmarine();
      sub.executeCommand('down 5');
      sub.executeCommand('forward 8');
      expect(sub.getPosition()).toEqual({ horizontal: 8, depth: 40, aim: 5 });
    });
  });

  // ==========================================================================
  // Observer Pattern Tests
  // ==========================================================================
  describe('Observer Pattern', () => {
    it('should notify position observers on command execution', () => {
      const sub = new ObservableSubmarine();
      const logger = new PositionLogger();

      sub.subscribeToPosition(logger);
      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');

      const log = logger.getLog();
      expect(log).toHaveLength(2);
      expect(log[0]).toEqual({ horizontal: 5, depth: 0, aim: 0 });
      expect(log[1]).toEqual({ horizontal: 5, depth: 0, aim: 3 });
    });

    it('should trigger depth alarm when exceeding max depth', () => {
      const sub = new ObservableSubmarine();
      const alarm = new DepthAlarm(50);

      sub.subscribeToPosition(alarm);
      sub.executeCommand('down 5');
      sub.executeCommand('forward 10'); // depth becomes 50
      sub.executeCommand('forward 1'); // depth becomes 55

      expect(alarm.isAlarmTriggered()).toBe(true);
    });

    it('should allow unsubscribing from observations', () => {
      const sub = new ObservableSubmarine();
      const logger = new PositionLogger();

      const unsubscribe = sub.subscribeToPosition(logger);
      sub.executeCommand('forward 5');

      unsubscribe();
      sub.executeCommand('forward 5');

      expect(logger.getLog()).toHaveLength(1);
    });

    it('should support multiple observers', () => {
      const sub = new ObservableSubmarine();
      const logger1 = new PositionLogger();
      const logger2 = new PositionLogger();

      sub.subscribeToPosition(logger1);
      sub.subscribeToPosition(logger2);
      sub.executeCommand('forward 5');

      expect(logger1.getLog()).toHaveLength(1);
      expect(logger2.getLog()).toHaveLength(1);
    });
  });

  // ==========================================================================
  // Decorator Pattern Tests
  // ==========================================================================
  describe('Decorator Pattern', () => {
    it('should log commands with LoggingDecorator', () => {
      const sub = createDecoratedSubmarine({ logging: true }) as any;

      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');

      const log = sub.getCommandLog();
      expect(log).toContain('Executing: forward 5');
      expect(log).toContain('Executing: down 3');
    });

    it('should validate depth with ValidationDecorator', () => {
      const sub = createDecoratedSubmarine({
        validation: { maxDepth: 10 }
      });

      sub.executeCommand('down 5');
      expect(() => sub.executeCommand('forward 3')).toThrow('Depth limit exceeded');
    });

    it('should track telemetry with TelemetryDecorator', () => {
      const sub = createDecoratedSubmarine({ telemetry: true }) as any;

      sub.executeCommand('forward 5');
      sub.executeCommand('forward 3');
      sub.executeCommand('down 2');

      expect(sub.getCommandCount()).toBe(3);
      expect(sub.getTotalDistance()).toBe(8);
    });

    it('should compose multiple decorators', () => {
      const sub = createDecoratedSubmarine({
        logging: true,
        telemetry: true,
        validation: { maxDepth: 100 }
      }) as any;

      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');

      // Check that telemetry works (outermost decorator)
      expect(sub.getTotalDistance).toBeDefined();
      expect(sub.getTotalDistance()).toBe(5);
    });
  });

  // ==========================================================================
  // Chain of Responsibility Tests
  // ==========================================================================
  describe('Chain of Responsibility Pattern', () => {
    it('should execute commands without validation when no limits set', () => {
      const sub = new ChainOfResponsibilitySubmarine();

      sub.executeCommand('forward 100');
      sub.executeCommand('down 100');

      expect(sub.getPosition().horizontal).toBe(100);
    });

    it('should enforce depth limit in chain', () => {
      const sub = new ChainOfResponsibilitySubmarine({ maxDepth: 50 });

      sub.executeCommand('down 5');
      expect(() => sub.executeCommand('forward 20')).toThrow('Depth limit');
    });

    it('should enforce speed limit in chain', () => {
      const sub = new ChainOfResponsibilitySubmarine({ maxSpeed: 10 });

      expect(() => sub.executeCommand('forward 20')).toThrow('Speed limit exceeded');
    });

    it('should log commands when logging enabled', () => {
      const sub = new ChainOfResponsibilitySubmarine({ logging: true });

      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');

      const logs = sub.getLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0]).toContain('forward 5');
    });

    it('should apply multiple handlers in order', () => {
      const sub = new ChainOfResponsibilitySubmarine({
        maxSpeed: 50,
        maxDepth: 100,
        logging: true
      });

      sub.executeCommand('forward 10');
      sub.executeCommand('down 5');

      expect(sub.getLogs()).toHaveLength(2);
      expect(sub.getPosition().horizontal).toBe(10);
    });
  });

  // ==========================================================================
  // Builder Pattern Tests
  // ==========================================================================
  describe('Builder Pattern', () => {
    it('should build submarine with default config', () => {
      const config = new SubmarineBuilder().build();

      expect(config.initialPosition).toEqual({ horizontal: 0, depth: 0, aim: 0 });
      expect(config.maxDepth).toBe(1000);
      expect(config.enableLogging).toBe(false);
    });

    it('should build submarine with custom config using fluent interface', () => {
      const config = new SubmarineBuilder()
        .setInitialPosition(10, 20, 5)
        .setMaxDepth(500)
        .setMaxSpeed(50)
        .enableLogging()
        .enableTelemetry()
        .build();

      expect(config.initialPosition).toEqual({ horizontal: 10, depth: 20, aim: 5 });
      expect(config.maxDepth).toBe(500);
      expect(config.maxSpeed).toBe(50);
      expect(config.enableLogging).toBe(true);
      expect(config.enableTelemetry).toBe(true);
    });

    it('should support preset configurations', () => {
      const config = new SubmarineBuilder()
        .deepDiveMode()
        .build();

      expect(config.initialPosition.depth).toBe(100);
      expect(config.maxDepth).toBe(5000);
    });

    it('should create configurable submarine from builder', () => {
      const config = new SubmarineBuilder()
        .setMaxDepth(50)
        .enableLogging()
        .build();

      const sub = new ConfigurableSubmarine(config);

      sub.executeCommand('forward 5');
      expect(sub.getCommandLog()).toContain('forward 5');
    });

    it('should enforce depth limit from config', () => {
      const config = new SubmarineBuilder()
        .setMaxDepth(10)
        .build();

      const sub = new ConfigurableSubmarine(config);

      sub.executeCommand('down 5');
      expect(() => sub.executeCommand('forward 3')).toThrow('Depth limit exceeded');
    });

    it('should enforce speed limit from config', () => {
      const config = new SubmarineBuilder()
        .setMaxSpeed(10)
        .build();

      const sub = new ConfigurableSubmarine(config);

      expect(() => sub.executeCommand('forward 20')).toThrow('Speed limit exceeded');
    });

    it('should notify observers from config', () => {
      const logger = new PositionLogger();
      const config = new SubmarineBuilder()
        .addObserver(logger)
        .build();

      const sub = new ConfigurableSubmarine(config);

      sub.executeCommand('forward 5');
      expect(logger.getLog()).toHaveLength(1);
    });
  });

  // ==========================================================================
  // Factory Pattern Tests
  // ==========================================================================
  describe('Factory Pattern', () => {
    it('should create military submarine with correct type', () => {
      const sub = SubmarineFactory.create(SubmarineType.MILITARY);

      expect(sub.getType()).toBe(SubmarineType.MILITARY);
      expect(sub.getCapabilities()).toContain('stealth');
      expect(sub.getCapabilities()).toContain('weapons');
    });

    it('should create research submarine with correct type', () => {
      const sub = SubmarineFactory.create(SubmarineType.RESEARCH);

      expect(sub.getType()).toBe(SubmarineType.RESEARCH);
      expect(sub.getCapabilities()).toContain('deep-dive');
      expect(sub.getCapabilities()).toContain('sampling');
    });

    it('should enforce military submarine depth limit', () => {
      const sub = SubmarineFactory.create(SubmarineType.MILITARY);

      sub.executeCommand('down 100');
      expect(() => {
        for (let i = 0; i < 20; i++) {
          sub.executeCommand('forward 1');
        }
      }).toThrow('Military depth limit exceeded');
    });

    it('should allow research submarine to go deeper', () => {
      const sub = SubmarineFactory.create(SubmarineType.RESEARCH);

      sub.executeCommand('down 200');
      expect(() => {
        for (let i = 0; i < 20; i++) {
          sub.executeCommand('forward 1');
        }
      }).not.toThrow();
    });

    it('should create by mission type', () => {
      const combatSub = SubmarineFactory.createByMission('combat');
      const explorationSub = SubmarineFactory.createByMission('exploration');

      expect(combatSub.getType()).toBe(SubmarineType.MILITARY);
      expect(explorationSub.getType()).toBe(SubmarineType.RESEARCH);
    });

    it('should execute commands on factory-created submarines', () => {
      const sub = SubmarineFactory.create(SubmarineType.MILITARY);

      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');
      sub.executeCommand('forward 2');

      expect(sub.getPosition()).toEqual({ horizontal: 7, depth: 6, aim: 3 });
    });
  });

  // ==========================================================================
  // Memento Pattern Tests
  // ==========================================================================
  describe('Memento Pattern', () => {
    it('should save and restore submarine state', () => {
      const sub = new MementoSubmarine();

      sub.executeCommand('forward 5');
      sub.executeCommand('down 3');
      const memento = sub.save();

      sub.executeCommand('forward 10');
      expect(sub.getPosition().horizontal).toBe(15);

      sub.restore(memento);
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0, aim: 3 });
    });

    it('should support undo operation via caretaker', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      caretaker.save(sub); // Save initial state

      sub.executeCommand('forward 5');
      caretaker.save(sub);

      sub.executeCommand('down 3');
      caretaker.save(sub);

      expect(sub.getPosition().aim).toBe(3);

      caretaker.undo(sub);
      expect(sub.getPosition().aim).toBe(0);

      caretaker.undo(sub);
      expect(sub.getPosition().horizontal).toBe(0);
    });

    it('should support redo operation via caretaker', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      caretaker.save(sub);
      sub.executeCommand('forward 5');
      caretaker.save(sub);

      caretaker.undo(sub);
      expect(sub.getPosition().horizontal).toBe(0);

      caretaker.redo(sub);
      expect(sub.getPosition().horizontal).toBe(5);
    });

    it('should clear redo history after new command', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      caretaker.save(sub);
      sub.executeCommand('forward 5');
      caretaker.save(sub);
      sub.executeCommand('down 3');
      caretaker.save(sub);

      caretaker.undo(sub); // Undo down 3
      expect(caretaker.canRedo()).toBe(true);

      sub.executeCommand('forward 10');
      caretaker.save(sub); // This should clear the redo stack

      expect(caretaker.canRedo()).toBe(false);
    });

    it('should track canUndo and canRedo states', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      expect(caretaker.canUndo()).toBe(false);
      expect(caretaker.canRedo()).toBe(false);

      caretaker.save(sub);
      sub.executeCommand('forward 5');
      caretaker.save(sub);

      expect(caretaker.canUndo()).toBe(true);
      expect(caretaker.canRedo()).toBe(false);

      caretaker.undo(sub);
      expect(caretaker.canUndo()).toBe(false);
      expect(caretaker.canRedo()).toBe(true);
    });

    it('should provide history of states', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      caretaker.save(sub);
      sub.executeCommand('forward 5');
      caretaker.save(sub);
      sub.executeCommand('down 3');
      caretaker.save(sub);

      const history = caretaker.getHistory();
      expect(history).toHaveLength(3);
      expect(history[0].position).toEqual({ horizontal: 0, depth: 0, aim: 0 });
      expect(history[1].position).toEqual({ horizontal: 5, depth: 0, aim: 0 });
      expect(history[2].position).toEqual({ horizontal: 5, depth: 0, aim: 3 });
    });

    it('should include timestamps in mementos', () => {
      const sub = new MementoSubmarine();
      const caretaker = new SubmarineCaretaker();

      caretaker.save(sub);
      const history = caretaker.getHistory();

      expect(history[0].timestamp).toBeInstanceOf(Date);
    });
  });

  // ==========================================================================
  // Integration Tests - Combining Patterns
  // ==========================================================================
  describe('Pattern Integration', () => {
    it('should combine Observer and Builder patterns', () => {
      const logger = new PositionLogger();
      const alarm = new DepthAlarm(50);

      const config = new SubmarineBuilder()
        .addObserver(logger)
        .addObserver(alarm)
        .setMaxDepth(100)
        .enableLogging()
        .build();

      const sub = new ConfigurableSubmarine(config);

      sub.executeCommand('down 10');
      sub.executeCommand('forward 10');

      expect(logger.getLog()).toHaveLength(2);
      expect(alarm.isAlarmTriggered()).toBe(true);
      expect(sub.getCommandLog()).toContain('down 10');
    });

    it('should use Factory and Memento patterns together', () => {
      const sub = SubmarineFactory.create(SubmarineType.RESEARCH) as any;
      const caretaker = new SubmarineCaretaker();

      // Research submarines can save state
      if (sub instanceof MementoSubmarine) {
        caretaker.save(sub);
        sub.executeCommand('forward 5');
        caretaker.save(sub);

        caretaker.undo(sub);
        expect(sub.getPosition().horizontal).toBe(0);
      }
    });
  });
});
