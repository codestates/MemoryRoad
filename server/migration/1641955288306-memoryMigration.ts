import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641955288306 implements MigrationInterface {
  name = 'memoryMigration1641955288306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`latitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`latitude\` decimal(18,15) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`longitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`longitude\` decimal(18,15) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`longitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`longitude\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`latitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`latitude\` int NOT NULL`,
    );
  }
}
