'use client';

import { ReactNode } from 'react';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';
import AuthGuard from '@/components/Auth/AuthGuard';

export default function SubjectLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <div className="layout-with-sidebar">
                <SubjectSidebar />
                <div className="sidebar-content animate-fade-in">
                    {children}
                </div>
            </div>
        </AuthGuard>
    );
}
