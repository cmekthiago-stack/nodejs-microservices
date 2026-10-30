import { createTaskInput } from "../schemas/task.schemas";
import * as taskRepository from "../repositories/task.repository";
import { convertToPublicTask } from "../utils/task.utils";

export async function createTask(input: createTaskInput, userId: string) {
  const newlyCreatedTask = await taskRepository.createTask({
    title : input.title,
    createdBy: userId
  });
  // TODO: implement task creation logic
  return convertToPublicTask(newlyCreatedTask);
}