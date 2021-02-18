import { Service, serviceCollection } from '../../deps.ts';
import { INewSection, ISection } from '../interfaces/cleverSections.ts';
import BaseModel from './baseModel.ts';

Service();
export default class CleverSectionModel extends BaseModel<
  INewSection,
  ISection
> {
  constructor() {
    super('clever_sections');
  }
}

serviceCollection.addTransient(CleverSectionModel);
