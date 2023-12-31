import {RawLesson} from "./types/Raw/RawLesson";
import {RawClass} from "./types/Raw/RawClass";
import {RawHomework} from "./types/Raw/RawHomework";
import {getWeekDates} from "../dateUtils";
import {Lesson} from "./types/Lesson";
import {Class} from "./types/Class";
import {LessonTask, Task} from "./types/Task";

const URLs = {
	timetable: (startDate: Date, endDate: Date, studentId: string) => `https://api.go4schools.com/web/stars/v1/timetable/student/academic-years/2024/school-id/407/user-type/1/student-id/${studentId}/from-date/${startDate.toDateString()}/to-date/${endDate.toDateString()}`,
	subjects: (studentId: string) => `https://api.go4schools.com/web/stars/v1/teaching/student-groups/academic-years/2024/school-id/407/user-type/1/student-Id/${studentId}`,
	homework: (studentId: string) => `https://api.go4schools.com/web/stars/v1/homework/student/academic-years/2024/school-id/407/user-type/1/student-id/${studentId}`
}

interface RawData {
	timetable: RawLesson[],
	subjects: RawClass[],
	homework: RawHomework[]
}
interface AggregateDataTasks {
	[subject_id: string]: {
		[task_id: string]: Task
	}
}
interface AggregateDataTimetable {
	[weekday_index: number]: Lesson[]
}
interface AggregateData {
	tasks: AggregateDataTasks,
	classes: Class[],
	timetable: AggregateDataTimetable,
}
interface SavedData {
	tasks: AggregateDataTasks
}

const fetchRawData = (authToken: string, studentId: string, weekIndex: number): Promise<RawData> => {
	return new Promise(async (resolve) => {
		try {

			const headers = {"headers": {"authorization": authToken}}

			const [apiTimetableRes, apiSubjectsRes, apiHomeworkRes] = await Promise.all([
				fetch(URLs.timetable(getWeekDates(weekIndex).start, getWeekDates(weekIndex).end, studentId), headers),
				fetch(URLs.subjects(studentId), headers),
				fetch(URLs.homework(studentId), headers),
			]);

			const [apiTimetable, apiSubjects, apiHomework]: [
				{student_timetable: RawLesson[]},
				{student_groups: RawClass[]},
				{student_homework: {homework: RawHomework[]}}
			] = await Promise.all([
				apiTimetableRes.json(),
				apiSubjectsRes.json(),
				apiHomeworkRes.json()
			]);

			console.log("Raw timetable", apiTimetable)

			resolve({
				timetable: apiTimetable.student_timetable,
				subjects: apiSubjects.student_groups,
				homework: apiHomework.student_homework.homework
			})

		}catch(e){
			console.error("Failed to fetch", e)
			resolve({
				timetable: [],
				subjects: [],
				homework: []
			})
		}
	})
}

