import { Box, Button, Group, LoadingOverlay, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheckupList, IconFilePlus } from "@tabler/icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { credentialAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";

interface NewTaskListFormFields {
    title: string;
}

function NewTaskList(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<NewTaskListFormFields>({
        initialValues: {
            title: "",
        },
    });

    const submit = (values: NewTaskListFormFields): void => {
        setLoading(true);
        GoogleAPI.createNewTaskList(
            credential,
            values.title,
            () => {
                showNotification({
                    title: "Tasklist created!",
                    message: values.title + " successfully created!",
                    color: "green",
                    icon: <IconCheckupList />,
                });
                setLoading(false);
            },
            () => {
                showNotification(genErrorNotificationProps("Tasklist creation"));
                setLoading(false);
            }
        );
    };

    return (
        <>
            <Modal opened={opened} onClose={() => setOpened(false)} title="New tasklist">
                {loading && <LoadingOverlay visible={true} overlayBlur={2} />}
                <Box sx={{ maxWidth: 300 }} mx="auto">
                    <form onSubmit={form.onSubmit(submit)}>
                        <TextInput
                            withAsterisk
                            label="List title"
                            placeholder="Work items"
                            {...form.getInputProps("title")}
                        />
                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Box>
            </Modal>

            <Button variant="subtle" onClick={() => setOpened(true)} leftIcon={<IconFilePlus />} size="sm">
                Tasklist
            </Button>
        </>
    );
}

export default NewTaskList;
