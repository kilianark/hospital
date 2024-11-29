import { IdToStringPipe } from './id-to-string.pipe';

describe('IdToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new IdToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
