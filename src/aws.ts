import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, DeleteTableCommand, PutItemCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { AWSRegions } from "./types/aws";
import { Vendor } from "./types/twitter";
import { marshall } from "@aws-sdk/util-dynamodb";

// Define the AWS region
const dynamoDbClient = new DynamoDBClient({ region: AWSRegions.EU_CENTERAL_1 });

// Create table
export const createTable = async (params: CreateTableCommandInput) => {
    try {
        const command = new CreateTableCommand(params);
        const result = await dynamoDbClient.send(command);
        console.log("Table created", result);
        return result;
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        throw new Error("Failed to create table");
    }
};

// Describe table
export const describeTable = async (tableName: string) => {
    try {
        const command = new DescribeTableCommand({ TableName: tableName });
        const result = await dynamoDbClient.send(command);
        console.log("Table description", result);
        return result;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("Failed to describe table");
    }
};

// Delete table
export const deleteTable = async (tableName: string) => {
    try {
        const command = new DeleteTableCommand({ TableName: tableName });
        const result = await dynamoDbClient.send(command);
        console.log("Table deleted", result);
        return result;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("Failed to delete table");
    }
};

// Create record
export const createRecord = async (tableName: string, vendor: Vendor) => {
    try {
        const params = {
            TableName: tableName,
            Item: marshall({
                ...vendor,
            }) as Record<string, any>,  // Explicitly cast to match expected type
        };

        const result = await dynamoDbClient.send(new PutItemCommand(params));
        console.log("Record created", result);
        return result;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("Failed to create record");
    }
};