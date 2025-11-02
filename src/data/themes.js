import { data } from './data.js';

const vendorPrefixRE = /^-(webkit|moz|ms|o)-/;

const themeByExact = new Map([
  ['box-decoration-break', 'Box Model & Sizing'],
  ['box-sizing', 'Box Model & Sizing'],
  ['box-shadow', 'Filters & Compositing Effects'],
  ['box-reflect', 'Filters & Compositing Effects'],
  ['text-shadow', 'Typography & Text'],
  ['content-visibility', 'Performance & Containment'],
  ['scroll-timeline', 'Scroll & Scroll-driven Animations'],
  ['scroll-timeline-axis', 'Scroll & Scroll-driven Animations'],
  ['scroll-timeline-name', 'Scroll & Scroll-driven Animations'],
  ['scroll-initial-target', 'Scroll & Scroll-driven Animations'],
  ['scroll-marker-group', 'Scroll & Scroll-driven Animations'],
  ['scroll-target-group', 'Scroll & Scroll-driven Animations'],
  ['row-gap', 'Flexbox & Alignment'],
]);

const themeByPrefix = new Map([
  ['accent', 'Color, Backgrounds & Opacity'],
  ['align', 'Flexbox & Alignment'],
  ['alignment', 'SVG & Vector Graphics'],
  ['all', 'Cascade & Inheritance'],
  ['alt', 'Images & Media'],
  ['anchor', 'Positioning & Layering'],
  ['animation', 'Animations & Motion'],
  ['app', 'Interaction, Forms & UI Controls'],
  ['appearance', 'Interaction, Forms & UI Controls'],
  ['aspect', 'Box Model & Sizing'],
  ['backdrop', 'Filters & Compositing Effects'],
  ['backface', 'Transforms & 3D'],
  ['background', 'Color, Backgrounds & Opacity'],
  ['baseline', 'SVG & Vector Graphics'],
  ['block', 'Box Model & Sizing'],
  ['border', 'Box Model & Sizing'],
  ['bottom', 'Positioning & Layering'],
  ['box', 'Flexbox & Alignment'],
  ['break', 'Print & Paged Media'],
  ['caption', 'Table Layout'],
  ['caret', 'Interaction, Forms & UI Controls'],
  ['clear', 'Layout & Flow'],
  ['clip', 'Masking, Clipping & Shapes'],
  ['color', 'Color, Backgrounds & Opacity'],
  ['column', 'Multi-column Layout'],
  ['columns', 'Multi-column Layout'],
  ['contain', 'Performance & Containment'],
  ['container', 'Performance & Containment'],
  ['content', 'Generated Content, Lists & Counters'],
  ['corner', 'Box Model & Sizing'],
  ['counter', 'Generated Content, Lists & Counters'],
  ['cursor', 'Interaction, Forms & UI Controls'],
  ['custom', 'Miscellaneous & Legacy'],
  ['cx', 'SVG & Vector Graphics'],
  ['cy', 'SVG & Vector Graphics'],
  ['d', 'SVG & Vector Graphics'],
  ['direction', 'Typography & Text'],
  ['display', 'Layout & Flow'],
  ['dominant', 'SVG & Vector Graphics'],
  ['dynamic', 'Color, Backgrounds & Opacity'],
  ['empty', 'Table Layout'],
  ['field', 'Interaction, Forms & UI Controls'],
  ['fill', 'SVG & Vector Graphics'],
  ['filter', 'Filters & Compositing Effects'],
  ['flex', 'Flexbox & Alignment'],
  ['float', 'Layout & Flow'],
  ['flood', 'SVG & Vector Graphics'],
  ['font', 'Typography & Text'],
  ['force', 'Images & Media'],
  ['forced', 'Color, Backgrounds & Opacity'],
  ['gap', 'Flexbox & Alignment'],
  ['glyph', 'Typography & Text'],
  ['grid', 'Grid Layout'],
  ['hanging', 'Typography & Text'],
  ['height', 'Box Model & Sizing'],
  ['hyphenate', 'Typography & Text'],
  ['hyphens', 'Typography & Text'],
  ['image', 'Images & Media'],
  ['ime', 'Interaction, Forms & UI Controls'],
  ['initial', 'Typography & Text'],
  ['inline', 'Box Model & Sizing'],
  ['inset', 'Positioning & Layering'],
  ['interactivity', 'Interaction, Forms & UI Controls'],
  ['interest', 'Scroll & Scroll-driven Animations'],
  ['interpolate', 'Animations & Motion'],
  ['isolation', 'Filters & Compositing Effects'],
  ['justify', 'Flexbox & Alignment'],
  ['left', 'Positioning & Layering'],
  ['letter', 'Typography & Text'],
  ['lighting', 'SVG & Vector Graphics'],
  ['line', 'Typography & Text'],
  ['list', 'Generated Content, Lists & Counters'],
  ['locale', 'Typography & Text'],
  ['logical', 'Box Model & Sizing'],
  ['margin', 'Box Model & Sizing'],
  ['marker', 'SVG & Vector Graphics'],
  ['mask', 'Masking, Clipping & Shapes'],
  ['math', 'Math & Scientific Layout'],
  ['max', 'Box Model & Sizing'],
  ['min', 'Box Model & Sizing'],
  ['mix', 'Filters & Compositing Effects'],
  ['nbsp', 'Typography & Text'],
  ['object', 'Images & Media'],
  ['offset', 'Animations & Motion'],
  ['opacity', 'Color, Backgrounds & Opacity'],
  ['order', 'Flexbox & Alignment'],
  ['orient', 'SVG & Vector Graphics'],
  ['orphans', 'Print & Paged Media'],
  ['outline', 'Box Model & Sizing'],
  ['overflow', 'Scroll & Scroll-driven Animations'],
  ['overlay', 'Interaction, Forms & UI Controls'],
  ['overscroll', 'Scroll & Scroll-driven Animations'],
  ['padding', 'Box Model & Sizing'],
  ['page', 'Print & Paged Media'],
  ['paint', 'SVG & Vector Graphics'],
  ['perspective', 'Transforms & 3D'],
  ['place', 'Flexbox & Alignment'],
  ['pointer', 'Interaction, Forms & UI Controls'],
  ['position', 'Positioning & Layering'],
  ['print', 'Print & Paged Media'],
  ['quotes', 'Generated Content, Lists & Counters'],
  ['r', 'SVG & Vector Graphics'],
  ['reading', 'Typography & Text'],
  ['resize', 'Interaction, Forms & UI Controls'],
  ['right', 'Positioning & Layering'],
  ['rotate', 'Transforms & 3D'],
  ['row', 'Flexbox & Alignment'],
  ['rtl', 'Typography & Text'],
  ['ruby', 'Typography & Text'],
  ['rx', 'SVG & Vector Graphics'],
  ['ry', 'SVG & Vector Graphics'],
  ['scale', 'Transforms & 3D'],
  ['scroll', 'Scroll & Scroll-driven Animations'],
  ['scrollbar', 'Scroll & Scroll-driven Animations'],
  ['shape', 'Masking, Clipping & Shapes'],
  ['speak', 'Accessibility & Speech'],
  ['stop', 'SVG & Vector Graphics'],
  ['stroke', 'SVG & Vector Graphics'],
  ['tab', 'Typography & Text'],
  ['table', 'Table Layout'],
  ['tap', 'Interaction, Forms & UI Controls'],
  ['text', 'Typography & Text'],
  ['timeline', 'Animations & Motion'],
  ['top', 'Positioning & Layering'],
  ['touch', 'Interaction, Forms & UI Controls'],
  ['transform', 'Transforms & 3D'],
  ['transition', 'Animations & Motion'],
  ['translate', 'Transforms & 3D'],
  ['unicode', 'Typography & Text'],
  ['user', 'Interaction, Forms & UI Controls'],
  ['vector', 'SVG & Vector Graphics'],
  ['vertical', 'Typography & Text'],
  ['view', 'Animations & Motion'],
  ['visibility', 'Layout & Flow'],
  ['white', 'Typography & Text'],
  ['widows', 'Print & Paged Media'],
  ['width', 'Box Model & Sizing'],
  ['will', 'Performance & Containment'],
  ['word', 'Typography & Text'],
  ['writing', 'Typography & Text'],
  ['x', 'SVG & Vector Graphics'],
  ['y', 'SVG & Vector Graphics'],
  ['z', 'Positioning & Layering'],
  ['zoom', 'Interaction, Forms & UI Controls'],
]);

