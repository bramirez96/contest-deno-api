import { HandlebarsConfig } from './deps.ts';

const echoHelper = (str: string) => str;

export default () => {
  const hbc: HandlebarsConfig = {
    extname: '.hbs',
    baseDir: 'views',
    defaultLayout: 'main',
    layoutsDir: 'layouts/',
    partialsDir: 'partials/',
    helpers: {
      echoHelper,
    },
    compilerOptions: undefined,
  };
  return hbc;
};
