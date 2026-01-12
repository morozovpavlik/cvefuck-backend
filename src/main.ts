import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      logger: new ConsoleLogger({
        json: true,
      }),
    }
  );
  app.setGlobalPrefix("v1");
  app.enableCors({
    origin: "http://localhost:6666",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
