interface RawLesson {
	subject_name: string | null,
	subject_id: string,
	group_name: string | null,
	class_id: string,
	date: string,
	teacher_list: {
		[teacher_id: number]: string
	},
	room_list: string,
}

export type {RawLesson}