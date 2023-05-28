import { Box, Button, Group, LoadingOverlay, Modal, Select, SelectItem, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheckbox, IconSquarePlus } from "@tabler/icons";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { Task, TaskListIdTitle, buildDateStringRFC3339 } from "../../../api/Types";
import { credentialAtom, forceRefreshAtom, taskListsAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";

export interface TaskFormFields {
    taskListId: string;
    title: string;
    notes: string;
    // RFC-3339 timestamp
    due: string;
}

export interface TaskFormProps {
    defaultTaskList?: TaskListIdTitle;
    targetTaskIfEditing?: Task;
    customTarget?: JSX.Element;
}

function TaskForm(props: TaskFormProps): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const taskLists = useRecoilValue(taskListsAtom);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const setForceRefresh = useSetRecoilState<boolean>(forceRefreshAtom);

    const taskActionText = props.targetTaskIfEditing ? "Update" : "Create";

    const form = useForm<TaskFormFields>({
        initialValues: {
            taskListId: props.defaultTaskList ? props.defaultTaskList.id : "",
            title: props.targetTaskIfEditing?.title ?? "",
            notes: "",
            due: props.targetTaskIfEditing?.due ?? new Date(Date.now()).toString(),
        },
        validate: {
            taskListId: (value) => (value == "" ? "Required field" : null),
            title: (value) => (value == "" ? "Required field" : null),
        },
    });

    const submit = (values: TaskFormFields): void => {
        setLoading(true);
        form.setFieldValue("due", new Date(form.values.due).toString());

        const onSuccess = (): void => {
            showNotification({
                title: `Task ${taskActionText}d!`,
                message: `${values.title} successfully ${taskActionText}d!`,
                color: "green",
                icon: <IconCheckbox />,
            });
            setLoading(false);
            setForceRefresh(true);
        };

        const onFailure = (): void => {
            showNotification(genErrorNotificationProps(`Task ${taskActionText}`));
            setLoading(false);
        };

        if (props.targetTaskIfEditing) {
            const editedTask: Task = {
                ...props.targetTaskIfEditing,
                due: buildDateStringRFC3339(new Date(values.due as string)),
                title: values.title,
            };

            GoogleAPI.updateTask(credential, values.taskListId, editedTask, onSuccess, onFailure);
        } else {
            GoogleAPI.createNewTask(credential, values, onSuccess, onFailure);
        }

        setOpened(false);
    };

    const buildSelectValuesFromTaskLists = (): SelectItem[] => {
        const selectItems: SelectItem[] = [];

        taskLists.forEach((taskList) => {
            selectItems.push({
                value: taskList.id,
                label: taskList.title,
            });
        });

        return selectItems;
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={(): void => setOpened(false)}
                title={
                    props.defaultTaskList
                        ? `${taskActionText} task for ${props.defaultTaskList.title}`
                        : `${taskActionText} task`
                }
            >
                {loading && <LoadingOverlay visible={true} overlayBlur={2} />}
                <Box sx={{ maxWidth: 300 }} mx="auto">
                    <form onSubmit={form.onSubmit(submit)}>
                        <span>
                            <TextInput
                                required
                                label="Task title"
                                placeholder="Do something nice"
                                {...form.getInputProps("title")}
                            />
                            {/* <TextInput label="Task notes" placeholder="Be brave" {...form.getInputProps("notes")} /> */}
                            <DatePicker
                                placeholder={
                                    props.targetTaskIfEditing
                                        ? new Date(props.targetTaskIfEditing?.due as string).toDateString()
                                        : new Date(Date.now()).toDateString()
                                }
                                label="Due date"
                                {...form.getInputProps("due")}
                            />
                            <Select
                                required
                                label="Task list"
                                placeholder="Pick a task list"
                                data={buildSelectValuesFromTaskLists()}
                                {...form.getInputProps("taskListId")}
                            />
                            <Group position="right" mt="md">
                                <Button type="submit" disabled={!form.isValid()}>
                                    Submit
                                </Button>
                            </Group>
                        </span>
                    </form>
                </Box>
            </Modal>

            {props.customTarget ? (
                <span onClick={(): void => setOpened(true)}>{props.customTarget}</span>
            ) : (
                <Button variant="subtle" onClick={(): void => setOpened(true)} leftIcon={<IconSquarePlus />} size="sm">
                    Task
                </Button>
            )}
        </>
    );
}

export default TaskForm;
