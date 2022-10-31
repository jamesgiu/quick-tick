import React, { useEffect } from "react";
import { Avatar, Box, Button, Group, Text } from "@mantine/core";
import { IconBrandGoogle, IconMoodSmileDizzy, IconUserX } from "@tabler/icons";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { showNotification } from "@mantine/notifications";
import { useRecoilState } from "recoil";
import { credentialAtom, userInfoAtom } from "../../../../recoil/Atoms";
import { GoogleAPI } from "../../../../api/GoogleAPI";
import {REQUIRED_SCOPES, UserInfoResponse} from "../../../../api/Types";

const errorNotification = {
    title: "Login failed",
    message: "Could not login with Google 😥",
    color: "red",
    icon: <IconUserX />,
};

export default function QuickTickAuth(): JSX.Element {
    const [credential, setCredential] = useRecoilState<TokenResponse>(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState<UserInfoResponse>(userInfoAtom);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse): void => {
            if (tokenResponse) {
                setCredential(tokenResponse);
            }
        },
        onError: (): void => {
            showNotification(errorNotification);
        },
        scope: REQUIRED_SCOPES
    });

    // When the credential changes, get the user info again.
    useEffect((): void => {
        if (!userInfo && credential && credential.access_token) {
            getUserInfo();
        }
    }, [credential]);

    const getUserInfo = (): void => {
        GoogleAPI.getUserInfo(
            credential.access_token,
            (userInfo) => {
                setUserInfo(userInfo);
                showNotification({
                    title: "Authenticated!",
                    message: `Welcome ${userInfo.name}!`,
                    icon: <IconMoodSmileDizzy />,
                    color: "green",
                });
            },
            () => showNotification(errorNotification)
        );
    };

    return (
        <div className={"quick-tick-auth"}>
            {userInfo ? (
                <Group>
                    <Avatar src={userInfo.picture} color="blue" radius="xl" variant={"light"} size={"md"} />
                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {userInfo.name}
                        </Text>
                        <Text color="dimmed" size="xs">
                            {userInfo.email}
                        </Text>
                    </Box>
                </Group>
            ) : (
                <Button onClick={(): void => login()} leftIcon={<IconBrandGoogle />}>
                    {" "}
                    Sign-in via Google{" "}
                </Button>
            )}
        </div>
    );
}
