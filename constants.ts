
import { Plan, PlanName, Duration, TelegramChannel } from './types';

export const PLANS: Plan[] = [
  {
    name: PlanName.Essential,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 2, total: 6, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 2, total: 10, save: 2, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 2, total: 20, save: 4, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Professional,
    isPopular: true,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 3, total: 9, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 3, total: 15, save: 3, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 3, total: 30, save: 6, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Premium,
    features: [
      'Interior Models',
      'Exterior Models',
      'Both 3ds Max & SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
      'Software Library FREE',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 5, total: 15, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 5, total: 25, save: 5, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 5, total: 50, save: 10, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
];

export const CURRENCY_RATES = {
  MMK: 4000,
  THB: 36,
};

export const TELEGRAM_CHANNELS: TelegramChannel[] = [
  // 3ds Max
  { category: '3ds Max', name: 'FURNITURE MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'DECORATION MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'LIGHTING MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'KITCHEN MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'BATHROOM MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'DOORS AND WINDOWS MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'TECH AND MUSIC MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'CHILDROOM MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'STUDIO MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'ARCHITECTURE MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'TREE AND PLANTS MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'TRANSPORT MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'RETAIL AND SPORT MODELS', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'PEOPLE AND ANIMAL MODELS', link: '#', software: 'Max' },
  
  // SketchUp
  { category: 'SketchUp', name: 'STUDIO SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'PEOPLE AND ANIMAL SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'DOORS AND WINDOWS SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'BATHROOM SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'FURNITURE SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'DECORATION SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'ARCHITECTURE SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TRANSPORT SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TECH AND MUSIC SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'KITCHEN SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'LIGHTING SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TREE AND PLANTS SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'RETAIL AND SPORT SU MODELS', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'CHILDROOM SU MODELS', link: '#', software: 'SketchUp' },

  // Textures
  { category: 'Textures', name: 'PREMIUM TEXTURE LIBRARY', link: '#', software: 'Texture' },
  { category: 'Textures', name: 'MEGASCAN LIBRARY FOR ARCHVIZ', link: '#', software: 'Texture' },
  
  // Software
  { category: 'Software', name: 'SOFTWARE LIBRARY - ARCHVIZ', link: '#', software: 'Software' },
];
