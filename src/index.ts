import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { createRecord, createTable, deleteTable, describeTable } from './aws';
import { vendors } from "./data/vendors";
import { waitUntilTableExists } from "@aws-sdk/client-dynamodb";

const vendorsTableName = 'vendors';
const vendorsTableParams: CreateTableCommandInput = {
    TableName: vendorsTableName,
    KeySchema: [
        { AttributeName: 'twitterId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'twitterId', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const init = async () => {
    console.log('starting 🟥');
    const vendorsTable = await describeTable(vendorsTableName);

    if (!(vendorsTable instanceof Error)) {
        console.log("Table exists, deleting... ❌❌❌");
        await deleteTable(vendorsTableName);
        await delay(6000);
    }

    await createTable(vendorsTableParams);
    await delay(6000);
    console.log('table created ✅');

    // Wait for the table to become active
    await waitUntilTableExists({ client: new DynamoDBClient({}), maxWaitTime: 30 }, { TableName: vendorsTableName });

    console.log('Table is now active ✅');
    // await createRecord(vendorsTableName, firstVendor);
    for (const vendor of vendors) {
        const res = await createRecord(vendorsTableName, vendor);
        if (res instanceof Error) {
            console.error('Failed to create vendor record', res);
        }
        console.log('vendor record created ✅');
    }
    console.log('vendor record created ✅');
}

init();