const themeOrder = [
  'Box Model & Sizing',
  'Layout & Flow',
  'Positioning & Layering',
  'Flexbox & Alignment',
  'Grid Layout',
  'Multi-column Layout',
  'Table Layout',
  'Typography & Text',
  'Color, Backgrounds & Opacity',
  'Images & Media',
  'Masking, Clipping & Shapes',
  'Filters & Compositing Effects',
  'Transforms & 3D',
  'Animations & Motion',
  'Scroll & Scroll-driven Animations',
  'Generated Content, Lists & Counters',
  'Interaction, Forms & UI Controls',
  'Accessibility & Speech',
  'SVG & Vector Graphics',
  'Math & Scientific Layout',
  'Performance & Containment',
  'Print & Paged Media',
  'Cascade & Inheritance',
  'Miscellaneous & Legacy',
];

const themeIndex = new Map(themeOrder.map((theme, index) => [theme, index]));

const grouped = themeOrder.map((theme) => ({ name: theme, properties: [] }));

const allEntries = Object.values(data).flat();
const propertyEntries = allEntries.filter((item) => item.parent === 'properties');

const collator = new Intl.Collator('en', { sensitivity: 'base' });

const uniqueProperties = Array.from(
  new Set(propertyEntries.map((entry) => entry.name))
).sort((a, b) => collator.compare(a, b));

const assignTheme = (property) => {
  const normalized = property.replace(vendorPrefixRE, '');
  const segments = normalized.split('-');

  for (let len = segments.length; len > 0; len -= 1) {
    const prefix = segments.slice(0, len).join('-');
    if (themeByExact.has(prefix)) return themeByExact.get(prefix);
    if (themeByPrefix.has(prefix)) return themeByPrefix.get(prefix);
  }

  if (/^view-transition/.test(normalized) || /^view-timeline/.test(normalized)) {
    return 'Animations & Motion';
  }

  if (normalized === 'all') {
    return 'Cascade & Inheritance';
  }

  return 'Miscellaneous & Legacy';
};

for (const property of uniqueProperties) {
  const theme = assignTheme(property);
  if (!themeIndex.has(theme)) {
    grouped.push({ name: theme, properties: [property] });
    themeIndex.set(theme, grouped.length - 1);
    continue;
  }
  grouped[themeIndex.get(theme)].properties.push(property);
}

for (const group of grouped) {
  group.properties.sort((a, b) => collator.compare(a, b));
}

export const themeGroups = grouped;
export const totalProperties = uniqueProperties.length;
