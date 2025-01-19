import { configureStore } from "@reduxjs/toolkit";
import ListBoardViewSlice from "../slices/ListBoardView.slice";
import TaskSlice from "../slices/Task.slice";
import addTaskSlice from "../slices/addTask.slice";

export const store = configureStore({
  reducer: {
    ListBoardView: ListBoardViewSlice.reducer,
    Task: TaskSlice.reducer,
    AddTask: addTaskSlice.reducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;