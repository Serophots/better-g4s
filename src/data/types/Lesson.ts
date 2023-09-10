import {Homework} from "./Homework";
import {Todo} from "./Todo";

interface Lesson {
	name: string,
	code: string,
	date: string,
	subject_id: string,

	homeworks_set: Homework[],
	homeworks_due: Homework[],
	todo: Todo[] //Free periods
}
export type {Lesson}