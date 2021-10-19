import { Controller, Get, Logger, Query } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria,interface';

@Controller()
export class AppController 
{
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name)

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria
  ) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    await this.appService.criarCategoria(categoria);
  }

  // Responder, vai devolver algo para o client
  @MessagePattern('consultar-categorias')
  async consultarCategorias (@Payload() id: string) {
    if (id) {
      return this.appService.consultarCategoriaPeloId(id);
    }
    return this.appService.consultarTodasCategorias();
  }
}
