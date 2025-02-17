import React from "react";

import {
    useCan,
    useNavigation,
    useTranslate,
    BaseKey,
    useResource,
    useRouterContext,
} from "@pankod/refine-core";
import { Button, ButtonProps, SvgIconProps } from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

export type CloneButtonProps = ButtonProps & {
    resourceNameOrRouteName?: string;
    recordItemId?: BaseKey;
    hideText?: boolean;
    ignoreAccessControlProvider?: boolean;
    svgIconProps?: SvgIconProps;
};

/**
 * `<CloneButton>` uses Material UI {@link https://mui.com/components/buttons/ `<Button> component`}.
 * It uses the {@link https://refine.dev/docs/core/hooks/navigation/useNavigation#clone `clone`} method from {@link https://refine.dev/docs/core/hooks/navigation/useNavigation useNavigation} under the hood.
 * It can be useful when redirecting the app to the create page with the record id route of resource.
 *
 */
export const CloneButton: React.FC<CloneButtonProps> = ({
    resourceNameOrRouteName,
    recordItemId,
    hideText = false,
    ignoreAccessControlProvider = false,
    svgIconProps,
    children,
    onClick,
    ...rest
}) => {
    const { resourceName, resource, id } = useResource({
        resourceNameOrRouteName,
        recordItemId,
    });

    const { cloneUrl: generateCloneUrl } = useNavigation();
    const { Link } = useRouterContext();

    const translate = useTranslate();

    const { data } = useCan({
        resource: resourceName,
        action: "create",
        params: { id },
        queryOptions: {
            enabled: !ignoreAccessControlProvider,
        },
    });

    const disabledTitle = () => {
        if (data?.can) return "";
        else if (data?.reason) return data.reason;
        else
            return translate(
                "buttons.notAccessTitle",
                "You don't have permission to access",
            );
    };

    const cloneUrl = generateCloneUrl(resource.route!, id!);

    const { sx, ...restProps } = rest;

    return (
        <Link
            to={cloneUrl}
            href={cloneUrl}
            replace={false}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
            style={{ textDecoration: "none" }}
        >
            <Button
                disabled={data?.can === false}
                startIcon={
                    !hideText && <AddBoxOutlinedIcon {...svgIconProps} />
                }
                title={disabledTitle()}
                sx={{ minWidth: 0, ...sx }}
                {...restProps}
            >
                {hideText ? (
                    <AddBoxOutlinedIcon fontSize="small" {...svgIconProps} />
                ) : (
                    children ?? translate("buttons.clone", "Clone")
                )}
            </Button>
        </Link>
    );
};
