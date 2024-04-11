import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { NoteService } from "./note.service.js";
import { Note } from "./entity/note.entity.js";
import { CreateNoteDto } from "./entity/dto/create-note.dto.js";
import { UpdateNoteDto } from "./entity/dto/update-note.dto.js";
import { ErrorsCatchingFilter } from "../filters/error-catch.filter.js";

@Controller("note")
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getList(): Promise<Note[]> {
    return this.noteService.getList();
  }

  @Get("/:id")
  async getById(@Param("id") id: number): Promise<Note[]> {
    return this.noteService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number) {
    return this.noteService.delete(id);
  }

  @Patch("/:id")
  @UseFilters(ErrorsCatchingFilter)
  @UsePipes(ValidationPipe)
  async update(@Body() dto: UpdateNoteDto, @Param("id") id: number) {
    return this.noteService.update(dto, id);
  }
}