const aggregateRawData = (rawData: RawData, savedData: SavedData): AggregateData => {

	//Tasks - Add each subject, populate with rawData.homework, then override with savedData
	const tasks: AggregateDataTasks = {};

	rawData.subjects.forEach(subject => {
		tasks[subject.subject_id] = {}
	})

	rawData.homework.forEach(raw => {
		const taskid = "homework_"+raw.id
		tasks[raw.subject_id][taskid] = {
			id: taskid,
			title: raw.title,
			details: raw.details,

			due_date: new Date(raw.due_date),
			set_date: new Date(raw.set_date),

			subject_name: raw.subject_name,
			subject_code: raw.group_name,
			subject_id: raw.subject_id,

			is_completed: raw.mark_as_done,
		}
	})

	Object.keys(savedData.tasks || []).forEach(subject_id => {
		Object.keys(savedData.tasks[subject_id]).forEach(task_id => {
			const existing: Task | {} = tasks[subject_id][task_id] !== null ? tasks[subject_id][task_id] : {}
			const override = savedData.tasks[subject_id][task_id];

			tasks[subject_id][task_id] = {
				...existing,
				...override
			}
		})
	})

	//Timetable
	const timetable: AggregateDataTimetable = {1: [], 2: [], 3: [], 4: [], 5: []};

	rawData.timetable.forEach(lesson => {
		const lesson_date = new Date(lesson.date);

		const lesson_tasks: LessonTask[] = [];

		//Lesson tasks
		Object.values(tasks[lesson.subject_id] || [])
			.filter(t => (t.id.startsWith("task")) && (new Date(t.due_date).setHours(0,0) === new Date(lesson.date).setHours(0,0)))
			.forEach(t => lesson_tasks.push({...t, category: "Lesson"}));

		//Due homeworks
		Object.values(tasks[lesson.subject_id] || [])
			.filter(t => (t.id.startsWith("homework")) && (new Date(t.due_date).setHours(0,0) === new Date(lesson.date).setHours(0,0)))
			.forEach(t => lesson_tasks.push({...t, category: "Due Homework"}));

		//Set homeworks
		Object.values(tasks[lesson.subject_id] || [])
			.filter(t => (t.id.startsWith("homework")) && (new Date(t.set_date).setHours(0,0) === new Date(lesson.date).setHours(0,0)))
			.forEach(t => lesson_tasks.push({...t, category: "Set Homework"}));


		timetable[lesson_date.getDay()].push({
			id: lesson.class_id,
			date: lesson_date,
			name: lesson.subject_name !== null ? lesson.subject_name : "Free Period",
			code: lesson.group_name !== null ? lesson.group_name : "",
			subject_id: lesson.subject_id,

			teacher_name: Object.values(lesson.teacher_list || [])[0],

			room: lesson.room_list,

			tasks: lesson_tasks,
		})
	})

	//Classes
	const classes: Class[] = rawData.subjects.map(subject => ({
		name: subject.subject_name,
		code: subject.group_name,
		id: subject.subject_id,

		tasks: tasks[subject.subject_id] ? Object.values(tasks[subject.subject_id]) : []
	}))

	return {
		classes,
		tasks,
		timetable
	}

	// Homework
	// const homework: {[subject_id: string]: { [homework_id: string]: Homework }} = {};
	//
	// rawData.homework.forEach(rawHomework => {
	// 	if(!homework[rawHomework.subject_id]) homework[rawHomework.subject_id] = {}
	// 	homework[rawHomework.subject_id][rawHomework.id] = {
	// 		id: rawHomework.id,
	// 		title: rawHomework.title,
	// 		details: rawHomework.details,
	//
	// 		due_date: new Date(rawHomework.due_date),
	// 		set_date: new Date(rawHomework.set_date),
	//
	// 		subject_name: rawHomework.subject_name,
	// 		subject_code: rawHomework.group_name,
	// 		subject_id: rawHomework.subject_id,
	//
	// 		is_completed: rawHomework.mark_as_done,
	// 	};
	// })
	//
	// const flat_homework_overrides = Object.values(savedData.override_homework).flatMap(a => Object.values(a))
	// flat_homework_overrides.forEach((override_homework) => {
	// 	if (!homework[override_homework.subject_id]) homework[override_homework.subject_id] = {}
	//
	// 	console.log("Homework override: ", override_homework.title, "=", override_homework.is_completed)
	// 	homework[override_homework.subject_id][override_homework.id] = {
	// 		id: override_homework.id,
	// 		title: override_homework.title,
	// 		details: override_homework.details,
	//
	// 		due_date: new Date(override_homework.due_date),
	// 		set_date: new Date(override_homework.set_date),
	//
	// 		subject_name: override_homework.subject_name,
	// 		subject_code: override_homework.subject_code,
	// 		subject_id: override_homework.subject_id,
	//
	// 		is_completed: override_homework.is_completed,
	// 	};
	// })

	// Timetable
	// const timetable: Lesson[] = rawData.timetable.map(rawLesson => {
	// 	const lesson_tasks: Homework[] = homework[rawLesson.subject_id] ? Object.values(homework[rawLesson.subject_id]).filter(homework => {
	// 		return homework.id === "0" || homework.id === "1";
	// 	}) : [];
	// 	const homeworks_due: Homework[] = homework[rawLesson.subject_id] ? Object.values(homework[rawLesson.subject_id]).filter((homework) => {
	// 		return homework.id !== "0" && homework.id !== "1" && (new Date(homework.due_date).setHours(0,0) === new Date(rawLesson.date).setHours(0,0))
	// 	}) : [];
	// 	const homeworks_set: Homework[] = homework[rawLesson.subject_id] ? Object.values(homework[rawLesson.subject_id]).filter((homework) => {
	// 		return homework.id !== "0" && homework.id !== "1" && (new Date(homework.set_date).setHours(0,0) === new Date(rawLesson.date).setHours(0,0))
	// 	}) : [];
	//
	// 	return {
	// 		id: rawLesson.class_id,
	// 		date: new Date(rawLesson.date),
	// 		name: rawLesson.subject_name !== null ? rawLesson.subject_name : "Free Period",
	// 		code: rawLesson.group_name !== null ? rawLesson.group_name : "",
	// 		subject_id: rawLesson.subject_id,
	//
	// 		lesson_tasks,
	// 		homeworks_due,
	// 		homeworks_set,
	// 		todo: [],
	// 	}
	// });

	//Classes
	// const subjects: Class[] = rawData.subjects.map(rawSubject => {
	// 	return {
	// 		name: rawSubject.subject_name,
	// 		code: rawSubject.group_name,
	// 		id: rawSubject.subject_id,
	//
	// 		homeworks: homework[rawSubject.subject_id] ? Object.values(homework[rawSubject.subject_id]) : [],
	// 	}
	// })

	// return {
	// 	timetable,
	// 	subjects,
	// 	homework
	// }
}

export {fetchRawData, aggregateRawData};
export type { RawData, AggregateData, SavedData, AggregateDataTimetable, AggregateDataTasks};

