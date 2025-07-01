import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { TaxonomyController } from './taxonomy.controller';
import { Taxonomy, TaxonomySchema } from './taxonomy.entity';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Taxonomy.name, schema: TaxonomySchema },
    ]),
    UserModule,
    PermissionModule,
  ],
  controllers: [TaxonomyController],
  providers: [TaxonomyService],
  exports: [TaxonomyService]
})
export class TaxonomyModule {}
