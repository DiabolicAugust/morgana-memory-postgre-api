import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsAdded1712771345503 implements MigrationInterface {
    name = 'TimestampsAdded1712771345503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "note" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "createdAt"`);
    }

}
