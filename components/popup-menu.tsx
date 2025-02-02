import { ReactNode, forwardRef, Ref } from 'react';

type Props = {
    showPopup: boolean;
    children: ReactNode;
    className?: string;  // Add this line to accept className
}

export const PopupMenu = forwardRef(function PopupMenu({ showPopup, children, className = '' }: Props, ref: Ref<HTMLDivElement>) {
    return (
        <div 
            ref={ref} 
            className={`${showPopup ? '' : 'hidden'} ${className}`}  // Combine classes
        >
            {children}
        </div>
    )
})