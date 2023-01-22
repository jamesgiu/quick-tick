import { Box, Button, Group, LoadingOverlay, Modal, Select, SelectItem, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheckbox, IconSquarePlus } from "@tabler/icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { TaskListIdTitle } from "../../../api/Types";
import { credentialAtom, taskListsAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";

export interface NewTaskFormFields {
    taskListId: string;
    title: string;
    notes: string;
    // RFC-3339 timestamp
    due: string;
}

export interface NewTaskProps {
    defaultTaskList?: TaskListIdTitle;
}

function NewTask(props: NewTaskProps): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const taskLists = useRecoilValue(taskListsAtom);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<NewTaskFormFields>({
        initialValues: {
            taskListId: props.defaultTaskList ? props.defaultTaskList.id : "",
            title: "",
            notes: "",
            due: new Date(Date.now()).toString(),
        },
        validate: {
            taskListId: (value) => (value == "" ? "Required field" : null),
            title: (value) => (value == "" ? "Required field" : null),
        },
    });

    const submit = (values: NewTaskFormFields): void => {
        setLoading(true);
        form.setFieldValue("due", new Date(form.values.due).toString());
        GoogleAPI.createNewTask(
            credential,
            values,
            () => {
                showNotification({
                    title: "Task created!",
                    message: values.title + " successfully created!",
                    color: "green",
                    icon: <IconCheckbox />,
                });
                setLoading(false);
            },
            () => {
                showNotification(genErrorNotificationProps("Task creation"));
                setLoading(false);
            }
        );

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
                onClose={() => setOpened(false)}
                title={props.defaultTaskList ? `New task for ${props.defaultTaskList.title}` : "New task"}
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
                                placeholder="Due date (default: today if unsupplied)"
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

            <Button variant="subtle" onClick={() => setOpened(true)} leftIcon={<IconSquarePlus />} size="sm">
                Task
            </Button>
        </>
    );
}

export default NewTask;
