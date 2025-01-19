import { Task } from "../feature/slices/Task.slice"

export interface TaskType {
  TODO: string,
  IN_PROGRESS: string,
  COMPLETED: string,
}

export interface TaskCategory {
  id: number,
  name: string,
  title: string,
}

export interface TaskStatus {
  id: number,
  name: string,
  title: string,
  tasks: Task[],
}

export const taskType: TaskType = {
  TODO: "todo",
  IN_PROGRESS: "inprogress",
  COMPLETED: "completed",
}

export const taskCategory: TaskCategory[] = [
  {
    id: 1,
    name: "work",
    title: "Work",
  },
  {
    id: 2,
    name: "personal",
    title: "Personal",
  },
]

export const taskStatus: TaskStatus[] = [
  {
    id: 1,
    name: taskType.TODO,
    title: "Todo",
    tasks: []
  },
  {
    id: 2,
    name: taskType.IN_PROGRESS,
    title: "In Progress",
    tasks: []
  },
  {
    id: 3,
    name: taskType.COMPLETED,
    title: "Completed",
    tasks: []
  },
]

export type Filters = {
  category: string | null;
  dueDate: Date | null;
  searchQuery: string | null;
};