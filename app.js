import bcd from '@mdn/browser-compat-data' assert { type: 'json' };
import fs from 'node:fs';

const {css, browsers } = bcd;
let data = [];

const getSpecUrl = (properties, propertyName) => {
  const specUrl = properties[propertyName]['__compat']['spec_url'];
  return Array.isArray(specUrl) ? specUrl[0] : specUrl;
}

const getBrowserVersion = (browser) => {
  if (browser) {
    let version = Array.isArray(browser.version_added) ? browser.version_added[0] : browser.version_added;
    if (version === 'preview') {
      return null;
    }
    if (typeof version === 'string' && version.startsWith('≤')) {
      version = parseFloat(version.substring(1));
    }
    return version;
  }
  return null;
}

const getMinDate = (browserVersionsSupportingProperty, name) => {
  const releaseDates = [];

  for (let browserVersion of browserVersionsSupportingProperty) {
    const { name, version } = browserVersion;
    const releaseInfo = browsers[name]['releases'][version];
    if (!releaseInfo || !releaseInfo['release_date']) {
      continue;
    }
    const releaseDate = releaseInfo['release_date'];
    releaseDates.push(releaseDate);
  }

  if (releaseDates.length === 0) {
    return false;
  }

  const minDate = releaseDates.reduce((minDate, current) => {
    const currentDate = new Date(current);
    return currentDate < minDate ? currentDate : minDate;
  }, new Date(releaseDates[0]));
  return minDate.toISOString().split('T')[0];
}

const getDate = ({status: {deprecated}, support: {chrome, firefox, safari}}, name) => {
  if (deprecated) {
    return false;
  }

  const chromeVersion = getBrowserVersion(chrome);
  const firefoxVersion = getBrowserVersion(firefox);
  const safariVersion = getBrowserVersion(safari);

  if (!chromeVersion && !firefoxVersion && !safariVersion) {
    return false;
  }

  const browserVersions = [
    chromeVersion && {name: 'chrome', version: chromeVersion},
    firefoxVersion && {name: 'firefox', version: firefoxVersion},
    safariVersion && {name: 'safari', version: safariVersion}
  ].filter(Boolean);

  const minDate = getMinDate(browserVersions, name);

  if (minDate === false) {
    return false;
  }

  return minDate;
}

const renameType = (type) => ({
  'at-rules': '@',
  'properties': 'Свойство',
  'selectors': 'Селектор',
  'types': 'Тип'
}[type] || type);

for (const cssKey in css) {
  const type = renameType(cssKey);
  const properties = css[cssKey];

  for (const propertyName in properties) {
    const name = propertyName;
    const mdnUrl = properties[propertyName]['__compat']['mdn_url'];
    const specUrl = getSpecUrl(properties, propertyName);

    const date = getDate(properties[propertyName]['__compat'], name);

    if (date === false) continue;

    data.push({
      name,
      mdnUrl,
      specUrl,
      date,
      type,
      year: date.split('-')[0]
    });
  }
}

const sortDataByYear = (data) => {
  const sortedData = {};
  for (let item of data) {
    const year = item.date.split('-')[0];
    if (!sortedData[year]) {
      sortedData[year] = [];
    }
    sortedData[year].push(item);
  }

  for (let year in sortedData) {
    sortedData[year].sort((a, b) => b.date.localeCompare(a.date));
  }

  return sortedData;
}

const sortedData = sortDataByYear(data);

fs.writeFileSync('./site/data/properties.json', JSON.stringify(sortedData));
