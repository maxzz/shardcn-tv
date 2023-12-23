import { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, ReactNode, SyntheticEvent, forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { proxy, useSnapshot } from "valtio";
import * as A from "@radix-ui/react-accordion";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import useResizeObserver from "use-resize-observer";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import { DataItemNavigation, DataItemCore, DataItemNav, TypeTreeFolder, TypeTreeFolderTrigger, DataItem, TreenIconType } from "./shared/types";
import { collectExpandedItemIds, findTreeItemById, getNextId } from "./shared/utils";
import { treeItemBaseClasses, treeItemSelectedClasses, treeItemIconClasses, leafBaseClasses, leafSelectedClasses, leafIconClasses } from "./shared/classes";
import { tr } from "date-fns/locale";

export type ItemState = {
    state: {
        selected: boolean;
    };
};

export type DataItemWState = DataItemNavigation<DataItemCore & ItemState>;

type TreeProps = {
    data: DataItemWState[] | DataItemWState;

    onSelectChange?: (item: DataItemWState | undefined) => void;
    initialSelectedItemId?: string;
    expandAll?: boolean;

    IconForFolder?: TreenIconType;
    IconForItem?: TreenIconType;
};

type TreeState = {
    selectedId: string | undefined;
};

export const Tree = forwardRef<HTMLDivElement, TreeProps & HTMLAttributes<HTMLDivElement>>(
    ({ data, initialSelectedItemId, onSelectChange, expandAll, IconForFolder, IconForItem, className, ...rest }, ref) => {
        const [selectedItemId, setSelectedItemId] = useState<string | undefined>(initialSelectedItemId);

        const [treeState] = useState(() => {
            const uiState = proxy<TreeState>({
                selectedId: undefined,
            });
            return uiState;
        });

        const handleSelectChange = useCallback(
            (event: SyntheticEvent<any>, item: DataItemWState | undefined) => {
                event.stopPropagation();

                if(treeState.selectedId) {
                    const prevItem = findTreeItemById(data, treeState.selectedId);
                    prevItem && (prevItem.state.selected = false);
                }

                if (item) {
                    item.state.selected = !item.state.selected;
                    treeState.selectedId = item.id;
                } else {
                    treeState.selectedId = undefined;
                }

                //setSelectedItemId(item?.id);
                onSelectChange?.(item);
            }, [treeState, onSelectChange]
        );

        const expandedItemIds = useMemo(() => collectExpandedItemIds(data, initialSelectedItemId, expandAll), [data, initialSelectedItemId, expandAll]);

        const refRoot = useRef<HTMLDivElement | null>(null);
        const { ref: refRootCb, width, height } = useResizeObserver();

        return (
            <div
                ref={(r) => { refRootCb(r); refRoot.current = r; }}
                className={cn("overflow-hidden", className)}
                tabIndex={0}
                onKeyDown={(e) => {
                    const nextId = getNextId(refRoot.current!, e, treeState.selectedId);
                    nextId && handleSelectChange(e, findTreeItemById(data, nextId));
                }}
            >
                <ScrollArea style={{ width, height }} onClick={(e) => handleSelectChange(e, undefined)}>
                    <div className="relative z-0 px-2 py-1" >
                        <TreeItem
                            ref={ref}
                            data={data}
                            selectedItemId={selectedItemId}
                            handleSelectChange={handleSelectChange}
                            expandedItemIds={expandedItemIds}
                            IconForFolder={IconForFolder}
                            IconForItem={IconForItem}
                            {...rest}
                        />
                    </div>
                </ScrollArea>
            </div>
        );
    }
);

type HandleSelectChange = (event: SyntheticEvent<any>, item: DataItemWState | undefined) => void;

type TreeItemProps = Prettify<
    & Pick<TreeProps, 'data' | 'IconForFolder' | 'IconForItem'>
    & {
        selectedItemId?: string;
        handleSelectChange: HandleSelectChange;
        expandedItemIds: string[];
    }>;

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps & HTMLAttributes<HTMLDivElement>>(
    ({ className, data, selectedItemId, handleSelectChange, expandedItemIds, IconForFolder, IconForItem, ...rest }, ref) => {
        return (
            <div ref={ref} role="tree" className={className} {...rest}>
                <ul>
                    {data instanceof Array
                        ? (data.map((item) => (
                            <li key={item.id}>
                                {item.children
                                    ? (
                                        <A.Root type="multiple" defaultValue={expandedItemIds}>
                                            <A.Item value={item.id} data-tree-id={item.id} data-tree-folder={TypeTreeFolder}>

                                                {/* <TreeItemTrigger
                                                    className={cn(treeItemBaseClasses, selectedItemId === item.id && treeItemSelectedClasses)}
                                                    onClick={(e) => handleSelectChange(e, item)}
                                                    data-tree-folder-trigger={TypeTreeFolderTrigger}
                                                >
                                                    <TreeIconAndText item={item} Icon={IconForFolder} classes={treeItemIconClasses} />
                                                </TreeItemTrigger> */}

                                                <Folder item={item} Icon={IconForFolder} onClick={(e) => handleSelectChange(e, item)} />

                                                <TreeItemContent className="pl-6">
                                                    <TreeItem
                                                        data={item.children}
                                                        selectedItemId={selectedItemId}
                                                        handleSelectChange={handleSelectChange}
                                                        expandedItemIds={expandedItemIds}
                                                        IconForFolder={IconForFolder}
                                                        IconForItem={IconForItem}
                                                    />
                                                </TreeItemContent>
                                            </A.Item>
                                        </A.Root>
                                    ) : (
                                        <Leaf
                                            item={item}
                                            onClick={(e) => handleSelectChange(e, item)}
                                            Icon={IconForItem}
                                            data-tree-id={item.id}
                                        />
                                    )}
                            </li>
                        )))
                        : (
                            <li>
                                <Leaf
                                    item={data}
                                    onClick={(e) => handleSelectChange(e, data)}
                                    Icon={IconForItem}
                                />
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
);

function TreeIconAndText({ item, Icon, classes }: { item: DataItem; Icon?: TreenIconType; classes: string; }) {
    return (<>
        {item.icon && <item.icon className={classes} aria-hidden="true" />}
        {!item.icon && Icon && <Icon className={classes} aria-hidden="true" />}

        <span className="flex-grow text-sm truncate">
            {item.name}
        </span>
    </>);
}

const Leaf = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { item: DataItemWState, Icon?: TreenIconType; }>(
    ({ className, item, Icon, ...rest }, ref) => {
        const { selected } = useSnapshot(item.state);
        return (
            <div ref={ref} className={cn(leafBaseClasses, className, selected && leafSelectedClasses)} {...rest}>
                <TreeIconAndText item={item} Icon={Icon} classes={leafIconClasses} />
            </div>
        );
    }
);

const Folder = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & { item: DataItemWState, Icon?: TreenIconType; }>(
    ({ className, item, Icon, ...rest }, ref) => {
        const { selected } = useSnapshot(item.state);
        console.log('Folder', item.name, selected);
        
        return (
            <TreeItemTrigger
                className={cn(treeItemBaseClasses, selected && treeItemSelectedClasses)}
                data-tree-folder-trigger={TypeTreeFolderTrigger}
                ref={ref}
                {...rest}
            >
                <TreeIconAndText item={item} Icon={Icon} classes={treeItemIconClasses} />
            </TreeItemTrigger>
        );
    }
);

const TreeItemTrigger = forwardRef<ElementRef<typeof A.Trigger>, ComponentPropsWithoutRef<typeof A.Trigger>>(
    ({ className, children, ...rest }, ref) => (
        <A.Header>
            <A.Trigger
                asChild
                className={cn("flex-1 py-1 w-full transition-all last:[&[data-state=open]>svg]:rotate-90 outline-none cursor-pointer flex items-center", className)}
                ref={ref}
                {...rest}
            >
                <div>
                    {children}
                    <ChevronRight className="shrink-0 ml-auto h-4 w-4 text-accent-foreground/50 transition-transform duration-200" />
                </div>
            </A.Trigger>
        </A.Header>
    )
);
TreeItemTrigger.displayName = A.Trigger.displayName;

const TreeItemContent = forwardRef<ElementRef<typeof A.Content>, ComponentPropsWithoutRef<typeof A.Content>>(
    ({ className, children, ...rest }, ref) => (
        <A.Content
            ref={ref}
            className={cn("text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all overflow-hidden", className)}
            {...rest}
        >
            <div>{children}</div>
        </A.Content>
    )
);
TreeItemContent.displayName = A.Content.displayName;
