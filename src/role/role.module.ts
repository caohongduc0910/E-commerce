import { Module } from '@nestjs/common';
import { RolesGuard } from './role.guard';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [RolesGuard],
})
export class RoleModule {}
