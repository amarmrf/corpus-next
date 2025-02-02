import { ReactNode } from 'react';

type Props = {
    header: string,
    length: number,
    renderItem: (index: number) => ReactNode
}

export const SelectorList = ({ header, length, renderItem }: Props) => {
    return (
        <div className="flex flex-col">
            <div className="header">{header}</div>
            <div className="overflow-y-auto flex-grow">
                {
                    Array.from({ length }, (_, index) => renderItem(index))
                }
            </div>
        </div>
    )
}