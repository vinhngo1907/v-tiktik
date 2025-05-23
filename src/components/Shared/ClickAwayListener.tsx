import { FC, useEffect, useRef } from "react";

interface ClickAwayListenerProps {
    onClickAway: () => void;
    // eslint-disable-next-line
    children: (ref: any) => any;
}

const ClickAwayListener: FC<ClickAwayListenerProps> = ({
    children,
    onClickAway,
}) => {
    const childrenRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handler = (e: any) => {
            if (childrenRef.current && !childrenRef.current.contains(e.target)) {
                onClickAway();
            }
        };

        window.addEventListener("click", handler);

        return () => window.removeEventListener("click", handler);
    }, [onClickAway]);

    return <>{children(childrenRef)}</>;
};

export default ClickAwayListener;