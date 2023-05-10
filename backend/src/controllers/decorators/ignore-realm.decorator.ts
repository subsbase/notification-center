import { SetMetadata } from "@nestjs/common";

export const IgnoreRealm = () => SetMetadata('ignoreRealm', true);