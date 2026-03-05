import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    type?: 'easy' | 'medium' | 'hard' | 'topic' | 'default';
    className?: string;
    style?: React.CSSProperties;
}

export const Badge = ({ children, type = 'default', className = '', style }: BadgeProps) => {
    let typeClass = '';
    switch (type) {
        case 'easy': typeClass = 'badge-easy'; break;
        case 'medium': typeClass = 'badge-medium'; break;
        case 'hard': typeClass = 'badge-hard'; break;
        case 'topic': typeClass = 'badge-topic'; break;
        default: typeClass = 'badge-topic'; break;
    }

    return (
        <span className={`badge ${typeClass} ${className}`} style={style}>
            {children}
        </span>
    );
};
