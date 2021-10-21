import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { channel } from 'diagnostics_channel';
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
      const filteredError = ackErrors.filter(async ackError => {
        return error.message.includes(ackError);
      })

      if (filteredError) {
        await channel.ack(originalMessage);
      }
    }
  }

  // Responder, vai devolver algo para o client
  @MessagePattern('consultar-categorias')
  async consultarCategorias (
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (id) {
        return await this.appService.consultarCategoriaPeloId(id);
      }
      return await this.appService.consultarTodasCategorias();
    } finally {
      channel.ack(originalMessage);
    }
  }

   @EventPattern('atualizar-categoria')
   async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext)
   {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { id, categoria } = data;

      await this.appService.atualizarCategoria(id, categoria);
      await channel.ack(originalMessage);
    } catch(error) {
      const filteredError = ackErrors.filter(async ackError => {
        return error.message.includes(ackError);
      })

      if (filteredError) {
        await channel.ack(originalMessage);
      } 
    }
   }
}
