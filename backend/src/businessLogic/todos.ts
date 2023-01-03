import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic


const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    logger.info('Get todos based on user')
    return todosAcess.getAllTodos(userId)
}


export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info("Create new todo item")

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }
    return await todosAcess.createTodoItem(newItem)
}

export async function updateTodo(
    userId: string,
    todoId: string,
    todoUpdate: UpdateTodoRequest
): Promise<TodoUpdate>{

    logger.info("ready to update todo")
    return await todosAcess.updateTodoItem(userId,todoId,todoUpdate)

}

export async function deleteTodo(
    todoId: string,
    userId: string,
):Promise<string>{
    logger.info("Delete todo from list")
    return todosAcess.deleteTodoItem(todoId,userId)
}

export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
    ): Promise<string>{
        logger.info("create attachment presigned url",userId,todoId)
        return attachmentUtils.getUploadUrl(todoId)
    }
