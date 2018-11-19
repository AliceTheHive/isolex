import { Inject } from 'noicejs';

import { BaseController } from 'src/controller/BaseController';
import { Controller, ControllerConfig, ControllerOptions } from 'src/controller/Controller';
import { Command } from 'src/entity/Command';
import { Message } from 'src/entity/Message';
import { ServiceDefinition } from 'src/Service';
import { Transform } from 'src/transform/Transform';
import { TYPE_TEXT } from 'src/utils/Mime';
import { TemplateCompiler } from 'src/utils/TemplateCompiler';

export interface EchoControllerConfig extends ControllerConfig {
  transforms: Array<ServiceDefinition>;
}

export interface EchoControllerOptions extends ControllerOptions<EchoControllerConfig> {
  compiler: TemplateCompiler;
}

@Inject('compiler')
export class EchoController extends BaseController<EchoControllerConfig> implements Controller {
  protected readonly transforms: Array<Transform>;

  constructor(options: EchoControllerOptions) {
    super(options);

    this.transforms = [];
  }

  public async handle(cmd: Command): Promise<void> {
    this.logger.debug({ cmd }, 'echoing command');

    let data = Message.reply(cmd.context, TYPE_TEXT, cmd.toString());
    for (const transform of this.transforms) {
      const [head, ...rest] = await transform.transform(cmd, data);
      data = head;
      if (rest.length) {
        this.logger.info({ rest }, 'echo transform discarding extra messages');
      }
    }
    return this.bot.send(data);
  }
}