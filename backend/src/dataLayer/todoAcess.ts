import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
        ){}
    
    async getAllTodos(userId: string): Promise<TodoItem[]> {
            logger.info('Get all todos function called')
    
            const result = await this.docClient.query({
                TableName : this.todosTable,
                IndexName : this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeNames: {
                    ':useId': userId                }


                
            }).promise()

            const items = result.Items
            return items as TodoItem[]

        }  
    
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {

        logger.info('Create todo item function called')

        await this.docClient.put({
            TableName:this.todosTable,
            Item:todoItem
        }).promise()

        return todoItem
    }

    // async updateTodoItem(
    //     todoId: string,
    //     userId: string,
    //     todoUpdate: TodoUpdate,
    // )
 
        
}
   