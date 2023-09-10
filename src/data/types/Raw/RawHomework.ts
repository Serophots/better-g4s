interface RawHomework {
	id: string,
	title: string,
	details: string,
	due_date: string,
	set_date: string,
	subject_id: string,
	subject_name: string,
	group_name: string,
	mark_as_done: boolean
}

export type {RawHomework}