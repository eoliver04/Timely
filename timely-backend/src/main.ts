import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  //configuracion de cors 

  app.enableCors({
    origin:[
      'http://localhost:3001',  // Tu frontend Next.js
      'http://localhost:3002',  
      'http://127.0.0.1:3001',
      'https://timely-omega-eight.vercel.app',
    ],
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept',
      'Origin',
      'X-Requested-With'
    ],
    credentials: true,  // Permite cookies y headers de auth
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
