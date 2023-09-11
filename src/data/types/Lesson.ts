import {LessonTask, Task} from "./Task";

type Lesson = {
	id: string,
	name: string,
	code: string,
	date: Date,
	subject_id: string,

	teacher_name: string,

	room: string,

	tasks: LessonTask[]
}
export type {Lesson}