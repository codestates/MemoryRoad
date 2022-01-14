import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641970464271 implements MigrationInterface {
  name = 'memoryMigration1641970464271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Wards\` ADD \`routesNumber\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Wards\` DROP COLUMN \`routesNumber\``,
    );
  }
}
