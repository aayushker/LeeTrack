import React, { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    interactive?: boolean;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const GlassCard = ({ children, interactive = false, className = '', onClick, style }: GlassCardProps) => {
    const baseClass = interactive ? 'glass-panel-interactive' : 'glass-panel';

    return (
        <div className={`${baseClass} ${className}`} onClick={onClick} style={style}>
            {children}
        </div>
    );
};
