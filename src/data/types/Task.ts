type Task =  {
	id: string,
	title: string,
	details: string,
	due_date: Date,
	set_date: Date,

	subject_name: string,
	subject_code: string,
	subject_id: string,

	is_completed: boolean
}

// interface LessonTask extends Task {
// 	category: string
// }

type LessonTask = Task & {
	category: string
}

export type {Task, LessonTask}