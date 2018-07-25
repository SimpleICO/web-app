let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
const aliases = require('gulp-style-aliases');

let fs                = require('fs');
let path              = require('path');
let cssTaskDictionary = [];
let cssTaskList       = [];
let watchTaskList     = [];

// SRC PATH definitions
let publicFolder = './projects';
let srcFolder = './src/assets';

let cssSrcPath = `${srcFolder}/sass/projects`;
let cssDest    = `${publicFolder}`;

// Gather Scss src files to watch and compile
(fs.readdirSync(cssSrcPath) || []).filter(directory => {
  let isDirectory = fs.lstatSync(path.join(cssSrcPath, directory)).isDirectory();
  return  !/global/.test(directory) &&
          !/theme/.test(directory) &&
          isDirectory;
}).forEach(project => {
  (fs.readdirSync(path.join(cssSrcPath, project)) || []).filter(projectCtrl => {
    return fs.lstatSync(path.join(cssSrcPath, project, projectCtrl)).isDirectory();
  }).forEach(directory => {
    fs.readdirSync(path.join(cssSrcPath, project, directory)).forEach(file => {
      cssTaskDictionary.push({ project: project, directory: directory, file: file });
    });
  });
});

cssTaskDictionary.forEach(taskDef => {

  let file = taskDef.file.replace(/\.scss/, '');
  file = file.replace(/_/, '');
  let taskSuffix = '-' + taskDef.project + '-' + taskDef.directory + '-' + file;
  let taskName = 'css' + taskSuffix;
  cssTaskList.push(taskName);

  // Output compressed styles for prod and dev
  // Sass will watch for changes in these files
  let srcPathFile = path.join(cssSrcPath, taskDef.project, taskDef.directory, taskDef.file);
  let destination = path.join(cssDest, taskDef.project, '/src/lib', taskDef.directory);

  console.log(srcPathFile, destination, taskDef);


  gulp.task(taskName, () => {
    gulp.src([srcPathFile])
      .pipe(aliases({
        '@bootstrap': 'node_modules/bootstrap/scss',
        '@ebm': 'node_modules/ebm',
        '@sass': 'src/assets/sass',
        }))
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        flexbox: true,
        }))
      .pipe(gulp.dest(destination)
    );
  });

  // Instantiate directory specific watch tasks
  let watchTaskName = 'watch-' + taskName;
  watchTaskList.push(watchTaskName);
  gulp.task(watchTaskName, () => {
    gulp.watch([srcPathFile], [taskName]);
  });
});

gulp.task('watch', watchTaskList);
