import bcd from '@mdn/browser-compat-data' with {type: "json"};

// TODO: добыть подствойства
const {css, browsers} = bcd;
export let data = [];

const getSpecUrl = (properties, propertyName) => {
  const specUrl = properties[propertyName]['__compat']['spec_url'];
  return Array.isArray(specUrl) ? specUrl[0] : specUrl;
}

for (const categoryKey in css) {
  const category = categoryKey;
  const properties = css[category];

  for (const propertyName in css[category]) {
    const name = propertyName;
    const mdnUrl = properties[propertyName]['__compat']['mdn_url'];
    const specUrl = getSpecUrl(properties, propertyName);

    data.push({
      category,
      name,
      mdnUrl,
      specUrl
    });
  }
}
