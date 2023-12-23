import { FontInputTitleBar } from './1-top-row';
import { DialogDemoWoTrigger } from '../ui/shadcn/demo/demo-dialog-wo-trigger';
import { Showcases } from './9-showcases';
import { showcases } from './9-showcases/cases';
import { Button } from '@/components/ui/shadcn';

function FontInput() {
    return (
        <div className="">
            <FontInputTitleBar />
        </div>
    );
}

function ConvertForm() {
    return (
        <div className="flex flex-col space-y-4">
            <div className="border-muted border-b">
                <FontInput />
            </div>

            <div className="flex items-center gap-2">
                <Button variant={'outline'}>OK</Button>
                <DialogDemoWoTrigger />
            </div>

            <div className="">
                <Showcases cases={showcases} />
            </div>
        </div>
    );
}

//G: 'css comensate scrollbar horizontal shift'
//https://stackoverflow.com/questions/9341465/prevent-a-centered-layout-from-shifting-its-position-when-scrollbar-appears
//https://aykevl.nl/2014/09/fix-jumping-scrollbar
export function Section2_Main() {
    return (
        <div className="p-4 overflow-overlay smallscroll ml-[calc(100vw-100%)]">
            <ConvertForm />
        </div>
    );
}
