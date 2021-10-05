import { PipeTransform } from '@nestjs/common';

export abstract class StringToIntPipe<T> implements PipeTransform<T, T> {
  abstract props: string[];

  transform(value: T): T {
    this.props.forEach((prop) => {
      if (!!value[prop]) {
        value[prop] = Number(value[prop]);
      }
    });

    return value;
  }
}
