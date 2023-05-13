import { SetMetadata } from '@nestjs/common';

export const Authorize = () => SetMetadata('authRequired', true);
