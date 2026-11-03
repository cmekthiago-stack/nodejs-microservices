import { createTaskInput, patchTaskInput } from "../schemas/task.schemas";
import * as taskRepository from "../repositories/task.repository";
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";

export async function createTask(input: createTaskInput, userId: string) {
  const newlyCreatedTask = await taskRepository.createTask({
    title : input.title,
    createdBy: userId
  });
  // TODO: implement task creation logic
  return convertToPublicTask(newlyCreatedTask);
}

export async function listTasks(userId: string, role: string){
  if(!userId || !role){
    throw new AppError("Missing user identity", 401)
  }
  const tasks = await taskRepository.listTasks({userId, role});

  return tasks.map(convertToPublicTask)
}

export async function getSingleTask(id: string, userId: string, role: string){
  const task = await taskRepository.findSingleTaskById(id)

  if(!task){
    throw new AppError("Task not found", 404)
  }

  if(role !== "ADMIN" && task.created_by !== userId){
    throw new AppError("Forbidden", 403)
  }
  return convertToPublicTask(task)
}

export async function deleteSingleTask(id: string, userId: string, role: string){
  if(role !== "ADMIN"){
    throw new AppError("Forbidden", 403)
  }
  const task = await taskRepository.findSingleTaskById(id)
  if(!task){
    throw new AppError("Task not found", 404)
  }

  await taskRepository.deleteSingleTaskById(id)

  return {id}
}

export async function patchSingleTask(
  id: string,
  input: patchTaskInput,
  userId: string,
  role: string
){
  const task = await taskRepository.findSingleTaskById(id)

  if(!task){
    throw new AppError("Task not found", 404)
  }

  if(role !== "ADMIN" && task.created_by !== userId){
    throw new AppError("Forbidden", 403)
  }

  const updatedTask = await taskRepository.patchSingleTaskById(id, input)
  if(!updatedTask){
    throw new AppError("Task not found", 404)
  }
  return convertToPublicTask(updatedTask)
}