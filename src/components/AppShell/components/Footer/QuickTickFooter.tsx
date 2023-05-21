import { Button, Footer } from "@mantine/core";
import { IconBrandGithub, IconBug } from "@tabler/icons";
import "./QuickTickFooter.css";

export default function QuickTickFooter(): JSX.Element {
    return (
        <Footer height={30}>
            Copyright (c) 2022 quick-tick
            <span className={"report-issue"}>
                <a href={"https://github.com/jamesgiu/quick-tick"}>
                    <Button variant={"light"} compact={true} radius={30} size={"xs"}>
                        <IconBrandGithub size={18} />
                    </Button>
                </a>
                <a href={"https://github.com/jamesgiu/quick-tick/issues/new/choose"}>
                    <Button variant={"light"} compact={true} radius={30} size={"xs"}>
                        <IconBug size={18} />
                    </Button>
                </a>
            </span>
        </Footer>
    );
}
