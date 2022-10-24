import React, {useState} from "react";
import {Avatar, Button, Grid, Text} from "@mantine/core";
import {IconMoodSmileDizzy} from "@tabler/icons";
import { GoogleLogin } from 'react-google-login';


export default function QuickTickAuth(): JSX.Element {
    const [user, setUser] = useState({});

    return (
        <div>
            <GoogleLogin
                // TODO env file
                clientId="1086380827453-ahe45p4f2arvl7iuooh07frk92siukkc.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={(response) => console.log(response)}
                onFailure={(response) => console.log(response)}
                cookiePolicy={'single_host_origin'}
            />
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