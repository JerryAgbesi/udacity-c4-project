import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
        ){}
    
    async getAllTodos(userId: string): Promise<TodoItem[]> {
            logger.info('Get all todos')
    
            const result = await this.docClient.query({
                TableName : this.todosTable,
                IndexName : this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId                }


                 
            }).promise()

            const todos = result.Items
            return todos as TodoItem[]

        }  
    
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {

        logger.info('Create new todo item')

        const newTodo = await this.docClient.put({
            TableName:this.todosTable,
            Item:todoItem
        }).promise()

        logger.info('Todo item created successfully',newTodo)

        return todoItem as TodoItem
    }

    //get url for attachment assigned to a todo item
    async updateTodoAttachmentUrl(
        todoId: string,
        userId: string,
        attachmentUrl: string) : Promise<void> {
        
        logger.info("update attachcment url")
        await this.docClient.update({
            TableName: this.todosTable,
            Key:{
                todoId,
                userId
            },
            UpdateExpression:'set attachmentUrl = :attachmentU rl',
            ExpressionAttributeValues: {
                ':attachmentUrl' : attachmentUrl
            }
        }).promise()

        }
 

    async updateTodoItem(
        userId: string,
        todoId: string,
        todoUpdate: TodoUpdate
    ):Promise<TodoUpdate> {

        const result = await this.docClient
        .update({
            TableName: this.todosTable,
            Key:{
                todoId,userId
            },
            UpdateExpression: 'set #name = :name, dueDate= :dueDate, done = :done',
            ExpressionAttributeValues : {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done,
            },
            ExpressionAttributeNames:{
                '#name':'name',

            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        const todoItemUpdate = result.Attributes 
        logger.info('todo item updated',todoItemUpdate)
        return todoItemUpdate as TodoUpdate
        
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('Ready to delete todo item')

        const result = await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                todoId,userId
            }

        }).promise()
        logger.info("todo item deleted",result)
        return todoId as string

    }


        
}
   