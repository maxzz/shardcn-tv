import * as React from "react";
import { classNames } from "@/utils";

/** Based on react-split-pane package. See https://github.com/tomkp/react-split-pane/blob/master/LICENSE */

export interface PaneProps {
    className?: string;
    size?: string | number;
    split?: "vertical" | "horizontal";
    style?: React.CSSProperties;
    eleRef: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode;
}

export function Pane(props: PaneProps) {
    const { children, className, split, style, size, eleRef } = props;

    const paneClasses = React.useMemo(
        () => classNames("Pane", split, className),
        [split, className]
    );

    const paneStyle = React.useMemo(() => {
        const baseStyle: Partial<React.CSSProperties> = {
            flex: 1,
            position: "relative",
            outline: "none",
        };

        if (size !== undefined) {
            if (split === "vertical") {
                baseStyle.width = size;
            } else {
                baseStyle.height = size;
                baseStyle.display = "flex";
            }
            baseStyle.flex = "none";
        }

        return {
            ...style,
            ...baseStyle,
        } as React.CSSProperties;
    }, [size, split, style]);

    return (
        <div ref={eleRef} className={paneClasses} style={paneStyle}>
            {children}
        </div>
    );
}
