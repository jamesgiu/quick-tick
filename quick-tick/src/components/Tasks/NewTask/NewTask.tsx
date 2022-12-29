import { Button, Group, Modal } from "@mantine/core";
import { IconSquarePlus  } from "@tabler/icons";
import { useState } from "react";

function NewTask(): JSX.Element {
    const [opened, setOpened] = useState(false);

    return (<>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="New task"
    >
      {/* Modal content */}
    </Modal>

    <Group position="center">
      <Button variant="subtle" onClick={() => setOpened(true)} leftIcon={<IconSquarePlus/>} size="lg">Task</Button>
    </Group>
  </>);
}

export default NewTask;