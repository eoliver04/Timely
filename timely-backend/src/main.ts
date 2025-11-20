import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { time } from 'console';
import { uptime } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  //configuracion de cors 

  app.enableCors({
    origin:[
      'http://localhost:3000',  // Tu frontend Next.js
      'http://localhost:3002',  
      'http://127.0.0.1:3001',
      'https://timely-omega-eight.vercel.app',
      'https://timely-git-dev-eolover04s-projects.vercel.app/'//branch dev 
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
  });
  app.use('/health',(req,res)=>{
    res.status(200).json({
      status:'ok',
      timestamp: new Date().toISOString(),
      uptime: uptime()
    });
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
