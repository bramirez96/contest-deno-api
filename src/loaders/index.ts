import { Opine } from '../../deps.ts';

import opineLoader from './opine.ts';

export default ({ opineApp }: { opineApp: Opine }) => {
  console.log('Running loaders...');
  opineLoader(opineApp);
};
