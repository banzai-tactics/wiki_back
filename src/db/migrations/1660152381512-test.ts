import {
    MigrationInterface, QueryRunner, Table,
    TableIndex,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class test1660152381512 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "token",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "username",
                        type: "varchar",
                    },
                    {
                        name: "lang",
                        type: "varchar",
                    },
                ],
            }),
            true,
        )


        await queryRunner.createTable(
            new Table({
                name: "search",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "searchTitle",
                        type: "varchar",
                    },
                    {
                        name: "searchTime",
                        type: "integer",
                    },
                ],
            }),
            true,
        )
        await queryRunner.addColumn(
            "search",
            new TableColumn({
                name: "userToken",
                type: "uuid",
            }),
        )

        await queryRunner.createForeignKey(
            "search",
            new TableForeignKey({
                columnNames: ["userToken"],
                referencedColumnNames: ["token"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
        )



    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("search")
        const foreignKey : TableForeignKey | undefined = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("userToken") !== -1,
        )
        await queryRunner.dropForeignKey("search", foreignKey!)
        await queryRunner.dropColumn("search", "userToken")
        await queryRunner.dropTable("search")
        await queryRunner.dropTable("user")

    }

}
