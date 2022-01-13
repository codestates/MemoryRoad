import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641903165246 implements MigrationInterface {
  name = 'memoryMigration1641903165246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Routes\` ADD CONSTRAINT \`FK_16c7c0450185e44f369ca0b224f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Routes\` DROP FOREIGN KEY \`FK_16c7c0450185e44f369ca0b224f\``,
    );
  }
}
