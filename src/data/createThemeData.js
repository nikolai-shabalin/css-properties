import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { data } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawItems = Object.values(data).flat();
const uniqueItems = Array.from(
  rawItems.reduce((acc, item) => {
    const key = `${item.parent}::${item.name}`;
    if (!acc.has(key)) {
      acc.set(key, item);
    }
    return acc;
  }, new Map())
    .values()
);

const keywordMatcher = (keywords) => {
  const normalized = keywords.map((keyword) =>
    typeof keyword === 'string' ? keyword.toLowerCase() : keyword
  );

  return (item, lowerName) =>
    normalized.some((keyword) => {
      if (keyword instanceof RegExp) {
        return keyword.test(lowerName);
      }
      return lowerName.includes(keyword);
    });
};

const categoryMatchers = [
  {
    name: 'Селекторы',
    match: (item) => item.parent === 'selectors',
  },
  {
    name: 'Типы значений',
    match: (item) =>
      item.parent === 'types' ||
      [
        'length',
        'color',
        'string',
        'angle',
        'frequency',
        'resolution',
        'time',
        'percentage',
        'image',
        'integer',
        'number',
        'flex',
        'custom-ident',
        'geometry-box',
        'basic-shape',
        'transform-function',
        'function',
        'url',
      ].includes(item.parent),
  },
  {
    name: 'Правила @',
    match: (item, lower) =>
      item.parent === 'at-rules' || lower.startsWith('@'),
  },
  {
    name: 'Скролл и прокрутка',
    match: keywordMatcher([
      'scroll',
      'overscroll',
      'scrollbar',
      'scroll-snap',
      'touch-action',
      'overscroll-behavior',
    ]),
  },
  {
    name: 'Анимации и переходы',
    match: keywordMatcher([
      'animation',
      'transition',
      'timeline',
      '@keyframes',
      'step(',
      'cubic-bezier',
    ]),
  },
  {
    name: 'Трансформации и 3D',
    match: keywordMatcher([
      'transform',
      'perspective',
      'rotate',
      'scale',
      'skew',
      'translate',
      'matrix',
      '3d',
      'backface-visibility',
      'transform-style',
      'transform-box',
    ]),
  },
  {
    name: 'Фильтры и визуальные эффекты',
    match: keywordMatcher([
      'filter',
      'backdrop',
      'mix-blend',
      'blend-mode',
      'opacity',
      'drop-shadow',
      'shadow',
      'contrast',
      'brightness',
      'grayscale',
      'sepia',
      'saturate',
      'invert',
      'hue-rotate',
      'exposure',
    ]),
  },
  {
    name: 'Маски и клиппинг',
    match: keywordMatcher([
      'mask',
      'clip',
      'shape-outside',
      'shape-margin',
      'shape-image-threshold',
      'clip-path',
      'clip-rule',
    ]),
  },
  {
    name: 'Цвет, фон и градиенты',
    match: keywordMatcher([
      'background',
      'color',
      'gradient',
      'image',
      'pattern',
      'paint',
      'canvas',
      'fill',
      'stroke',
      'stop-',
      'lighting',
      'flood-',
    ]),
  },
  {
    name: 'Текст и типографика',
    match: (item, lower) =>
      lower.startsWith('text-') ||
      lower.includes('font') ||
      lower.includes('line-') ||
      lower.includes('letter') ||
      lower.includes('word') ||
      lower.includes('white-space') ||
      lower.includes('tab-size') ||
      lower.includes('hyphen') ||
      lower.includes('ruby') ||
      lower.includes('writing-mode') ||
      lower.includes('text-decoration') ||
      lower.includes('text-emphasis') ||
      lower.includes('initial-letter') ||
      lower.includes('direction') ||
      lower.includes('unicode-bidi') ||
      lower.includes('text-rendering') ||
      lower.includes('text-orientation'),
  },
  {
    name: 'Списки и счетчики',
    match: keywordMatcher([
      'list-style',
      'counter',
      'marker',
      'quotes',
      'target-text',
    ]),
  },
  {
    name: 'Flexbox',
    match: keywordMatcher(['flex']),
  },
  {
    name: 'Grid Layout',
    match: keywordMatcher(['grid', 'masonry']),
  },
  {
    name: 'Многоколоночный layout',
    match: (item, lower) =>
      lower === 'columns' || lower.startsWith('column-'),
  },
  {
    name: 'Layout и позиционирование',
    match: (item, lower) =>
      [
        'display',
        'position',
        'top',
        'bottom',
        'left',
        'right',
        'inset',
        'float',
        'clear',
        'z-index',
        'object-fit',
        'object-position',
        'vertical-align',
        'visibility',
        'contain',
        'isolation',
        'resize',
        'overflow',
        'aspect-ratio',
        'place-content',
        'place-items',
        'place-self',
        'justify-content',
        'justify-items',
        'justify-self',
        'align-content',
        'align-items',
        'align-self',
        'gap',
        'row-gap',
        'column-gap',
        'order',
        'stack',
      ].some((token) => lower === token || lower.startsWith(`${token}-`)),
  },
  {
    name: 'Размеры и бокс-модель',
    match: (item, lower) =>
      lower.includes('margin') ||
      lower.includes('padding') ||
      lower.includes('border') ||
      lower.includes('outline') ||
      lower.includes('box-') ||
      lower.endsWith('width') ||
      lower.endsWith('height') ||
      lower.startsWith('min-') ||
      lower.startsWith('max-') ||
      lower.endsWith('size') ||
      lower.includes('sizing'),
  },
  {
    name: 'Формы и траектории',
    match: keywordMatcher([
      'shape',
      'offset',
      'motion',
      'ray(',
      'path(',
    ]),
  },
  {
    name: 'Табличная верстка',
    match: keywordMatcher([
      'table',
      'caption',
      'border-collapse',
      'border-spacing',
      'empty-cells',
    ]),
  },
  {
    name: 'Печать и страницы',
    match: keywordMatcher([
      'page',
      'break-',
      'orphans',
      'widows',
      'bleed',
      'marks',
    ]),
  },
  {
    name: 'Формы и интерактивность',
    match: keywordMatcher([
      'appearance',
      'accent',
      'caret',
      'cursor',
      'pointer',
      'user-select',
      'nav-',
      'ime-',
      'writing-mode',
      'touch',
      'zoom',
      'input',
      'resize',
    ]),
  },
  {
    name: 'SVG и графика',
    match: keywordMatcher([
      'vector-effect',
      'mask-type',
      'color-interpolation',
      'color-rendering',
      'fill-rule',
      'stroke-line',
      'stroke-dash',
      'stroke-width',
      'glyph',
      'paint-order',
      'dominant-baseline',
      'alignment-baseline',
    ]),
  },
  {
    name: 'Прочее',
    match: () => true,
  },
];

const groups = new Map();

for (const item of uniqueItems) {
  const lowerName = item.name.toLowerCase();
  const category = categoryMatchers.find(({ match }) => match(item, lowerName))?.name ?? 'Прочее';

  if (!groups.has(category)) {
    groups.set(category, []);
  }
  groups.get(category).push(item);
}

const sortedGroups = Object.fromEntries(
  Array.from(groups.entries())
    .map(([key, items]) => [
      key,
      items.slice().sort((a, b) => a.name.localeCompare(b.name, 'en')),
    ])
    .sort(([a], [b]) => a.localeCompare(b, 'ru'))
);

const outputPath = path.join(__dirname, 'dataByTheme.js');

fs.writeFileSync(
  outputPath,
  `export const dataByTheme = ${JSON.stringify(sortedGroups, null, 2)};\n`
);

console.log(`Группировано ${uniqueItems.length} элементов в ${groups.size} тем.`);
