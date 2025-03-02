import { ReactNode } from 'react';

type Props = {
    header: string,
    length: number,
    renderItem: (index: number) => ReactNode
}

export const SelectorList = ({ header, length, renderItem }: Props) => {
    return (
        <div className="flex flex-col min-w-[150px] max-h-[60vh] mr-4">
            <div className="font-semibold text-white mb-2">{header}:</div>
            <div className="overflow-y-auto flex-grow max-h-[calc(60vh-40px)]">
                {
                    Array.from({ length }, (_, index) => renderItem(index))
                }
            </div>
        </div>
    )
}