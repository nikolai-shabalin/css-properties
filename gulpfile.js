import fs from 'fs';
import {src, dest, series, parallel, watch} from 'gulp';
import postcss from "gulp-postcss";
import csso from "postcss-csso";
import twig  from 'gulp-twig';
import htmlmin from 'gulp-htmlmin';
import browser from 'browser-sync';
import {deleteAsync} from 'del';

const properties = JSON.parse(fs.readFileSync('./site/data/properties.json'));
const publicPath = './build';

// Создание HTML-страниц
const pages = () => {
  return src('./site/index.twig')
    .pipe(twig({
      data: {
        data: properties
      }
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(publicPath));
}

// Создание стилей
const styles = () => {
  return src('./site/style.css')
    .pipe(postcss([
      csso()
    ]))
    .pipe(dest(publicPath))
    .pipe(browser.stream());
}

// Копирование всех фавиконок
const copyFavicons = () => {
  return src(['./site/favicon.ico', './site/favicons/*', './site/manifest.webmanifest'],{
    base: 'site'
  })
    .pipe(dest(publicPath));
}


// Удаление папки build
const clean = () => deleteAsync(publicPath);

// Сервер
const server = (done) => {
  browser.init({
    server: {
      baseDir: publicPath
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Перезагрузка сервера
const reload = (done) => {
  browser.reload();
  done();
}

// Слежение за файлами
const watcher = () => {
  watch('./site/index.twig', series(pages, reload));
  watch('./site/style.css', series(styles, pages, reload));
}

// Таски
export const build = series(
  clean,
  copyFavicons,
  styles,
  pages
);

export default series(
  parallel(build),
  server,
  watcher
)
