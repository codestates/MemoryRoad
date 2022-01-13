import { MigrationInterface, QueryRunner } from 'typeorm';

export class memoryMigration1641967141971 implements MigrationInterface {
  name = 'memoryMigration1641967141971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_16c7c0450185e44f369ca0b224f\` ON \`Routes\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Wards\` DROP COLUMN \`routesNumber\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` ADD \`oauthLogin\` varchar(10) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` ADD \`saltedPassword\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` ADD \`oauthCI\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` ADD \`profileImage\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RoutesWards\` ADD PRIMARY KEY (\`wardId\`, \`routeId\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`latitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`latitude\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`longitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`longitude\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` ADD UNIQUE INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_0901f84d38819e7297ca0cbe82\` ON \`RoutesWards\` (\`wardId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_98ee1cbf05aa263792f0be5480\` ON \`RoutesWards\` (\`routeId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RoutesWards\` ADD CONSTRAINT \`FK_0901f84d38819e7297ca0cbe822\` FOREIGN KEY (\`wardId\`) REFERENCES \`Wards\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RoutesWards\` ADD CONSTRAINT \`FK_98ee1cbf05aa263792f0be54808\` FOREIGN KEY (\`routeId\`) REFERENCES \`Routes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`RoutesWards\` DROP FOREIGN KEY \`FK_98ee1cbf05aa263792f0be54808\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`RoutesWards\` DROP FOREIGN KEY \`FK_0901f84d38819e7297ca0cbe822\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_98ee1cbf05aa263792f0be5480\` ON \`RoutesWards\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0901f84d38819e7297ca0cbe82\` ON \`RoutesWards\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\``,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`longitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`longitude\` decimal(18,15) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`latitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Pins\` ADD \`latitude\` decimal(18,15) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`RoutesWards\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`Users\` DROP COLUMN \`profileImage\``,
    );
    await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`oauthCI\``);
    await queryRunner.query(
      `ALTER TABLE \`Users\` DROP COLUMN \`saltedPassword\``,
    );
    await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`oauthLogin\``);
    await queryRunner.query(
      `ALTER TABLE \`Wards\` ADD \`routesNumber\` int NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_16c7c0450185e44f369ca0b224f\` ON \`Routes\` (\`userId\`)`,
    );
  }
}
