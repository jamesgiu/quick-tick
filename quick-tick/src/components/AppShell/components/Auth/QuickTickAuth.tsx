import React, {useState} from "react";
import {Avatar, Button, Grid, Text} from "@mantine/core";
import {IconMoodSmileDizzy} from "@tabler/icons";
import { GoogleLogin } from '@react-oauth/google';



export default function QuickTickAuth(): JSX.Element {
    const [user, setUser] = useState({});

    return (
        <div>
            <Grid>
                <Grid.Col span={3}>
                    <Avatar color="blue" radius="xl" variant={"light"} size={"md"}>
                        <IconMoodSmileDizzy/>
                    </Avatar>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap={true}
                    />
                </Grid.Col>
            </Grid>
        </div>
    )
}