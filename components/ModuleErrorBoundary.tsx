'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    moduleName?: string;
}

interface State {
    hasError: boolean;
}

export default class ModuleErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Module error [${this.props.moduleName}]:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    backgroundColor: '#0d0a0a',
                    border: '1px solid rgba(189, 160, 97, 0.15)',
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-playfair), serif',
                        fontSize: '1rem',
                        letterSpacing: '0.05em',
                        opacity: 0.8
                    }}>
                        Bu modul su an bakimdadir.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
