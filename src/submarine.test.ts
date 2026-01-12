import { SubmarinePart1, SubmarinePart2, parseCommand, calculateFinalPosition } from './submarine';

describe('Submarine Navigation - Part 1', () => {
  describe('parseCommand', () => {
    it('should parse forward command', () => {
      const result = parseCommand('forward 5');
      expect(result).toEqual({ direction: 'forward', value: 5 });
    });

    it('should parse down command', () => {
      const result = parseCommand('down 3');
      expect(result).toEqual({ direction: 'down', value: 3 });
    });

    it('should parse up command', () => {
      const result = parseCommand('up 2');
      expect(result).toEqual({ direction: 'up', value: 2 });
    });

    it('should handle negative values', () => {
      const result = parseCommand('forward -3');
      expect(result).toEqual({ direction: 'forward', value: -3 });
    });

    it('should throw error for invalid command', () => {
      expect(() => parseCommand('invalid 5')).toThrow();
    });

    it('should throw error for invalid format', () => {
      expect(() => parseCommand('forward')).toThrow();
    });
  });

  describe('SubmarinePart1', () => {
    it('should start at position (0, 0)', () => {
      const sub = new SubmarinePart1();
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0 });
    });

    it('should move forward', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('forward 5');
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0 });
    });

    it('should move down', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('down 5');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 5 });
    });

    it('should move up', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('down 8');
      sub.executeCommand('up 3');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 5 });
    });

    it('should handle example sequence', () => {
      const sub = new SubmarinePart1();
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      expect(sub.getPosition()).toEqual({ horizontal: 15, depth: 10 });
      expect(sub.getResult()).toBe(150);
    });

    it('should handle negative movements', () => {
      const sub = new SubmarinePart1();
      sub.executeCommand('forward 10');
      sub.executeCommand('forward -3');
      expect(sub.getPosition()).toEqual({ horizontal: 7, depth: 0 });
    });
  });

  describe('calculateFinalPosition (functional approach)', () => {
    it('should calculate final position for example', () => {
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      const result = calculateFinalPosition(commands, 1);
      expect(result).toEqual({ horizontal: 15, depth: 10, product: 150 });
    });
  });
});

describe('Submarine Navigation - Part 2', () => {
  describe('SubmarinePart2', () => {
    it('should start at position (0, 0) with aim 0', () => {
      const sub = new SubmarinePart2();
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 0 });
    });

    it('should increase aim with down command', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 5');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 5 });
    });

    it('should decrease aim with up command', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 8');
      sub.executeCommand('up 3');
      expect(sub.getPosition()).toEqual({ horizontal: 0, depth: 0, aim: 5 });
    });

    it('should move forward without depth change when aim is 0', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('forward 5');
      expect(sub.getPosition()).toEqual({ horizontal: 5, depth: 0, aim: 0 });
    });

    it('should move forward with depth change based on aim', () => {
      const sub = new SubmarinePart2();
      sub.executeCommand('down 5');
      sub.executeCommand('forward 8');
      expect(sub.getPosition()).toEqual({ horizontal: 8, depth: 40, aim: 5 });
    });

    it('should handle example sequence', () => {
      const sub = new SubmarinePart2();
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      commands.forEach(cmd => sub.executeCommand(cmd));

      expect(sub.getPosition()).toEqual({ horizontal: 15, depth: 60, aim: 10 });
      expect(sub.getResult()).toBe(900);
    });
  });

  describe('calculateFinalPosition (functional approach)', () => {
    it('should calculate final position for example', () => {
      const commands = [
        'forward 5',
        'down 5',
        'forward 8',
        'up 3',
        'down 8',
        'forward 2'
      ];

      const result = calculateFinalPosition(commands, 2);
      expect(result).toEqual({ horizontal: 15, depth: 60, product: 900, aim: 10 });
    });
  });
});
