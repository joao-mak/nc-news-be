const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  test('empty array returns empty array', () => {
    const actual = formatDates([]);
    const expected = [];
    expect(actual).toEqual(expected);
  })
  test('one object, one key: replaces timestamp', () => {
    const actual = formatDates([
      { timestamp: 1588613382 }
    ]);
    const testDate = new Date(1588613382)
    const expected = [{ timestamp: testDate }];
    expect(actual).toEqual(expected);
  })
  test('one object, multiple keys: replaces timestamp, leaves other values intact', () => {
    const actual = formatDates([
      { name: 'jones',timestamp: 1588613382 }
    ]);
    const testDate = new Date(1588613382)
    const expected = [{ name: 'jones', timestamp: testDate }];
    expect(actual).toEqual(expected);
  })
  test('multiple objects, multiple keys: replaces timestamp, leaves other values intact', () => {
    const actual = formatDates([
      { name: 'jones',timestamp: 1588613382 },
      { name: 'otis',timestamp: 1588613000 }
    ]);
    const testDate1 = new Date(1588613382);
    const testDate2 = new Date(1588613000)
    const expected = [
      { name: 'jones', timestamp: testDate1 },
      { name: 'otis', timestamp: testDate2 }
    ];
    expect(actual).toEqual(expected);
  })
});

describe('makeRefObj', () => {
  test('empty array returns empty array', () => {
    const actual = makeRefObj([]);
    const expected = {};
    expect(actual).toEqual(expected);
  })
  test('one object successfully makes ref object', () => {
    const actual = makeRefObj([
      { article_id: 1, title: 'A'}
    ]);
    const expected = { A: 1 };
    expect(actual).toEqual(expected);
  })
  test('two objects successfully make respective ref objects', () => {
    const actual = makeRefObj([
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' }
    ]);
    const expected = { A: 1 , B: 2 };
    expect(actual).toEqual(expected);
  })
});

describe('formatComments', () => {
  test('empty array returns empty array', () => {
    const actual = formatComments([], {});
    const expected = [];
    expect(actual).toEqual(expected);
  })
  test('comments array returns formatted comments', () => {
    const testComments = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    }];
    const expected = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 1,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389),
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      article_id: 2,
      author: 'butter_bridge',
      votes: 14,
      created_at: new Date(1479818163389),
    }];
    const testArticleRef = {
      "They're not exactly dogs, are they?": 1, 
      'Living in the shadow of a great man': 2
    };
    const actual = formatComments(testComments, testArticleRef);
    console.log(actual)
    expect(actual).toEqual(expected);
  })
});
