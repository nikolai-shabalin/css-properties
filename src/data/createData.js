import bcd from '@mdn/browser-compat-data' with { type: 'json' };
import fs from 'node:fs';

const { css, browsers } = bcd;
let groupedData = {};

// Предкэш таблицы дат релизов: browser -> version -> release_date (строка YYYY-MM-DD)
const releaseDateCache = {};
for (const [browserKey, browserData] of Object.entries(browsers)) {
  const releases = browserData?.releases || {};
  const versionToDate = {};
  for (const [version, info] of Object.entries(releases)) {
    if (info && info.release_date) versionToDate[version] = info.release_date;
  }
  releaseDateCache[browserKey] = versionToDate;
}

const getMinDate = (browserVersionsSupportingProperty) => {
  let minDate = null; // строки YYYY-MM-DD сравниваются лексикографически корректно
  for (let { name, version } of browserVersionsSupportingProperty) {
    const date = releaseDateCache[name]?.[version];
    if (!date) continue;
    if (minDate === null || date < minDate) {
      minDate = date;
    }
  }
  return minDate || false;
};

const getBrowserSupport = (compat) => {
  const supportedBrowsers = [];
  for (let [browser, supportData] of Object.entries(compat.support || {})) {
    if (!supportData) continue;
    const items = Array.isArray(supportData) ? supportData : [supportData];
    for (const item of items) {
      const v = item && item.version_added;
      if (typeof v === 'string') { // игнорируем true/false/undefined и неточные записи
        supportedBrowsers.push({ name: browser, version: v });
        break; // берём первый валидный вариант
      }
    }
  }
  return supportedBrowsers;
};

const extractData = (properties, parent = null) => {
  for (let [propertyName, propertyData] of Object.entries(properties)) {
    if (propertyName === '__compat') continue; // пропускаем служебный ключ
    const compat = propertyData.__compat;
    if (!compat) continue;

    const browserSupport = getBrowserSupport(compat);
    const date = getMinDate(browserSupport);
    if (!date) continue;

    const year = date.slice(0, 4);

    const name = propertyName.includes('_') && compat.description
      ? compat.description.replace(/<\/?code>|&lt;|&gt;/g, '')
      : propertyName;

    const entry = {
      name,
      date,
      type: parent ? "Значение" : "Свойство",
      parent: parent || null,
      mdnUrl: compat.mdn_url || null,
      specUrl: compat.spec_url || null
    };

    if (!groupedData[year]) {
      groupedData[year] = [];
    }
    groupedData[year].push(entry);

    extractData(propertyData, propertyName);
  }
};

for (const cssKey in css) {
  if (!Object.prototype.hasOwnProperty.call(css, cssKey)) continue;
  extractData(css[cssKey]);
}

for (const year in groupedData) {
  groupedData[year].sort((a, b) => (a.date < b.date ? 1 : -1));
}

fs.writeFileSync('./src/data/data.js', `export const data = ${JSON.stringify(groupedData)};`);
