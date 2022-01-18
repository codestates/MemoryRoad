import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1642510348310 implements MigrationInterface {
  name = 'memoryMigration1642510348310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Routes\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`startTime\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`startTime\` varchar(10) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`endTime\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`endTime\` varchar(10) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`endTime\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`endTime\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`startTime\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`startTime\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Routes\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
