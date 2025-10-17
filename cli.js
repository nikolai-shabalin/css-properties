#!/usr/bin/env node

import { data } from './src/data/data.js';
import { styleText } from 'node:util';

const colors = {
    title: 'cyan',
    success: 'green',
    error: 'redBright',
    warning: 'yellow',
    info: 'blue',
    highlight: 'magenta'
};

const { argv: [, , command, ...args] } = process;

const getPropertiesByYear = year => data[year] || [];

const searchProperties = searchText => {
    const searchLower = searchText.toLowerCase();
    return Object.entries(data).flatMap(([year, properties]) =>
        properties
            .filter(property => property.name.toLowerCase().includes(searchLower))
            .map(property => ({ ...property, year: +year }))
    );
};

const displayProperties = (properties, title) => {
    console.log(`\n${styleText(colors.title, title)} ${styleText(colors.info, `(найдено: ${properties.length})`)}`);

    if (properties.length === 0) {
        console.log(styleText(colors.warning, 'Свойства не найдены'));
        return;
    }

    console.log(styleText(colors.highlight, '─'.repeat(80)));

    properties.forEach((property, index) => {
        const { name, type = 'N/A', date = 'N/A', mdnUrl, specUrl } = property;

        console.log(`${styleText(colors.highlight, `${index + 1}.`)} ${styleText(colors.title, name)}`);
        console.log(`   ${styleText(colors.info, 'Тип:')} ${type} | ${styleText(colors.info, 'Дата:')} ${date}`);

        if (mdnUrl) console.log(`   ${styleText(colors.success, 'MDN:')} ${mdnUrl}`);

        if (specUrl?.length) {
            const urls = Array.isArray(specUrl) ? specUrl : [specUrl];
            urls.forEach((url, i) => {
                const label = urls.length > 1 ? `Спецификация ${i + 1}` : 'Спецификация';
                console.log(`   ${styleText(colors.warning, label)}: ${url}`);
            });
        }
        console.log('');
    });
};

const showHelp = () => {
    console.log(`
${styleText(colors.title, '📋 CSS Properties CLI - Справочник по CSS свойствам')}

${styleText(colors.info, 'Использование:')}
  npx css-properties-list <команда> [флаги]

${styleText(colors.info, 'Команды:')}
  ${styleText(colors.highlight, 'list')}                    Показать список CSS свойств

${styleText(colors.info, 'Флаги:')}
  ${styleText(colors.highlight, '--year, -y <год>')}       Показать свойства за конкретный год
  ${styleText(colors.highlight, '--search, -s <текст>')}   Найти свойства по названию

${styleText(colors.info, 'Примеры:')}
  npx css-properties-list list --year 2007
  npx css-properties-list list -y 2007
  npx css-properties-list list --search border
  npx css-properties-list list -s border
  npx css-properties-list list

${styleText(colors.info, 'Для получения справки:')}
  npx css-properties-list --help
  npx css-properties-list -h
`);
};

const main = () => {
    if (!args.length || args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }

    if (['-y', '-s'].includes(command)) {
        console.log(styleText(colors.error, `❌ Ошибка: флаг ${command} должен использоваться с командой list`));
        console.log(styleText(colors.info, 'Пример: npx css-properties-list list -y 2007'));
        showHelp();
        return;
    }

    if (command === 'list') {
        const flags = {
            year: args.findIndex(arg => ['--year', '-y'].includes(arg)),
            search: args.findIndex(arg => ['--search', '-s'].includes(arg))
        };

        if (flags.year !== -1 && args[flags.year + 1]) {
            const year = args[flags.year + 1];
            const properties = getPropertiesByYear(year);
            displayProperties(properties, `CSS свойства за ${year} год`);
            return;
        }

        if (flags.search !== -1 && args[flags.search + 1]) {
            const searchText = args[flags.search + 1];
            const properties = searchProperties(searchText);
            displayProperties(properties, `Результаты поиска по "${searchText}"`);
            return;
        }

        const allProperties = Object.entries(data).flatMap(([year, properties]) =>
            properties.map(property => ({ ...property, year: +year }))
        ).toSorted((a, b) => a.year - b.year);

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
};

main();
