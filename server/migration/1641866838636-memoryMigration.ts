import {MigrationInterface, QueryRunner} from "typeorm";

export class memoryMigration1641866838636 implements MigrationInterface {
    name = 'memoryMigration1641866838636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP FOREIGN KEY \`FK_c768595357d54ea08df91d206d5\``);
        await queryRunner.query(`ALTER TABLE \`Pictures\` DROP FOREIGN KEY \`FK_14720b2966b5d5ad0ccea65f55f\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`startTime\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD \`startTime\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD \`endTime\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD CONSTRAINT \`FK_c768595357d54ea08df91d206d5\` FOREIGN KEY (\`routesId\`) REFERENCES \`Routes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Pictures\` ADD CONSTRAINT \`FK_14720b2966b5d5ad0ccea65f55f\` FOREIGN KEY (\`pinId\`) REFERENCES \`Pins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Pictures\` DROP FOREIGN KEY \`FK_14720b2966b5d5ad0ccea65f55f\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP FOREIGN KEY \`FK_c768595357d54ea08df91d206d5\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD \`endTime\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Pins\` DROP COLUMN \`startTime\``);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD \`startTime\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Pictures\` ADD CONSTRAINT \`FK_14720b2966b5d5ad0ccea65f55f\` FOREIGN KEY (\`pinId\`) REFERENCES \`Pins\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Pins\` ADD CONSTRAINT \`FK_c768595357d54ea08df91d206d5\` FOREIGN KEY (\`routesId\`) REFERENCES \`Routes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
