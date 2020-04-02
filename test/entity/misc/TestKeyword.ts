import { expect } from 'chai';

import { CommandVerb } from '../../../src/entity/Command';
import { Keyword } from '../../../src/entity/misc/Keyword';

describe('keyword entity', async () => {
  it('should convert itself to JSON', async () => {
    const keyword = new Keyword({
      controllerId: '',
      data: {},
      key: '',
      labels: {},
      noun: 'test',
      verb: CommandVerb.Create,
    });
    const json = keyword.toJSON();
    expect(json).to.have.property('noun');
    expect(json).to.have.property('verb');
  });
});
