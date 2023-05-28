import { Accordion, Avatar, Box, Button, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { UseGoogleLoginOptionsAuthCodeFlow, useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { IconBrandGoogle, IconHandStop, IconLogout, IconMoodSmileDizzy, IconUserX } from "@tabler/icons";
import { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { GoogleAPI } from "../../../../api/GoogleAPI";
import { QuickTickCredential, REQUIRED_SCOPES, TokenResponse, UserInfoResponse } from "../../../../api/Types";
import { credentialAtom, userInfoAtom } from "../../../../recoil/Atoms";
import "./QuickTickAuth.css";

const errorNotification = {
    title: "Login failed",
    message: "Could not login with Google 😥",
    color: "red",
    icon: <IconUserX />,
};

export default function QuickTickAuth(): JSX.Element {
    const resetCredentials = useResetRecoilState(credentialAtom);
    const resetUserState = useResetRecoilState(userInfoAtom);
    const [credential, setCredential] = useRecoilState<QuickTickCredential>(credentialAtom);
    const [userInfo, setUserInfo] = useRecoilState<UserInfoResponse>(userInfoAtom);

    // Will also reset the credentials atom
    const logout = (): void => {
        resetCredentials();
        resetUserState();
        showNotification({
            title: "Logged out",
            message: "Successfully logged out, goodbye!",
            icon: <IconHandStop />,
        });
        location.reload();
    };

    const generateExpirationTimeAndSetCredentials = (response: TokenResponse): void => {
        const expiryDateEpoch = Date.now() + response.expires_in * 1000;
        // Setting the credential with a date for when the access token expires.
        setCredential({
            ...response,
            accessTokenExpiryEpoch: expiryDateEpoch,
            refresh_token: response.refresh_token ?? credential.refresh_token,
        });
    };

    const login = useGoogleLogin({
        onSuccess: (oauthResponse): void => {
            // After successful oauth response, get the user's tokens
            if (oauthResponse) {
                GoogleAPI.getTokens(
                    oauthResponse.code,
                    (response) => {
                        generateExpirationTimeAndSetCredentials(response);
                    },
                    () => showNotification(errorNotification)
                );
            }
        },
        onError: (): void => {
            showNotification(errorNotification);
        },
        scope: REQUIRED_SCOPES,
        flow: "auth-code",
        ux_mode: "popup",
    });

    useEffect((): void => {
        // Get a new access token on refresh, even if the old one was still valid... (otherwise, can refresh after expiry with something like Date.now() >= credential.accessTokenExpiryEpoch)
        if (credential && credential.refresh_token) {
            GoogleAPI.refreshToken(
                credential,
                (response) => {
                    generateExpirationTimeAndSetCredentials(response);
                },
                () => showNotification(errorNotification)
            );
        }

        // Set a timeout to request a new access token when close to expiry, with a 2 minute grace period.
        const TWO_MINUTES_MS = 2 * 60 * 1000;
        if (credential) {
            setTimeout(
                () =>
                    GoogleAPI.refreshToken(
                        credential,
                        (response) => {
                            generateExpirationTimeAndSetCredentials(response);
                        },
                        () => showNotification(errorNotification)
                    ),
                credential.expires_in * 1000 - TWO_MINUTES_MS
            );
        }
    }, []);

    // When the credential changes, get the user info again.
    useEffect((): void => {
        if (!userInfo && credential && credential.access_token) {
            getUserInfo();
        }
    }, [credential]);

    const getUserInfo = (): void => {
        if (credential) {
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
        }
    };

    // Force login if credential expired.
    if (credential && Date.now() >= credential.accessTokenExpiryEpoch) {
        login();
    } 

    return (
        <div className={"quick-tick-auth"}>
            {userInfo ? (
                <Group className="profile-area">
                    <Accordion>
                        <Accordion.Item value="profile-controls">
                            <Accordion.Control
                                icon={
                                    <Avatar
                                        src={userInfo.picture}
                                        color="blue"
                                        radius="xl"
                                        variant={"light"}
                                        size={"md"}
                                    />
                                }
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Text size="sm" weight={500}>
                                        {userInfo.name}
                                    </Text>
                                    <Text color="dimmed" size="xs">
                                        {userInfo.email}
                                    </Text>
                                </Box>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack className="auth-actions" align={"stretch"} spacing={1}>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        onClick={(): void => logout()}
                                        leftIcon={<IconLogout />}
                                    >
                                        Log out
                                    </Button>
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Group>
            ) : (
                <Button onClick={() : void => login()} leftIcon={<IconBrandGoogle />}>
                    {" "}
                    Sign-in via Google{" "}
                </Button>
            )}
        </div>
    );
}
