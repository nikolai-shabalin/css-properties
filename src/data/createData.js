import bcd from '@mdn/browser-compat-data' with { type: 'json' };
import sqlite from 'node:sqlite'
const {css, browsers} = bcd;

const setupDatabase = async () => {
    const db = await sqlite.open({
        filename: './data.db',
        driver: sqlite.Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            specUrl TEXT,
            mdnUrl TEXT,
            canise TEXT,
            dateAdded TEXT NOT NULL
        )
    `);

    await db.close();
}
// const data = [
//     {
//         name: 'color',
//         category: 'properties',
//         specUrl: 'https://drafts.csswg.org/css-color/#the-color-property',
//         mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color',
//         canise: 'https://caniuse.com/#feat=css-color',
//         dateAdded: '23.06.2003',
//     },
//     {
//         name: 'width',
//         category: 'properties',
//         mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/width',
//         specUrl: 'https://drafts.csswg.org/css-values/#width',
//         dateAdded: '23.06.2003',
//     },
//     {
        
//         name: 'anchor-size',
//         category: 'value',        
//         specUrl: 'https://drafts.csswg.org/css-anchor-position-1/#anchor-size-fn',
//         dateAdded: '2024-05-14', 
//     }
// ]