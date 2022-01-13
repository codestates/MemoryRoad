import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641822669715 implements MigrationInterface {
  name = 'memoryMigration1641822669715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PinsPlaceKeywords\` ADD CONSTRAINT \`FK_6bad1232863e1ed9eda130fc5b9\` FOREIGN KEY (\`keyword\`) REFERENCES \`PlaceKeywords\`(\`keyword\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PinsPlaceKeywords\` ADD CONSTRAINT \`FK_7fd166a141a8beaf5057eb22775\` FOREIGN KEY (\`pinId\`) REFERENCES \`Pins\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PinsPlaceKeywords\` DROP FOREIGN KEY \`FK_7fd166a141a8beaf5057eb22775\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PinsPlaceKeywords\` DROP FOREIGN KEY \`FK_6bad1232863e1ed9eda130fc5b9\``,
    );
  }
}
