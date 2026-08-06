import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { KeysModule } from '../keys/keys.module';
import { SignaturesController } from './signatures.controller';

@Module({
  controllers: [SignaturesController],
  providers: [SignaturesService],
  exports: [SignaturesService],
  imports: [KeysModule],
})
export class SignaturesModule {}
