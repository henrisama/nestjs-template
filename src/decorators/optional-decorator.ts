import { applyDecorators } from "@nestjs/common";

export const OptionalDecorator = (
  decorators: ClassDecorator | MethodDecorator | PropertyDecorator,
  shouldApply: boolean,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => (shouldApply ? applyDecorators(decorators) : () => {});
