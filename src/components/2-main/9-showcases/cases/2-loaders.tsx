import { LoaderDotsRing, RadialLoader, SvgSpinner } from "@/components/ui/loaders";
import { SkeletonDemo } from "../../2-demo/2-loaders/4-demo-skeleton";
import { LoadersTest } from "../../3-experimental";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn";
import { PaginationDemo } from "../../2-demo/demo-pagination";

export function LoadersInTab() {
    return (
        <Tabs defaultValue="loaders1">
            <TabsList>
                <TabsTrigger value="loaders1">Loaders</TabsTrigger>
                <TabsTrigger value="loaders2">Circle loader</TabsTrigger>
                <TabsTrigger value="loaders3">Radial</TabsTrigger>
                <TabsTrigger value="loaders4">Spinner</TabsTrigger>
                <TabsTrigger value="loaders5">Skeleton</TabsTrigger>
                <TabsTrigger value="loaders6">Pagination</TabsTrigger>
            </TabsList>

            <TabsContent value="loaders1">
                <LoadersTest className="m-auto max-w-sm flex items-center justify-between" />
            </TabsContent>

            <TabsContent value="loaders2">
                <LoaderDotsRing />
            </TabsContent>

            <TabsContent value="loaders3">
                <RadialLoader />
            </TabsContent>

            <TabsContent value="loaders4">
                <div className="my-8 flex items-center justify-center">
                    <SvgSpinner className="w-8 h-8 stroke-[5] stroke-sky-500" />
                </div>
            </TabsContent>

            <TabsContent value="loaders5" className="my-8">
                <SkeletonDemo />
            </TabsContent>

            <TabsContent value="loaders7" className="my-8">
                <PaginationDemo />
            </TabsContent>
        </Tabs>
    );
}
