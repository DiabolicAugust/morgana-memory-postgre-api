import { MigrationInterface, QueryRunner } from "typeorm";

export class DescriptionAdded1712087439493 implements MigrationInterface {
    name = 'DescriptionAdded1712087439493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "description"`);
    }

}
