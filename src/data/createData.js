import bcd from '@mdn/browser-compat-data' with { type: 'json' };
import fs from 'node:fs';

const { css, browsers } = bcd;
const groupedData = {};
const namedHtmlEntities = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"'
};

const decodeHtmlEntities = (value) => value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
  if (code.startsWith('#x')) {
    return String.fromCodePoint(parseInt(code.slice(2), 16));
  }

  if (code.startsWith('#')) {
    return String.fromCodePoint(parseInt(code.slice(1), 10));
  }

  return namedHtmlEntities[code.toLowerCase()] ?? entity;
});

const getDescriptionText = (description) => decodeHtmlEntities(description.replace(/<[^>]+>/g, ''));

// Кэшируем даты релизов
const releaseDateCache = new Map();
for (const [browserKey, browserData] of Object.entries(browsers)) {
  const versionToDate = new Map();
  const releases = browserData?.releases || {};
  for (const [version, info] of Object.entries(releases)) {
    if (info?.release_date) versionToDate.set(version, info.release_date);
  }
  releaseDateCache.set(browserKey, versionToDate);
}

const getMinDate = (browserVersionsSupportingProperty) => {
  let minDate = null;
  for (const { name, version } of browserVersionsSupportingProperty) {
    const date = releaseDateCache.get(name)?.get(version);
    if (date && (!minDate || date < minDate)) minDate = date;
  }
  return minDate || false;
};

const getBrowserSupport = (compat) => {
  const supportedBrowsers = [];
  const support = compat?.support;
  if (!support) return supportedBrowsers;

  for (const [browser, supportData] of Object.entries(support)) {
    const items = Array.isArray(supportData) ? supportData : [supportData];
    for (const item of items) {
      const version = item?.version_added;
      if (typeof version === 'string') {
        supportedBrowsers.push({ name: browser, version });
        break;
      }
    }
  }
  return supportedBrowsers;
};

// Используем стек для обхода (вместо рекурсии)
const extractData = (properties, parent = null) => {
  const stack = Object.entries(properties).map(([name, data]) => [name, data, parent]);

  while (stack.length) {
    const [propertyName, propertyData, currentParent] = stack.pop();

    if (propertyName === '__compat') continue;

    const compat = propertyData.__compat;
    if (!compat) {
      // Если нет __compat, но есть вложенные свойства, добавляем их в стек
      for (const [key, value] of Object.entries(propertyData)) {
        stack.push([key, value, propertyName]);
      }
      continue;
    }

    const browserSupport = getBrowserSupport(compat);
    const date = getMinDate(browserSupport);
    if (!date) continue;

    const year = date.slice(0, 4);
    const name = propertyName.includes('_') && compat.description
      ? getDescriptionText(compat.description)
      : decodeHtmlEntities(propertyName);

    const entry = {
      name,
      date,
      type: currentParent ? "Значение" : "Свойство",
      parent: currentParent || null,
      mdnUrl: compat.mdn_url || null,
      specUrl: compat.spec_url || null
    };

    if (!groupedData[year]) groupedData[year] = [];
    groupedData[year].push(entry);

    // Добавляем вложенные свойства в стек
    for (const [key, value] of Object.entries(propertyData)) {
      stack.push([key, value, propertyName]);
    }
  }
};

for (const [key, value] of Object.entries(css)) {
  extractData({ [key]: value });
}

// Сортировка по дате (обратный порядок: новые раньше)
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
for (const year in groupedData) {
  groupedData[year].sort((a, b) => collator.compare(b.date, a.date));
}

// Запись в файл
fs.writeFileSync('./src/data/data.js', `export const data = ${JSON.stringify(groupedData)};`);
