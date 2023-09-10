import React from "react";
import {RawLesson} from "../data/types/Raw/RawLesson";
import {Lesson} from "../data/types/Lesson";

const chunkArray = (array: any[], chunker: number) => {
	let ret = []

	for(let i = 0; i < array.length; i += chunker) {
		ret.push(array.slice(i, i + chunker))
	}

	return ret
}

// const TimetableLesson = ({subject, class_code, checklist}: {subject: string | null, class_code: string | null, checklist: string[]}) => {
const TimetableLesson = ({lesson}: {lesson: Lesson}) => {
	return (
		<td className={"border-black border p-1.5 align-top"}>
			<div className={"flex justify-between"}>
				<div className={"text-lg"}><b>{lesson.name}</b>{lesson.code ? (` - ${lesson.code}`) : ("")}</div>
				<button>S</button>
			</div>


			<div className={"px-1"}>
				{
					lesson.homeworks_due.length > 0 && (<>
						<div className={"font-semibold text-base"}>Homework Due</div>

						{
							lesson.homeworks_due.map(homework => (
								<div className={"px-1"}>
									<input type={"checkbox"} value={homework.id}/>
									<span className={"px-1"}>{homework.title}</span>
								</div>
							))
						}

					</>)
				}

				{
					lesson.homeworks_set.length > 0 && (<>
						<div className={"font-semibold text-base"}>Homework Set</div>

						{
							lesson.homeworks_set.map(homework => (
								<div className={"px-1"}>
									<input type={"checkbox"} value={homework.id}/>
									<span className={"px-1"}>{homework.title}</span>
								</div>
							))
						}

					</>)
				}


				{
					(lesson.homeworks_set.length > 0 || lesson.homeworks_due.length > 0) && (
						<div className={"font-semibold text-base"}>Lesson</div>
					)
				}

				<div className={"px-1"}>
					<input type={"checkbox"} value={"notetaking"}/>
					<span className={"px-1"}>Notetaking</span>
				</div>
				<div className={"px-1"}>
					<input type={"checkbox"} value={"preparation"}/>
					<span className={"px-1"}>Preparation</span>
				</div>
			</div>


		</td>
	)
}

const Timetable = ({weekIndex, timetable}: {weekIndex: number, timetable: Lesson[]}) => {
	return (<>
		<div className={"flex px-1 py-2"}>
			<h3 className={"font-semibold text-xl"}>Timetable</h3>
			<span className={"text-xl flex-grow text-center"}>Monday 10th - Friday 15th</span>
			<div>
				{weekIndex}
			</div>
		</div>

		<table className={"border-black border-2 text-sm"}>
		<tbody>
		{/*TODO: Subject colour coding to stand out*/}

		{
			chunkArray(timetable, 6).map((dayOfLessons: Lesson[]) => (
				<tr>
					{
						dayOfLessons.map(lesson => {
							if(lesson.name === "Tutor Time") return <></>
							if(lesson.name !== null) {
								return <TimetableLesson lesson={lesson}/>
								// return <TimetableLesson subject={lesson.name} class_code={lesson.code} checklist={[
								// 	"Homework Due",
								// 	"Homework Set",
								// 	"Note taking"
								// ]}/>
							}
							return <TimetableLesson lesson={lesson}/>
						})
					}
				</tr>
			))
		}
		</tbody>
	</table>
	</>)
}

export default Timetable