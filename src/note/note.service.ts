import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./entity/note.entity.js";
import { Repository } from "typeorm";
import { CreateNoteDto } from "./entity/dto/create-note.dto.js";
import { Strings } from "../data/strings.js";
import { Entities } from "../data/enums.js";
import { UpdateNoteDto } from "./entity/dto/update-note.dto.js";
import { identity } from "rxjs";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  async getList(): Promise<Note[]> {
    return this.noteRepository.find();
  }

  async getById(id: number) {
    const note = await this.noteRepository.findBy({ id: id });
    if (!note)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Note, id),
        HttpStatus.BAD_REQUEST,
      );
    return note;
  }

  async create(dto: CreateNoteDto) {
    const note = await this.noteRepository.save(dto);
    return note;
  }

  async delete(id: number) {
    const note = await this.noteRepository.findOneBy({ id: id });
    if (!note)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Note, id),
        HttpStatus.BAD_REQUEST,
      );
    const noteDeletedInfo = await this.noteRepository.delete({
      id: Number(id),
    });
    return { note: note, deleted: noteDeletedInfo.affected > 0 };
  }

  async update(dto: UpdateNoteDto, id: number) {
    const note = await this.noteRepository.findOneBy({ id: id });
    if (!note)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Note, id),
        HttpStatus.BAD_REQUEST,
      );
    const updateResult = await this.noteRepository
      .createQueryBuilder()
      .update(Note)
      .set(dto)
      .where("id = :id", { id: id })
      .returning("*")
      .execute();

    if (updateResult.raw[0].length === 0) {
      console.log(updateResult);
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Note, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    return updateResult.raw[0];
  }
}
