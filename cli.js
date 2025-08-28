#!/usr/bin/env node

import { data } from './src/data/data.js';
import { styleText } from 'node:util';

const colors = {
    title: 'cyan',
    success: 'green',
    error: 'redBright',
    warning: 'yellow',
    info: 'blue',
    highlight: 'magenta',
    reset: 'reset'
};

const args = process.argv.slice(2);
const command = args[0];

function getPropertiesByYear(year) {
    if (!data[year]) {
        console.log(styleText(colors.error, `❌ Свойства за ${year} год не найдены`));
        return [];
    }
    return data[year];
}

function searchProperties(searchText) {
    const results = [];
    const searchLower = searchText.toLowerCase();

    for (const [year, properties] of Object.entries(data)) {
        for (const property of properties) {
            if (property.name.toLowerCase().includes(searchLower)) {
                results.push({
                    ...property,
                    year: parseInt(year)
                });
            }
        }
    }

    return results;
}

function displayProperties(properties, title) {
    if (properties.length === 0) {
        console.log(`\n${styleText(colors.title, title)}`);
        console.log(styleText(colors.warning, 'Свойства не найдены'));
        return;
    }

    console.log(`\n${styleText(colors.title, title)} ${styleText(colors.info, `(найдено: ${properties.length})`)}`);
    console.log(styleText(colors.highlight, '─'.repeat(80)));
                properties.forEach((property, index) => {
        const type = property.type || 'N/A';
        const date = property.date || 'N/A';

        console.log(`${styleText(colors.highlight, `${index + 1}.`)} ${styleText(colors.title, property.name)}`);
        console.log(`   ${styleText(colors.info, 'Тип:')} ${type} | ${styleText(colors.info, 'Дата:')} ${date}`);
        if (property.mdnUrl) {
            console.log(`   ${styleText(colors.success, 'MDN:')} ${property.mdnUrl}`);
        }
        if (property.specUrl && property.specUrl.length > 0) {
            if (Array.isArray(property.specUrl)) {
                property.specUrl.forEach((url, i) => {
                    const specLabel = property.specUrl.length > 1 ? `Спецификация ${i + 1}` : 'Спецификация';
                    console.log(`   ${styleText(colors.warning, specLabel)}: ${url}`);
                });
            } else {
                console.log(`   ${styleText(colors.warning, 'Спецификация:')} ${property.specUrl}`);
            }
        }
        console.log('');
    });
}

function showHelp() {
    console.log(`
${styleText(colors.title, '📋 CSS Properties CLI - Справочник по CSS свойствам')}

${styleText(colors.info, 'Использование:')}
  npx cssp <команда> [флаги]

${styleText(colors.info, 'Команды:')}
  ${styleText(colors.highlight, 'list')}                    Показать список CSS свойств

${styleText(colors.info, 'Флаги:')}
  ${styleText(colors.highlight, '--year, -y <год>')}       Показать свойства за конкретный год
  ${styleText(colors.highlight, '--search, -s <текст>')}   Найти свойства по названию

${styleText(colors.info, 'Примеры:')}
  npx cssp list --year 2007
  npx cssp list -y 2007
  npx cssp list --search border
  npx cssp list -s border
  npx cssp list

${styleText(colors.info, 'Для получения справки:')}
  npx cssp --help
  npx cssp -h
`);
}

function main() {
    // Показать справку если нет аргументов или есть --help или -h
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showHelp();

        return;
    }

    if (command === '-y' || command === '-s') {
        console.log(styleText(colors.error, `❌ Ошибка: флаг ${command} должен использоваться с командой list`));
        console.log(styleText(colors.info, 'Пример: npx cssp list -y 2007'));
        showHelp();
        return;
    }

    if (command === 'list') {
        const yearFlag = args.indexOf('--year');
        const yearFlagShort = args.indexOf('-y');
        const searchFlag = args.indexOf('--search');
        const searchFlagShort = args.indexOf('-s');

        if ((yearFlag !== -1 && args[yearFlag + 1]) || (yearFlagShort !== -1 && args[yearFlagShort + 1])) {
            const yearIndex = yearFlag !== -1 ? yearFlag : yearFlagShort;
            const year = args[yearIndex + 1];
            const properties = getPropertiesByYear(year);
            displayProperties(properties, `CSS свойства за ${year} год`);
            return;
        }

        if ((searchFlag !== -1 && args[searchFlag + 1]) || (searchFlagShort !== -1 && args[searchFlagShort + 1])) {
            const searchIndex = searchFlag !== -1 ? searchFlag : searchFlagShort;
            const searchText = args[searchIndex + 1];
            const properties = searchProperties(searchText);
            displayProperties(properties, `Результаты поиска по "${searchText}"`);
            return;
        }

        const allProperties = [];
        for (const [year, properties] of Object.entries(data)) {
            for (const property of properties) {
                allProperties.push({
                    ...property,
                    year: parseInt(year)
                });
            }
        }

        allProperties.sort((a, b) => a.year - b.year);

        const limitedProperties = allProperties.slice(0, 20);
        displayProperties(limitedProperties, 'CSS свойства (первые 20)');

        if (allProperties.length > 20) {
            console.log(`\n... и еще ${allProperties.length - 20} свойств`);
            console.log('Используйте флаги --year или --search для более точного поиска');
        }

        return;

    }

    console.log(styleText(colors.error, `❌ Неизвестная команда: ${command}`));
    showHelp();
}

// Запуск CLI
main();
