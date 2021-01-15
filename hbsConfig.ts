import { HandlebarsConfig } from './deps.ts';
import helpers from './views/helpers/index.ts';

export default () => {
  const hbc: HandlebarsConfig = {
    extname: '.hbs',
    baseDir: 'views',
    defaultLayout: 'main',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    helpers: helpers,
    compilerOptions: undefined,
  };
  return hbc;
};
