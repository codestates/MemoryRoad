import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641885576244 implements MigrationInterface {
  name = 'memoryMigration1641885576244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Pictures\` DROP FOREIGN KEY \`FK_14720b2966b5d5ad0ccea65f55f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Pictures\` ADD CONSTRAINT \`FK_14720b2966b5d5ad0ccea65f55f\` FOREIGN KEY (\`pinId\`) REFERENCES \`Pins\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Pictures\` DROP FOREIGN KEY \`FK_14720b2966b5d5ad0ccea65f55f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Pictures\` ADD CONSTRAINT \`FK_14720b2966b5d5ad0ccea65f55f\` FOREIGN KEY (\`pinId\`) REFERENCES \`Pins\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
