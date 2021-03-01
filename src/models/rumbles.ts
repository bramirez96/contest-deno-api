import { Service, serviceCollection } from '../../deps.ts';
import { INewRumble, IRumble } from '../interfaces/rumbles.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleModel extends BaseModel<INewRumble, IRumble> {
  constructor() {
    super('rumbles');
  }

  public async getActiveRumblesBySectionId(sectionId: number) {
    try {
      const rumbles = ((await this.db
        .table('rumbles')
        .innerJoin('rumble_sections', 'rumble_sections.rumbleId', 'rumbles.id')
        .innerJoin(
          'clever_sections',
          'clever_sections.id',
          'rumble_sections.sectionId'
        )
        .select('rumbles.*', 'rumble_sections.end_time')
        .where('clever_sections.id', sectionId)
        .execute()) as unknown[]) as IRumble[];

      return rumbles;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(RumbleModel);
