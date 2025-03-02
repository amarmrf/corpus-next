import { ReactNode, forwardRef, Ref } from 'react';

type Props = {
    showPopup: boolean;
    children: ReactNode;
    className?: string;
    position?: 'left' | 'center' | 'right';
}

export const PopupMenu = forwardRef(function PopupMenu({ 
    showPopup, 
    children, 
    className = '',
    position = 'center'
}: Props, ref: Ref<HTMLDivElement>) {
    const positionClass = position === 'right' ? 'right-0' : position === 'left' ? 'left-0' : '';
    
    return (
        <div 
            ref={ref} 
            className={`absolute ${positionClass} ${showPopup ? '' : 'hidden'} ${className}`}
        >
            {children}
        </div>
    )
})