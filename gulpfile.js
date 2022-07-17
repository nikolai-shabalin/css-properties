import fs from 'fs';
import gulp from 'gulp';
import twig  from 'gulp-twig';
import browser from 'browser-sync';

const properties = JSON.parse(fs.readFileSync('./site/data/properties.json'));
const publicPath = './root';

// Создание HTML-страниц
const pages = () => {
  return gulp.src('./site/index.twig')
    .pipe(twig({
      data: {
        properties
      }
    }))
    .pipe(gulp.dest(publicPath));
}

// Создание стилей
const styles = () => {
  return gulp.src('./site/style.css')
    .pipe(gulp.dest(publicPath))
    .pipe(browser.stream());
}

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
  gulp.watch('./site/index.twig', gulp.series(pages, reload));
  gulp.watch('./site/style.css', gulp.series(styles));
}

// Таски
export const build = gulp.series(pages, styles);
export default gulp.series(
  gulp.parallel(build),
  server,
  watcher
)