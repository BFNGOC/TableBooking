import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),

        onConnectionCreate: (connection) => {
          console.log('MongoDB connected successfully');
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    UsersModule,

    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
