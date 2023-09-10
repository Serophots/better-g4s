import {Homework} from "./Homework";
import {Todo} from "./Todo";

interface Lesson {
	id: string,
	name: string,
	code: string,
	date: Date,
	subject_id: string,

	lesson_tasks: Homework[],
	homeworks_set: Homework[],
	homeworks_due: Homework[],
	todo: Todo[], //Free periods
}
export type {Lesson}