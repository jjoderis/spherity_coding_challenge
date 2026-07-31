import { Module } from '@nestjs/common';
import { CredentialsModule } from './credentials/credentials.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    CredentialsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
})
export class AppModule {}
