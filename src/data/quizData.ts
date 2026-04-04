import type { QuizQuestion, StyleProfile } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What brings you here?',
    layout: 'two-text',
    options: [
      { id: '1a', label: 'Finding my style', hasImage: false },
      { id: '1b', label: 'Trying something new', hasImage: false },
    ],
  },
  {
    id: 2,
    question: 'What catches your eye first?',
    layout: 'four-image-grid',
    options: [
      { id: '2a', label: 'Bold silhouettes', sublabel: 'Oversized, dramatic shapes', hasImage: true, image: '/images/quiz/q2/bold_silhouette.png', imagePosition: '60% 30%' },
      { id: '2b', label: 'Clean tailoring', sublabel: 'Sharp lines, perfect fit', hasImage: true, image: '/images/quiz/q2/clean_tailoring.png', imagePosition: '28% center' },
      { id: '2c', label: 'Layered textures', sublabel: 'Depth and dimension', hasImage: true, image: '/images/quiz/q2/layered_textures.png', imagePosition: '75% 30%' },
      { id: '2d', label: 'Technical details', sublabel: 'Functional, considered', hasImage: true, image: '/images/quiz/q2/technical.png', imagePosition: 'center 25%' },
    ],
  },
  {
    id: 3,
    question: 'Pick a mood.',
    layout: 'four-image',
    options: [
      { id: '3a', label: 'Dark and moody', sublabel: 'Shadows and mystery', hasImage: true, image: '/images/quiz/q3/dark_moody.png' },
      { id: '3b', label: 'Quiet and composed', sublabel: 'Restrained elegance', hasImage: true, image: '/images/quiz/q3/quiet_composed.png' },
      { id: '3c', label: 'Loud and expressive', sublabel: 'Unapologetic energy', hasImage: true, image: '/images/quiz/q3/loud_expressive.png' },
      { id: '3d', label: 'Handmade and warm', sublabel: 'Craft and soul', hasImage: true, image: '/images/quiz/q3/handcraft_warm.png', imagePosition: 'center 20%' },
    ],
  },
  {
    id: 4,
    question: 'Where do you feel most like yourself?',
    layout: 'four-image',
    options: [
      { id: '4a', label: 'A gallery opening at night', hasImage: true, image: '/images/quiz/q4/gallery.png' },
      { id: '4b', label: 'A minimalist apartment', hasImage: true, image: '/images/quiz/q4/apartment.png' },
      { id: '4c', label: 'A vintage market in Tokyo', hasImage: true, image: '/images/quiz/q4/market.png' },
      { id: '4d', label: 'A countryside studio', hasImage: true, image: '/images/quiz/q4/countryside.png' },
    ],
  },
  {
    id: 5,
    question: 'Which word?',
    layout: 'four-text',
    options: [
      { id: '5a', label: 'Deconstruct', hasImage: false },
      { id: '5b', label: 'Refine', hasImage: false },
      { id: '5c', label: 'Remix', hasImage: false },
      { id: '5d', label: 'Craft', hasImage: false },
    ],
  },
  {
    id: 6,
    question: 'Last one — trust your gut.',
    layout: 'four-image-only',
    options: [
      { id: '6a', label: '', hasImage: true, image: '/images/quiz/q6/avant_garde.png' },
      { id: '6b', label: '', hasImage: true, image: '/images/quiz/q6/minimalist.png' },
      { id: '6c', label: '', hasImage: true, image: '/images/quiz/q6/streetwear.png' },
      { id: '6d', label: '', hasImage: true, image: '/images/quiz/q6/romantic_craft.png' },
    ],
  },
];

export const styleProfiles: Record<string, StyleProfile> = {
  'avant-garde': {
    name: 'The Deconstructionist',
    description: 'You see fashion as architecture — something to pull apart and rebuild. You\'re drawn to designers who challenge convention and find beauty in the undone.',
    brands: ['Rick Owens', 'Maison Margiela', 'Comme des Garcons'],
    image: '/images/quiz/personas/deconstructionist.png',
  },
  'minimalist': {
    name: 'The Purist',
    description: 'Less is everything. You believe in perfect cuts, premium fabrics, and the quiet confidence of restraint. Your wardrobe is edited, never cluttered.',
    brands: ['The Row', 'Acne Studios', 'Jil Sander'],
    image: '/images/quiz/personas/purist.png',
  },
  'streetwear': {
    name: 'The Remixer',
    description: 'You live at the intersection of high and low. Hype and heritage blend seamlessly in your world — everything is a reference, everything is fair game.',
    brands: ['Bape', 'Off-White', 'Palm Angels'],
    image: '/images/quiz/personas/remixer.png',
  },
  'romantic': {
    name: 'The Storyteller',
    description: 'Every piece you own has a story. You\'re drawn to craft, texture, and the human hand behind the garment. Fashion is personal history made wearable.',
    brands: ['BODE', 'Simone Rocha', 'Dries Van Noten'],
    image: '/images/quiz/personas/storyteller.png',
  },
  'techwear': {
    name: 'The Functionalist',
    description: 'Form follows function, always. You appreciate technical fabrics, considered details, and garments that perform as well as they look.',
    brands: ['Post Archive Faction', 'And Wander', 'Stone Island'],
    image: '/images/quiz/personas/functionalist.png',
  },
};

// Simple mapping: based on most common answer pattern, return a profile
export function getStyleProfile(answers: Record<number, string>): StyleProfile {
  const mapping: Record<string, string> = {
    '2a': 'avant-garde', '3a': 'avant-garde', '4a': 'avant-garde', '5a': 'avant-garde',
    '2b': 'minimalist', '3b': 'minimalist', '4b': 'minimalist', '5b': 'minimalist',
    '2c': 'romantic', '3d': 'romantic', '4d': 'romantic', '5d': 'romantic',
    '2d': 'techwear', '3c': 'streetwear', '4c': 'streetwear', '5c': 'streetwear',
  };

  const scores: Record<string, number> = {};
  Object.values(answers).forEach((answerId) => {
    const profile = mapping[answerId];
    if (profile) {
      scores[profile] = (scores[profile] || 0) + 1;
    }
  });

  const topProfile = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return styleProfiles[topProfile?.[0] || 'minimalist'];
}
