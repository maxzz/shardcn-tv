import { SVGAttributes } from "react";
import "./p-loaders-p1.css";
import { classNames } from "@/utils";
import { GradientMaskDefs } from "../p-shared-mask";

/**
 * hsl(223,90%,90%)
 * hsl(343,90%,50%)
 *
 * [--bg:hsl(var(--hue1),90%,90%)] \
 * [--fg:hsl(var(--hue1),90%,10%)] \
 * \ 
 * dark:[--bg:hsl(var(--hue1),90%,10%)] \
 * dark:[--fg:hsl(var(--hue1),90%,90%)] \
 */
const rootClasses = "\
[--hue1:223] \
[--hue2:343] \
\
[--primary:hsl(var(--hue1),90%,50%)] \
[--secondary:hsl(var(--hue2),90%,50%)] \
\
";

const gradientMaskName = "p1loader";

export function LoaderP11({ className, ...rest }: SVGAttributes<SVGSVGElement>) {
    return (
        <svg className={classNames(rootClasses, className)} viewBox="0 0 128 128" {...rest}>
            <GradientMaskDefs maskId={gradientMaskName} />

            <g className="pl1__g" fill="var(--primary)">
                <g className="pl1__rect-g" transform="translate(20 20)">
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} />
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} transform="translate(0 48)" />
                </g>
                <g className="pl1__rect-g" transform="translate(20 20) rotate(180 44 44)">
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} />
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} transform="translate(0 48)" />
                </g>
            </g>

            <g className="pl1__g" fill="var(--secondary)" mask={`url(#${gradientMaskName})`}>
                <g className="pl1__rect-g" transform="translate(20 20)">
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} />
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} transform="translate(0 48)" />
                </g>
                <g className="pl1__rect-g" transform="translate(20 20) rotate(180 44 44)">
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} />
                    <rect className="pl1__rect" rx={8} ry={8} width={40} height={40} transform="translate(0 48)" />
                </g>
            </g>
        </svg>
    );
}
