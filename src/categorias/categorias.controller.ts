import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Categoria } from 'src/categorias/interfaces/categoria,interface';
import { CategoriasService } from './categorias.service';

const ackErrors: string[] = ['E11000'];

@Controller('categorias')
export class CategoriasController {

    constructor(private readonly categoriasService: CategoriasService) {}

    logger = new Logger(CategoriasController.name)
  
    @EventPattern('criar-categoria')
    async criarCategoria(
      @Payload() categoria: Categoria,
      @Ctx() context: RmqContext
    ) {
  
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
  
      this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
  
      try {
        await this.categoriasService.criarCategoria(categoria);
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
          return await this.categoriasService.consultarCategoriaPeloId(id);
        }
        return await this.categoriasService.consultarTodasCategorias();
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
  
        await this.categoriasService.atualizarCategoria(id, categoria);
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
