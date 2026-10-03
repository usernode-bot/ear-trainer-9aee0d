/* Static curriculum for Ear Trainer.
 *
 * Lesson types appear in learning order; each lesson's items are ordered so
 * the first entries are the easiest / most contrasting sounds. A lesson's own
 * item list is the set a run quizzes on — there are no size options; to
 * practice fewer sounds, open an earlier lesson. The quiz script reads this
 * global (window.EARTRAINER_CURRICULUM); the server never needs it.
 */
(function () {
  'use strict';

  var CURRICULUM = {
    types: ['intervals', 'notes', 'chords', 'progressions'],
    notes: {
      name: 'Notes',
      lessons: [
        {
          id: 'notes-1',
          name: 'First scale degrees',
          description: 'Hear a tonic, then name where the next note sits: tonic, dominant and octave.',
          items: [
            { name: '1 — Tonic', semitone: 0 },
            { name: '5 — Dominant', semitone: 7 },
            { name: '8 — Octave', semitone: 12 },
          ],
        },
        {
          id: 'notes-2',
          name: 'Thirds and steps',
          description: 'Adds the mediant and subdominant to the first lesson.',
          items: [
            { name: '1 — Tonic', semitone: 0 },
            { name: '5 — Dominant', semitone: 7 },
            { name: '8 — Octave', semitone: 12 },
            { name: '3 — Mediant', semitone: 4 },
            { name: '4 — Subdominant', semitone: 5 },
          ],
        },
        {
          id: 'notes-3',
          name: 'Up to the seventh',
          description: 'Adds the supertonic and submediant to the earlier lessons.',
          items: [
            { name: '1 — Tonic', semitone: 0 },
            { name: '5 — Dominant', semitone: 7 },
            { name: '8 — Octave', semitone: 12 },
            { name: '3 — Mediant', semitone: 4 },
            { name: '4 — Subdominant', semitone: 5 },
            { name: '2 — Supertonic', semitone: 2 },
            { name: '6 — Submediant', semitone: 9 },
          ],
        },
        {
          id: 'notes-4',
          name: 'Full major scale',
          description: 'Adds the leading tone, completing all eight degrees of the major scale.',
          items: [
            { name: '1 — Tonic', semitone: 0 },
            { name: '5 — Dominant', semitone: 7 },
            { name: '8 — Octave', semitone: 12 },
            { name: '3 — Mediant', semitone: 4 },
            { name: '4 — Subdominant', semitone: 5 },
            { name: '2 — Supertonic', semitone: 2 },
            { name: '6 — Submediant', semitone: 9 },
            { name: '7 — Leading tone', semitone: 11 },
          ],
        },
      ],
    },
    intervals: {
      name: 'Intervals',
      lessons: [
        {
          id: 'intervals-1',
          name: 'First intervals',
          description: 'Three big, contrasting gaps: perfect 5th, perfect 4th, and an octave.',
          items: [
            { name: 'Perfect 5th', semitones: 7 },
            { name: 'Perfect 4th', semitones: 5 },
            { name: 'Octave', semitones: 12 },
          ],
        },
        {
          id: 'intervals-2',
          name: 'Thirds and sixths',
          description: 'Adds major and minor thirds and sixths to the first lesson.',
          items: [
            { name: 'Perfect 5th', semitones: 7 },
            { name: 'Perfect 4th', semitones: 5 },
            { name: 'Octave', semitones: 12 },
            { name: 'Major 3rd', semitones: 4 },
            { name: 'Minor 3rd', semitones: 3 },
            { name: 'Major 6th', semitones: 9 },
            { name: 'Minor 6th', semitones: 8 },
          ],
        },
        {
          id: 'intervals-3',
          name: 'Whole and half steps',
          description: 'Adds the tight pairs of steps that sit next to each other.',
          items: [
            { name: 'Perfect 5th', semitones: 7 },
            { name: 'Perfect 4th', semitones: 5 },
            { name: 'Octave', semitones: 12 },
            { name: 'Major 3rd', semitones: 4 },
            { name: 'Minor 3rd', semitones: 3 },
            { name: 'Major 6th', semitones: 9 },
            { name: 'Minor 6th', semitones: 8 },
            { name: 'Major 2nd', semitones: 2 },
            { name: 'Minor 2nd', semitones: 1 },
          ],
        },
        {
          id: 'intervals-4',
          name: 'All twelfths',
          description: 'The full set, including the tritone and every seventh.',
          items: [
            { name: 'Minor 2nd', semitones: 1 },
            { name: 'Major 2nd', semitones: 2 },
            { name: 'Minor 3rd', semitones: 3 },
            { name: 'Major 3rd', semitones: 4 },
            { name: 'Perfect 4th', semitones: 5 },
            { name: 'Tritone', semitones: 6 },
            { name: 'Perfect 5th', semitones: 7 },
            { name: 'Minor 6th', semitones: 8 },
            { name: 'Major 6th', semitones: 9 },
            { name: 'Minor 7th', semitones: 10 },
            { name: 'Major 7th', semitones: 11 },
            { name: 'Octave', semitones: 12 },
          ],
        },
      ],
    },
    chords: {
      name: 'Chords',
      lessons: [
        {
          id: 'chords-1',
          name: 'Triads first',
          description: 'Major, minor and diminished triads, played all at once.',
          items: [
            { name: 'Major', recipe: [0, 4, 7] },
            { name: 'Minor', recipe: [0, 3, 7] },
            { name: 'Diminished', recipe: [0, 3, 6] },
          ],
        },
        {
          id: 'chords-2',
          name: 'Seventh chords',
          description: 'Adds the three most common seventh chords.',
          items: [
            { name: 'Major', recipe: [0, 4, 7] },
            { name: 'Minor', recipe: [0, 3, 7] },
            { name: 'Diminished', recipe: [0, 3, 6] },
            { name: 'Major 7th', recipe: [0, 4, 7, 11] },
            { name: 'Minor 7th', recipe: [0, 3, 7, 10] },
            { name: 'Dominant 7th', recipe: [0, 4, 7, 10] },
          ],
        },
        {
          id: 'chords-3',
          name: 'Added color',
          description: 'Six chords including the bright augmented triad.',
          items: [
            { name: 'Major', recipe: [0, 4, 7] },
            { name: 'Minor', recipe: [0, 3, 7] },
            { name: 'Diminished', recipe: [0, 3, 6] },
            { name: 'Augmented', recipe: [0, 4, 8] },
            { name: 'Major 7th', recipe: [0, 4, 7, 11] },
            { name: 'Minor 7th', recipe: [0, 3, 7, 10] },
          ],
        },
        {
          id: 'chords-4',
          name: 'Full chord set',
          description: 'Every chord quality in the curriculum, at once.',
          items: [
            { name: 'Major', recipe: [0, 4, 7] },
            { name: 'Minor', recipe: [0, 3, 7] },
            { name: 'Diminished', recipe: [0, 3, 6] },
            { name: 'Augmented', recipe: [0, 4, 8] },
            { name: 'Major 7th', recipe: [0, 4, 7, 11] },
            { name: 'Minor 7th', recipe: [0, 3, 7, 10] },
            { name: 'Dominant 7th', recipe: [0, 4, 7, 10] },
          ],
        },
      ],
    },
    progressions: {
      name: 'Progressions',
      lessons: [
        {
          id: 'progressions-1',
          name: 'Two-chord hymn moves',
          description: 'The two chords that end most hymns: I–IV and I–V, then home.',
          items: [
            { name: 'I–IV–I', roman: ['I', 'IV', 'I'], source: 'Hymn amen cadence ("Doxology")' },
            { name: 'I–V–I', roman: ['I', 'V', 'I'], source: 'Hymn opening and close ("Holy, Holy, Holy")' },
            { name: 'I–IV–V–I', roman: ['I', 'IV', 'V', 'I'], source: 'Hymn ending ("Abide with Me")' },
          ],
        },
        {
          id: 'progressions-2',
          name: 'Pop loops',
          description: 'The two four-chord loops behind half of the pop songs you know.',
          items: [
            { name: 'I–V–vi–IV', roman: ['I', 'V', 'vi', 'IV'], source: '"Let It Be"' },
            { name: 'I–vi–IV–V', roman: ['I', 'vi', 'IV', 'V'], source: '"Stand By Me" style' },
            { name: 'I–IV–V–I', roman: ['I', 'IV', 'V', 'I'], source: 'Hymn ending ("Abide with Me")' },
            { name: 'I–IV–I', roman: ['I', 'IV', 'I'], source: 'Hymn amen cadence ("Doxology")' },
            { name: 'I–V–I', roman: ['I', 'V', 'I'], source: 'Hymn opening and close ("Holy, Holy, Holy")' },
          ],
        },
        {
          id: 'progressions-3',
          name: 'Sad and jazzy',
          description: 'Adds the descending minor loop and the jazz ii–V–I.',
          items: [
            { name: 'I–V–vi–IV', roman: ['I', 'V', 'vi', 'IV'], source: '"Let It Be"' },
            { name: 'I–vi–IV–V', roman: ['I', 'vi', 'IV', 'V'], source: '"Stand By Me" style' },
            { name: 'vi–IV–I–V', roman: ['vi', 'IV', 'I', 'V'], source: '"Zombie" style minor loop' },
            { name: 'ii–V–I', roman: ['ii', 'V', 'I'], source: 'Jazz turnaround ("Autumn Leaves" style)' },
            { name: 'I–IV–V–I', roman: ['I', 'IV', 'V', 'I'], source: 'Hymn ending ("Abide with Me")' },
          ],
        },
        {
          id: 'progressions-4',
          name: 'Full set',
          description: 'Everything: hymn cadences, pop loops and the jazz turnaround.',
          items: [
            { name: 'I–IV–I', roman: ['I', 'IV', 'I'], source: 'Hymn amen cadence ("Doxology")' },
            { name: 'I–V–I', roman: ['I', 'V', 'I'], source: 'Hymn opening and close ("Holy, Holy, Holy")' },
            { name: 'I–IV–V–I', roman: ['I', 'IV', 'V', 'I'], source: 'Hymn ending ("Abide with Me")' },
            { name: 'I–V–vi–IV', roman: ['I', 'V', 'vi', 'IV'], source: '"Let It Be"' },
            { name: 'I–vi–IV–V', roman: ['I', 'vi', 'IV', 'V'], source: '"Stand By Me" style' },
            { name: 'vi–IV–I–V', roman: ['vi', 'IV', 'I', 'V'], source: '"Zombie" style minor loop' },
            { name: 'ii–V–I', roman: ['ii', 'V', 'I'], source: 'Jazz turnaround ("Autumn Leaves" style)' },
          ],
        },
      ],
    },
  };

  window.EARTRAINER_CURRICULUM = CURRICULUM;
})();
