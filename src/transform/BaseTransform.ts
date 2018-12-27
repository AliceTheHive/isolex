import { safeLoad } from 'js-yaml';
import { Inject } from 'noicejs';

import { BotService } from 'src/BotService';
import { Command } from 'src/entity/Command';
import { Message } from 'src/entity/Message';
import { Transform, TransformData, TransformOptions } from 'src/transform/Transform';
import { TYPE_JSON, TYPE_TEXT, TYPE_YAML } from 'src/utils/Mime';

@Inject()
export abstract class BaseTransform<TData extends TransformData> extends BotService<TData> implements Transform {

  constructor(options: TransformOptions<TData>, schemaPath: string) {
    super(options, schemaPath);
  }

  public check(cmd: Command): Promise<boolean> {
    return this.checkFilters(cmd, this.filters);
  }

  public abstract transform(cmd: Command, msg: Message): Promise<Array<Message>>;

  protected mergeScope(cmd: Command, msg: Message): any {
    return { cmd, data: this.parseMessage(msg) };
  }

  protected parseMessage(msg: Message): any {
    this.logger.debug({ msg }, 'parsing message');
    switch (msg.type) {
      case TYPE_TEXT:
        return msg.body;
      case TYPE_JSON:
      case TYPE_YAML:
        return safeLoad(msg.body); // TODO: replace this with a real parser
    }
  }
}
