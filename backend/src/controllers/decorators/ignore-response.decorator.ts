import { SetMetadata } from '@nestjs/common';

export const IgnoreResponse = () => SetMetadata('ignoreResponse', true);
