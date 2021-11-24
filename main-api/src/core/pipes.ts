import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

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

export abstract class StringArrayToIntArrayPipe<T>
  implements PipeTransform<T, T>
{
  abstract props: (keyof T)[];

  transform(value: T, _metadata: ArgumentMetadata): T {
    this.props.forEach((p) => {
      const prop = p as string;
      if (!!value[prop]) {
        const propValues = value[prop] as string[];
        value[prop] = propValues.map((pv): number => +pv);
      }
    });
    return value;
  }
}
