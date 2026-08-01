import { BaseEntity, generateBaseEntityProps } from './base.entity';

describe('BaseEntity', () => {
  describe('generateBaseEntityProps', () => {
    it('returns a valid UUIDv7 id', () => {
      const props = generateBaseEntityProps();

      // UUIDv7: version nibble at position 14 is '7'
      expect(props.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('sets createdAt and updatedAt to the same instant at creation', () => {
      const props = generateBaseEntityProps();

      expect(props.createdAt).toBeInstanceOf(Date);
      expect(props.updatedAt).toBeInstanceOf(Date);
      expect(props.createdAt.getTime()).toBe(props.updatedAt.getTime());
    });
  });

  describe('touch', () => {
    it('advances updatedAt without mutating createdAt', async () => {
      // ponytail: minimal concrete subclass to test abstract BaseEntity
      class TestEntity extends BaseEntity {
        constructor() {
          super(generateBaseEntityProps());
        }
        touch(): void {
          super.touch();
        }
      }

      const entity = new TestEntity();
      const originalCreatedAt = entity.createdAt;

      // Force time to advance so updatedAt is strictly greater
      await new Promise((r) => setTimeout(r, 5));
      entity.touch();

      expect(entity.createdAt).toBe(originalCreatedAt);
      expect(entity.updatedAt.getTime()).toBeGreaterThan(entity.createdAt.getTime());
    });
  });

  describe('id and createdAt immutability', () => {
    class TestEntity extends BaseEntity {
      constructor() {
        super(generateBaseEntityProps());
      }
    }

    it('id throws when assigned (getter-only property)', () => {
      const entity = new TestEntity();

      expect(() => {
        (entity as unknown as { id: string }).id = 'should-throw';
      }).toThrow(TypeError);
    });

    it('createdAt throws when assigned (getter-only property)', () => {
      const entity = new TestEntity();

      expect(() => {
        (entity as unknown as { createdAt: Date }).createdAt = new Date(0);
      }).toThrow(TypeError);
    });
  });
});
