import React, { useEffect } from "react";
import { Avatar, Box, Button, Group, Text } from "@mantine/core";
import { IconBrandGoogle, IconMoodSmileDizzy, IconUserX } from "@tabler/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { showNotification } from "@mantine/notifications";
import { useRecoilState } from "recoil";
import { credentialAtom, userInfoAtom } from "../../../../recoil/Atoms";
import { GoogleAPI } from "../../../../api/GoogleAPI";
import {QuickTickCredential, REQUIRED_SCOPES, TokenResponse, UserInfoResponse} from "../../../../api/Types";

const errorNotification = {
    title: "Login failed",
    message: "Could not login with Google 😥",
    color: "red",
    icon: <IconUserX />,
};

export default function QuickTickAuth(): JSX.Element {
    const [credential, setCredential] = useRecoilState<QuickTickCredential>(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState<UserInfoResponse>(userInfoAtom);

    const generateExpirationTimeAndSetCredentials = (response: TokenResponse) : void=> {
        const expiryDateEpoch = Date.now() + response.expires_in * 1000;
        // Setting the credential with a date for when the access token expires.
        setCredential({...response, accessTokenExpiryEpoch: expiryDateEpoch})
    }

    const login = useGoogleLogin({
        onSuccess: (oauthResponse): void => {
            // After successful oauth response, get the user's tokens
            if (oauthResponse) {
                GoogleAPI.getTokens(oauthResponse.code,
                    (response)=> {
                        generateExpirationTimeAndSetCredentials(response)
                        },
                    ()=>showNotification(errorNotification));
            }
        },
        onError: (): void => {
            showNotification(errorNotification);
        },
        scope: REQUIRED_SCOPES,
        flow: "auth-code"
    });

    useEffect((): void => {
        // If the previous access token has expired, get a new access token...
        if (credential && Date.now() >= credential.accessTokenExpiryEpoch) {
            GoogleAPI.refreshToken(credential,
            (response)=> {
                    generateExpirationTimeAndSetCredentials(response)
            }, ()=>showNotification(errorNotification));
        }
    }, []);

    // When the credential changes, get the user info again.
    useEffect((): void => {
        if (!userInfo && credential && credential.access_token) {
            getUserInfo();
        }

        // Set a timeout to request a new access token when close to expiry, with a 2 minute grace period.
        const TWO_MINUTES_MS = 2 * 60 * 1000;
        setTimeout(()=> GoogleAPI.refreshToken(credential,
            (response)=> {
                generateExpirationTimeAndSetCredentials(response)
            }, ()=>showNotification(errorNotification)), (credential.expires_in * 1000) - TWO_MINUTES_MS)
    }, [credential]);


    const getUserInfo = (): void => {
        GoogleAPI.getUserInfo(
            credential,
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
