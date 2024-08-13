import { ReactNode, forwardRef, Ref } from 'react';
// import './popup-menu.scss';

type Props = {
    showPopup: boolean,
    children: ReactNode
}

export const PopupMenu = forwardRef<HTMLDivElement, Props>(function PopupMenu({ showPopup, children }, ref) {
    return (
        <div ref={ref} className={`popup-menu ${showPopup ? 'visible' : ''}`}>
            {children}
        </div>
    )
})