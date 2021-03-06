import { Inject } from 'noicejs';

import { CheckRBAC, Controller, ControllerData, Handler } from '.';
import { Command, CommandVerb } from '../entity/Command';
import { Context } from '../entity/Context';
import { BaseController, BaseControllerOptions } from './BaseController';

export const NOUN_ECHO = 'echo';

export type EchoControllerData = ControllerData;

@Inject()
export class EchoController extends BaseController<EchoControllerData> implements Controller {
  constructor(options: BaseControllerOptions<EchoControllerData>) {
    super(options, 'isolex#/definitions/service-controller-echo', [NOUN_ECHO]);
  }

  @Handler(NOUN_ECHO, CommandVerb.Create)
  @CheckRBAC()
  public async createEcho(cmd: Command, ctx: Context): Promise<void> {
    this.logger.debug({ cmd, ctx }, 'echoing command');
    return this.transformJSON(cmd, {}, ctx);
  }

  @Handler(NOUN_ECHO, CommandVerb.Help)
  public async getHelp(cmd: Command, ctx: Context): Promise<void> {
    return this.reply(ctx, this.defaultHelp(cmd));
  }
}
