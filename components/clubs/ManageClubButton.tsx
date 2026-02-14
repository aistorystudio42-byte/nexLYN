"use client"

import React from 'react';
import styles from './ManageClubButton.module.css';

interface ManageClubButtonProps {
    clubId: string;
}

export default function ManageClubButton({ clubId }: ManageClubButtonProps) {
    const handleManage = () => {
        window.location.href = `/clubs/${clubId}/manage`;
    };

    return (
        <button className={styles.manageButton} onClick={handleManage}>
            <span className={styles.icon}>⚙</span>
            KULÜBÜ YÖNET
        </button>
    );
}
