import { AsyncThunkAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

const useDispatcher = () => {
  const dispatch = useDispatch();

  const dispatcher = (action: any) => {
    dispatch(action as unknown as AnyAction)
  }

  return dispatcher;
}

export default useDispatcher;