import bcd from '@mdn/browser-compat-data' with { type: 'json' };
import fs from 'node:fs';

const { css, browsers } = bcd;
let groupedData = {};

const getMinDate = (browserVersionsSupportingProperty) => {
  const releaseDates = [];
  for (let { name, version } of browserVersionsSupportingProperty) {
    const releaseInfo = browsers[name]?.['releases'][version];
    if (releaseInfo?.release_date) {
      releaseDates.push(releaseInfo.release_date);
    }
  }
  if (releaseDates.length === 0) {
    return false;
  }
  const minDate = releaseDates.reduce((minDate, current) => {
    const currentDate = new Date(current);
    return currentDate < minDate ? currentDate : minDate;
  }, new Date(releaseDates[0]));
  return minDate.toISOString().split('T')[0];
};

const getBrowserSupport = (compat) => {
  const supportedBrowsers = [];
  for (let [browser, supportData] of Object.entries(compat.support || {})) {
    if (typeof supportData === "string" || !supportData) continue;
    const versionAdded = Array.isArray(supportData.version_added)
      ? supportData.version_added[0]
      : supportData.version_added;
    if (versionAdded) {
      supportedBrowsers.push({ name: browser, version: versionAdded });
    }
  }
  return supportedBrowsers;
};

const extractData = (properties, parent = null) => {
  for (let [propertyName, propertyData] of Object.entries(properties)) {
    const compat = propertyData.__compat;
    if (!compat) continue;

    const browserSupport = getBrowserSupport(compat);
    const date = getMinDate(browserSupport);
    if (!date) continue;

    const year = date.split("-")[0];
    const entry = {
      name: propertyName,
      date,
      type: parent ? "Значение" : "Свойство",
      parent: parent || null,
      mdnUrl: compat.mdn_url || null,
      specUrl: compat.spec_url || null,
      year: date.split('-')[0]
    };

    if (!groupedData[year]) {
      groupedData[year] = [];
    }
    groupedData[year].push(entry);

    extractData(propertyData, propertyName);
  }
};

for (const cssKey in css) {
  extractData(css[cssKey]);
}

for (const year in groupedData) {
  groupedData[year].sort((a, b) => b.date.localeCompare(a.date));
}

fs.writeFileSync('./data.js', `export const data = ${JSON.stringify(groupedData)};`);
