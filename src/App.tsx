import React, {useEffect, useState} from 'react';
import AuthTokenInput from "./components/AuthTokenInput";
import {getCurrentWeekIndex} from "./dateUtils";
import useStickyState from "./hooks/useStickyState";
import Timetable from "./components/Timetable";
import {aggregateRawData, fetchRawData, RawData, SavedData} from "./data/aggregator";

const days = [
    "Jupiter",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

const App = () => {

    const [authToken, setAuthToken] = useStickyState("", "authToken");
    const [studentId, setStudentId] = useStickyState("", "studentId");

    const [weekIndex, setWeekIndex] = useState<number>(getCurrentWeekIndex());

    const [rawData, setRawData] = useState<RawData>({
        homework: [],
        subjects: [],
        timetable: [],
    });
    const [savedData, setSavedData] = useStickyState<SavedData>({ tasks: {} }, "savedData");
    const data = aggregateRawData(rawData, savedData);

    const refetch = async () => {
        const rawData = await fetchRawData(authToken, studentId, weekIndex)
        setRawData(rawData);
    };

    useEffect(() => {
        refetch()
    }, [])


    const onHomeworkToggled = (subject_id: string, task_id: string, new_state: boolean) => {
        console.log("task toggled", subject_id, task_id, new_state)

        // const homework: Homework = data.homework[subject_id][homework_id]

        // console.log("Original override_homework", savedData.override_homework[subject_id][homework_id])
        // console.log("Original api homework", data.homework[subject_id][homework_id])

        setSavedData({
            ...savedData,
            tasks: {
                ...savedData.tasks,
                [subject_id]: {
                    ...savedData.tasks[subject_id],
                    [task_id]: {
                        ...data.tasks[subject_id][task_id] || {},
                        ...savedData.tasks[subject_id][task_id] || {},
                        is_completed: new_state
                    }
                }
            }
        });

        // setSavedData({
        //     ...savedData,
        //     override_homework: {
        //         ...savedData.override_homework,
        //         [subject_id]: {
        //             ...savedData.override_homework[subject_id],
        //             [homework_id]: {
        //                 ...(
        //                     savedData.override_homework[subject_id] ? (
        //                         savedData.override_homework[subject_id][homework_id] || data.homework[subject_id][homework_id]
        //                     ) : (data.homework[subject_id][homework_id])
        //                 ),
        //                 is_completed: new_state
        //             }
        //         }
        //     }
        // })
    }


    return (
        <div className={"bg-blue-500 w-full h-full p-16"}>

            <div className={"bg-white rounded-md shadow-xl h-full w-full p-4"}>

                <div className={"flex p-2"}>
                    <h1 className={"flex-grow text-3xl font-semibold text-center"}>Better Go4Schools</h1>

                    <AuthTokenInput studentId={studentId} setStudentId={async (studentId: string) => {
                        setStudentId(studentId)
                        await refetch()
                    }} authToken={authToken} setAuthToken={async (authToken: string) => {
                        setAuthToken(authToken);
                        await refetch()
                    }}/>
                </div>

                {/* Timetable */}
                <div className={"flex flex-row justify-center"}>
                    <div>
                        <Timetable onHomeworkToggled={onHomeworkToggled} weekIndex={weekIndex} timetable={data.timetable}/>
                    </div>
                </div>

                <div className={"flex flex-row justify-around"}>
                    {/* Upcoming */}
                    <div>
                        <div className={"flex"}>
                            <h3 className={"flex-grow font-semibold text-xl"}>Up coming</h3>

                            <div className={"flex"}>
                                <button>Today</button>
                                <button>This Week</button>
                                <button>This Fortnight</button>
                            </div>
                        </div>

                        {/*<TreeView data={{*/}
                        {/*    "Overdue Homework": [*/}
                        {/*        "scary"*/}
                        {/*    ],*/}
                        {/*    "Physics": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ],*/}
                        {/*    "Maths": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ],*/}
                        {/*    "Further Maths": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ]*/}
                        {/*}}/>*/}

                    </div>

                    {/* Breakdown by subject */}
                    <div>
                        <div className={"flex"}>
                            <h3 className={"flex-grow font-semibold text-xl"}>Subject breakdown</h3>

                            <div className={"flex"}>
                                <button>Today</button>
                                <button>This Week</button>
                                <button>This Fortnight</button>
                            </div>
                        </div>


                        {/*<TreeView data={{*/}
                        {/*    "Physics": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ],*/}
                        {/*    "Maths": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ],*/}
                        {/*    "Further Maths": [*/}
                        {/*        "A","B","C"*/}
                        {/*    ]*/}
                        {/*}}/>*/}

                    </div>
                </div>



            </div>
        </div>

    );
}

export default App;
