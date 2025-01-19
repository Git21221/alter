import { createSlice } from "@reduxjs/toolkit";
import { TaskCategory, taskStatus, TaskStatus } from "../../constant/taskType";

export interface Task {
  id: number,
  title: string,
  description: string,
  category: TaskCategory | "",
  status: TaskStatus | "",
  dueOn: string | null,
  attachment: [],
}

export interface CheckedTask {
  id: number,
}

export interface Tasks {
  tasks: TaskStatus[],
  isFiltering: boolean,
  filteredTasks: TaskStatus[],
  checkedTask: CheckedTask[],
}

const initialState: Tasks = {
  tasks: taskStatus,
  isFiltering: false,
  filteredTasks: taskStatus,
  checkedTask: [],
}

const TaskSlice = createSlice({
  name: "Task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      let status = action.payload.task.status.name; //status of the task from the payload
      let idx = state.tasks.findIndex((obj) => obj.name.toLowerCase() === status); //find the index of the task
      state.tasks[idx].tasks.push(action.payload.task); //push the task to the tasks array
    },

    editWholeTask: (state, action) => {
      console.log(action.payload.task);
      const { id, status } = action.payload.task;

      // Find the current group containing the task
      let currentGroupIndex = -1;
      let taskToUpdate: Task | undefined;

      state.tasks.forEach((group, groupIndex) => {
        const taskIndex = group.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          currentGroupIndex = groupIndex;
          taskToUpdate = { ...group.tasks[taskIndex] }; // Clone the task
        }
      });

      // If the task was found and its status is updated
      if (taskToUpdate && taskToUpdate.status !== status) {
        // Remove the task from the current group
        if (currentGroupIndex !== -1) {
          state.tasks[currentGroupIndex].tasks = state.tasks[currentGroupIndex].tasks.filter(
            (task) => task.id !== id
          );
        }

        // Add the task to the new group based on its updated status
        const targetGroupIndex = state.tasks.findIndex((group) => group.name === status.name);
        if (targetGroupIndex !== -1) {
          state.tasks[targetGroupIndex].tasks.push(action.payload.task);
        }
      } else if (taskToUpdate) {
        // If the status is unchanged, just update the task within the same group
        state.tasks = state.tasks.map((group) => {
          group.tasks = group.tasks.map((task) => (task.id === id ? action.payload.task : task));
          return group;
        });
      }
    },

    updateTaskStatus: (state, action) => {
      const { currStatus, updatedStatus, id } = action.payload.task;

      // Find and remove the task from the current status group
      let taskToUpdate: Task | null = null as Task | null;
      state.tasks.forEach((group) => {
        if (group.name === currStatus) {
          const taskIndex = group.tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            taskToUpdate = { ...group.tasks[taskIndex] }; // Clone the task to update
            group.tasks.splice(taskIndex, 1); // Remove the task from the current group
          }
        }
      });

      // Add the task to the updated status group with the updated status
      if (taskToUpdate) {
        const newGroupIndex = state.tasks.findIndex((group) => group.name === updatedStatus.name);
        if (newGroupIndex !== -1) {
          taskToUpdate.status = updatedStatus; // Update the task's status
          state.tasks[newGroupIndex].tasks.push(taskToUpdate); // Add the updated task to the new group
        }
      }
    },

    updateTaskCategory: (state, action) => {
      let status = action.payload.task.status; //status of the task from the payload
      let id = action.payload.task.id; //id of the task from the payload
      let category = action.payload.task.category; //category of the task from the payload
      state.tasks.forEach((obj) => {
        if (obj.name === status) {
          obj.tasks.forEach((task) => {
            if (task.id === id) {
              task.category = category; //update the category of the task
            }
          });
        }
      });
    },

    deleteTask: (state, action) => {
      let status = action.payload.task.status; //status of the task from the payload
      let id = action.payload.task.id; //id of the task from the payload
      state.tasks.forEach((obj) => {
        if (obj.name === status.name) {
          obj.tasks = obj.tasks.filter((task) => task.id !== id); //delete the task from the tasks array
        }
      });
    },

    deleteAllTaskByCheckList: (state) => {
      state.tasks = state.tasks.filter((group) => {
        group.tasks = group.tasks.filter((task) => !state.checkedTask.includes(task.id as unknown as CheckedTask));
        return true;
      })
      state.checkedTask = [];
    },

    setCheckedTask: (state, action) => {
      state.checkedTask.push(action.payload.checkedTask);
    },

    removeCheckedTask: (state, action) => {
      console.log(action.payload.checkedTask);
      let id = action.payload.checkedTask;
      state.checkedTask = state.checkedTask.filter((task) => task !== id);
    },

    removeAllCheckedTask: (state) => {
      state.checkedTask = [];
    },

    updateStatusOfAllTasks: (state, action) => {
      const updatedStatus = action.payload.status;
      for (const group of state.tasks) {
        const taksToMove = group.tasks.filter((task) => state.checkedTask.includes(task.id as unknown as CheckedTask));

        group.tasks = group.tasks.filter((task) => !state.checkedTask.includes(task.id as unknown as CheckedTask));

        for (const task of taksToMove) {
          task.status = {
            id: updatedStatus === "todo" ? 1 : updatedStatus === "inprogress" ? 2 : 3,
            name: updatedStatus,
            title: updatedStatus,
            tasks: [],
          };
          const targetGroup = state.tasks.find((group) => group.name === updatedStatus);
          if (targetGroup) {
            targetGroup.tasks.push(task);
          }
        }
      }
    },

    setFiltering: (state, action) => {
      state.isFiltering = action.payload;
    },

    filterTasks: (state, action) => {
      const { category, dueDate, searchQuery } = action.payload;
      console.log(category, dueDate, searchQuery);
    
      state.filteredTasks = state.tasks.map((group) => {
        return {
          ...group,
          tasks: group.tasks.filter((task) => {
            const hasCategory = category.name ? task.category && task.category.name === category.name : true;
            const hasDueDate = dueDate ? task.dueOn === dueDate : true;
            const hasSearchText = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            return hasCategory && hasDueDate && hasSearchText;
          }),
        };
      });
    }    
  },
})

export default TaskSlice;
export const { addTask, editWholeTask, updateTaskStatus, deleteTask, deleteAllTaskByCheckList, setCheckedTask, removeCheckedTask, removeAllCheckedTask, updateStatusOfAllTasks, setFiltering, filterTasks } = TaskSlice.actions;