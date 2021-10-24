import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    logger = new Logger(JogadoresController.name)

    @EventPattern('criar-jogador')
    async criarJogador(
      @Payload() jogador: Jogador,
      @Ctx() context: RmqContext
    ) {
  
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

        try {
            await this.jogadoresService.criarJogador(jogador);
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
    @MessagePattern('consultar-jogadores')
    async consultarJogadores (
        @Payload() id: string,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
    
        try {
            if (id) {
                return await this.jogadoresService.consultarJogadorPeloId(id);
            }
            return await this.jogadoresService.consultarTodosJogadores();
        } finally {
            channel.ack(originalMessage);
        }
    }
      
    @EventPattern('atualizar-jogador')
    async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext)
    {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const { id, jogador } = data;

            await this.jogadoresService.atualizarJogador(id, jogador);
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

    @EventPattern('deletar-jogador')
    async deletarJogador(@Payload() id: string, @Ctx() context: RmqContext)
    {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.jogadoresService.deletarJogador(id);
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
