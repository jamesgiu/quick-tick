import { Box, Button, Group, LoadingOverlay, Modal, Select, SelectItem, TextInput } from "@mantine/core";
import { DatePicker} from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconSquarePlus, IconCheckbox  } from "@tabler/icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { GoogleAPI } from "../../../api/GoogleAPI";
import { credentialAtom, taskListsAtom, taskListsMapAtom } from "../../../recoil/Atoms";
import { genErrorNotificationProps } from "../../DataLoader/DataLoader";

export interface NewTaskFormFields {
  taskListId: string,
  title: string,
  notes: string,
  // RFC-3339 timestamp
  due: string,
};

function NewTask(): JSX.Element {
    const credential = useRecoilValue(credentialAtom);
    const taskLists = useRecoilValue(taskListsAtom);
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<NewTaskFormFields>({
      initialValues: {
        taskListId: '',
        title: '',
        notes: '',
        // One week from now, by default.
        due: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).toISOString()
      }});

    const submit = (values: NewTaskFormFields) : void => {
      console.log(values);
      setLoading(true);

       // Transform the given date to ISO if it is not already
      form.setFieldValue('due', new Date(form.values.due).toISOString())
      
      GoogleAPI.createNewTask(credential, values, () => { showNotification({
      title: "Task created!",
      message: values.title + " successfully created!",
      color: "green",
      icon: <IconCheckbox/>
      })
      setLoading(false);
    }, () => { showNotification(genErrorNotificationProps("Task creation")); setLoading(false)});
    }


    const buildSelectValuesFromTaskLists = (): SelectItem[] => {
      console.log(taskLists);
      const selectItems : SelectItem[] = [];

      taskLists.forEach((taskList) => {
        selectItems.push({
          value: taskList.id,
          label: taskList.title
        });
      })

      return selectItems;
    }

    return (<>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="New task"
    >
  {loading && <LoadingOverlay visible={true} overlayBlur={2} />}
      <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(submit)}>
      <TextInput
          withAsterisk
          label="Task title"
          placeholder="Talk to Frank"
          {...form.getInputProps('title')}
        />
        <TextInput
          label="Task notes"
          placeholder="Be brave"
          {...form.getInputProps('notes')}
        />
       <DatePicker placeholder="Due date (defaults to 7 days if unsupplied)" label="Due date" {...form.getInputProps("due")}/>
       <Select
        withAsterisk
        label="Task list"
        placeholder="Pick a task list"
        data={buildSelectValuesFromTaskLists()}
        {...form.getInputProps('taskListId')}
        />    
       <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      </Box>
    </Modal>

    <Group position="center">
      <Button variant="subtle" onClick={() => setOpened(true)} leftIcon={<IconSquarePlus/>} size="lg">Task</Button>
    </Group>
  </>);
}

export default NewTask;