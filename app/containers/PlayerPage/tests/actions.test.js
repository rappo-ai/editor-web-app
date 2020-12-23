import { DEFAULT_ACTION } from '../constants';

describe('PlayerPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(expected);
    });
  });
});
