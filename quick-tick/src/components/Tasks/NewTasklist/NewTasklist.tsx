import { Button, Group, Modal } from "@mantine/core";
import { IconFilePlus, IconSquarePlus  } from "@tabler/icons";
import { useState } from "react";

function NewTaskList(): JSX.Element {
    const [opened, setOpened] = useState(false);

    return (<>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="New tasklist"
    >
      {/* Modal content */}
    </Modal>

    <Group position="center">
      <Button variant="subtle" onClick={() => setOpened(true)} leftIcon={<IconFilePlus/>} size="lg">Tasklist</Button>
    </Group>
  </>);
}

export default NewTaskList;