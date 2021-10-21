import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria,interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController 
{
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name)

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext
  ) {

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.map( async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMessage);
        }
      })
    }
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
