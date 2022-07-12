import { ValidationError } from "express-validator";

export type ErrorsType = Error[] | ValidationError[];