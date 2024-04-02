import { Controller, Get } from '@nestjs/common';
import { NoteService } from './note.service.js';
import { Note } from './entity/note.entity.js';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getList(): Promise<Note[]> {
    return this.noteService.getList();
  }
}
