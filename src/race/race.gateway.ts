import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RaceService } from './race.service';
import { ConnectedDto } from './dto/connected.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { RaceEvents } from './events/race-event.enum';
import { StartRaceDto } from './dto/start-race.dto';
import { UpdateTypingProgress } from './dto/update-typing-progress.dto';
import { ExtendStartTimeDto } from './dto/extend-start-time.dto';
import { RaceResultService } from '../race-result/race-result.service';
import { EndRaceDto } from './dto/end-race.dto';
import { UseFilters } from '@nestjs/common';
import { WebScoketExceptionFilter } from '../filters/websocket-exception.filter';

@UseFilters(new WebScoketExceptionFilter())
@WebSocketGateway({ namespace: 'race', transports: ['websocket'] })
export class RaceGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly raceService: RaceService,
    private readonly raceResultService: RaceResultService,
  ) {}

  onConnection(
    @MessageBody() payload: ConnectedDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('client connected', payload);
    client.join(payload.userId);
  }

  @SubscribeMessage(RaceEvents.JOIN_RACE)
  async joinLobby(@MessageBody() payload: JoinLobbyDto) {
    const { userId, raceId } = payload;

    const participants = await this.raceService.joinRace(userId, raceId);

    this.sendToRoom(raceId, RaceEvents.UPDATE_PARTICIPANTS, participants);
  }

  @SubscribeMessage(RaceEvents.START_RACE)
  async startRace(@MessageBody() payload: StartRaceDto) {
    const { raceId } = payload;

    const updatedRace = await this.raceService.startRace(raceId);

    this.sendToRoom(raceId, RaceEvents.START_COUNTDOWN, updatedRace);
  }

  @SubscribeMessage(RaceEvents.TYPING_PROGRESS)
  async updateTypingProgress(@MessageBody() payload: UpdateTypingProgress) {
    const { raceId, charIndex, wordIndex, userId } = payload;

    this.sendToRoom(raceId, RaceEvents.TYPING_PROGRESS, {
      raceId,
      charIndex,
      wordIndex,
      userId,
    });
  }

  @SubscribeMessage(RaceEvents.EXTEND_START_TIME)
  async extendStartTime(@MessageBody() payload: ExtendStartTimeDto) {
    const { id, duration } = payload;

    const updatedRace = this.raceService.extendStartTime(id, duration);

    this.sendToRoom(id, RaceEvents.EXTEND_START_TIME, updatedRace);
  }

  @SubscribeMessage(RaceEvents.END_RACE)
  async endRace(@MessageBody() payload: EndRaceDto) {
    const raceResults = await this.raceService.endRace(payload);

    this.sendToRoom(payload.raceId, RaceEvents.BROADCAST_RESULTS, raceResults);
  }
  sendToRoom(raceId: string, event: RaceEvents, data: any) {
    this.server.to(raceId).emit(event, data);
  }
}
