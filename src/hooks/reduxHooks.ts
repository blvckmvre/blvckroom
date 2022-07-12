import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../store/store";

export const useTypeSelector: TypedUseSelectorHook<RootState> = useSelector; 
export const useTypeDispatch = () => useDispatch<DispatchType>();