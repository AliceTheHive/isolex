import { doesExist } from '@apextoaster/js-utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface CounterOptions {
  count: number;
  name: string;
  roomId: string;
}

export const TABLE_COUNTER = 'counter';

@Entity(TABLE_COUNTER)
export class Counter implements CounterOptions {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({
    type: 'int',
  })
  public count = 0;

  @Column({
    type: 'varchar',
  })
  public name = '';

  @Column({
    type: 'varchar',
  })
  public roomId = '';

  constructor(options: CounterOptions) {
    if (doesExist(options)) {
      this.count = options.count;
      this.name = options.name;
      this.roomId = options.roomId;
    }
  }

  public toJSON() {
    return {
      count: this.count,
      id: this.id,
      name: this.name,
      roomId: this.roomId,
    };
  }
}
