import React from "react";
import {Avatar, Button, Grid, Text} from "@mantine/core";
import {IconMoodSmileDizzy} from "@tabler/icons";


export default function QuickTickAuth(): JSX.Element {
    return (
        <div>
            <Grid>
                <Grid.Col span={3}>
                    <Avatar color="blue" radius="xl" variant={"light"} size={"md"}>
                        <IconMoodSmileDizzy/>
                    </Avatar>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Text size={"sm"}>
                        james.giuffrida@gmail.com
                    </Text>
                </Grid.Col>
            </Grid>
        </div>
    )
}