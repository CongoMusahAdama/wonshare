interface StatusBarProps {
    dark?: boolean;
}

const StatusBar = ({ dark = false }: StatusBarProps) => {
    return (
        <div className={`status-bar ${dark ? 'dark' : ''}`}>
            <span>9:41</span>
            <div className="status-icons">
                <span className="signal">
                    <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
                        <rect x="0.5" y="6" width="3" height="4" rx="1" fill="currentColor" />
                        <rect x="4.5" y="4" width="3" height="6" rx="1" fill="currentColor" />
                        <rect x="8.5" y="2" width="3" height="8" rx="1" fill="currentColor" />
                        <rect x="12.5" width="3" height="10" rx="1" fill="currentColor" />
                    </svg>
                </span>
                <span className="wifi">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <path d="M8 12L0 4C2.20914 1.79086 5.10914 0.5 8 0.5C10.8909 0.5 13.7909 1.79086 16 4L8 12Z" fill="currentColor" />
                    </svg>
                </span>
                <span className="battery">
                    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                        <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" />
                        <path d="M23 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <rect x="2.5" y="2.5" width="17" height="7" rx="1" fill="currentColor" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default StatusBar;
