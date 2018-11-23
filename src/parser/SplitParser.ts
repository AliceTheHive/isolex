import { isEmpty, trim } from 'lodash';
import * as split from 'split-string';

import { Command } from 'src/entity/Command';
import { Fragment } from 'src/entity/Fragment';
import { Message } from 'src/entity/Message';
import { MimeTypeError } from 'src/error/MimeTypeError';
import { NotImplementedError } from 'src/error/NotImplementedError';
import { BaseParser } from 'src/parser/BaseParser';
import { Parser, ParserData, ParserOptions } from 'src/parser/Parser';
import { TYPE_TEXT } from 'src/utils/Mime';

export interface SplitParserData extends ParserData {
  /**
   * Split every individual character.
   */
  every: boolean;

  /**
   * Split options for delimiters, brackets, etc.
   */
  split: SplitString.SplitOptions;
}

export type SplitParserOptions = ParserOptions<SplitParserData>;

export class SplitParser extends BaseParser<SplitParserData> implements Parser {
  public async complete(frag: Fragment, value: string): Promise<Array<Command>> {
    throw new NotImplementedError();
  }

  public async parse(msg: Message): Promise<Array<Command>> {
    const args = await this.decode(msg);
    this.logger.debug({ args }, 'splitting string');

    return [Command.create({
      context: msg.context,
      data: { args },
      noun: this.data.emit.noun,
      verb: this.data.emit.verb,
    })];
  }

  public async decode(msg: Message): Promise<any> {
    if (msg.type !== TYPE_TEXT) {
      throw new MimeTypeError();
    }

    const body = this.removeTags(msg.body);
    return this.split(body).map(trim).filter((it) => !isEmpty(it));
  }

  public split(msg: string): Array<string> {
    if (this.data.every) {
      return msg.split('');
    } else {
      return split(msg, this.data.split);
    }
  }
}
