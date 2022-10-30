import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Card, Grid, Group, Text} from "@mantine/core";
import {
    IconChevronRight,
    IconMoodSmileDizzy,
    IconUserCheck,
    IconUserX,
    IconLogout,
    IconLogin,
    IconBrandGithub,
    IconBrandGoogle
} from "@tabler/icons";
import {GoogleLogin, TokenResponse} from '@react-oauth/google';
import {showNotification} from "@mantine/notifications";
import {useRecoilState} from "recoil";
import {credentialAtom, userInfoAtom} from "../../../../recoil/Atoms";
import { useGoogleLogin } from '@react-oauth/google';
import {GoogleAPI} from "../../../../api/GoogleAPI";
import {UserInfoResponse} from "../../../../api/Types";



const errorNotification = {
    title: 'Login failed',
    message: 'Could not login with Google 😥',
    color: "red",
    icon: <IconUserX/>
};

export default function QuickTickAuth(): JSX.Element {
    const [credential, setCredential] = useRecoilState<TokenResponse>(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState<UserInfoResponse>(userInfoAtom);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            if (tokenResponse) {
                setCredential(tokenResponse);
            }
        },
        onError: () => {
            showNotification(errorNotification)
        }
    });

    // When the credential changes, get the user info again.
    useEffect(()=> {
        if (credential && credential.access_token) {
            getUserInfo();
        }
    }, [credential]);

    useEffect(()=>{
        if (userInfo && userInfo.name) {
            showNotification({
                title: 'Authenticated!',
                message: `Welcome ${userInfo.name}!`,
                icon: <IconMoodSmileDizzy/>,
                color: "green"
            });
        }
    }, [userInfo]);

    const getUserInfo = () => {
        GoogleAPI.getUserInfo(credential.access_token, (userInfo)=> setUserInfo(userInfo), ()=> showNotification(errorNotification));
    }

    return (
        <div className={"quick-tick-auth"}>
            {userInfo ?
            <Group>
                <Avatar src={userInfo.picture} color="blue" radius="xl" variant={"light"} size={"md"}/>
                <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {userInfo.name}

                    </Text>
                    <Text color="dimmed" size="xs">
                        {userInfo.email}
                    </Text>
                </Box>
            </Group>
          :
                <Button onClick={()=>login()} leftIcon={<IconBrandGoogle/>}> Sign-in via Google </Button>}
        </div>
    )
}