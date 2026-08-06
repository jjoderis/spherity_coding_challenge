import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { SignaturesModule } from '../signatures/signatures.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService],
  imports: [SignaturesModule, ConfigModule],
})
export class CredentialsModule {}
