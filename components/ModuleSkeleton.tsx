export default function ModuleSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton"
                    style={{
                        backgroundColor: '#0d0a0a',
                        border: '1px solid rgba(189, 160, 97, 0.08)',
                        padding: '2rem',
                        minHeight: '280px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '8px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '24px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '24px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '12px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '10px', width: '85%', marginBottom: '8px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '10px', width: '65%', marginBottom: '8px', backgroundColor: '#111' }} />
                    <div className="skeleton" style={{ height: '10px', width: '75%', backgroundColor: '#111' }} />
                </div>
            ))}
        </div>
    );
}
