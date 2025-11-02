<div align="center">
    <img width="800" height="315" src="./assets/hello.png" alt="hello" />
</div>

# css-properties
Все CSS-свойства и медиавыражения в одном месте.
Основная задача проекта собрать в одном месте все CSS-свойства, медиавыражения и значения с сортировкой по выходу в браузерах.

## CLI-версия

Проект включает CLI-интерфейс для быстрого поиска CSS свойств прямо из терминала:

```bash
# Показать все свойства за 2007 год (без установки)
npx css-properties-list list --year 2007
npx css-properties-list list -y 2007

# Найти свойства, содержащие "border"
npx css-properties-list list --search border
npx css-properties-list list -s border

# Показать справку
npx css-properties-list --help
npx css-properties-list -h
```

### Доступные команды:
- `list` - показать список CSS свойств
- `--year, -y <год>` - фильтр по году
- `--search, -s <текст>` - поиск по названию
- `--help, -h` - показать справку

### Установка и запуск CLI глобально
```bash
npm i -g css-properties-list
cssp --help
```

## Для контрибьютеров
[Почитайте небольшой документ как правильнее контрибьютить в проект.](./CONTRIBUTING.md)

## Как запустить проект
1. Установить node.js. Поддерживаемая версия 22
2. Установить зависимости проекта

```bash
pnpm i
```

3. Запустить проект
```bash
npm run dev
```

4. Запустить CLI (локально из репозитория)
```bash
./cli.js
```
