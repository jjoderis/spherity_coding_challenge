import { Module } from '@nestjs/common';
import { CredentialsModule } from './credentials/credentials.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CredentialsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ...(process.env.NODE_ENV !== 'development'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'frontend'),
          }),
        ]
      : []),
  ],
})
export class AppModule {}
