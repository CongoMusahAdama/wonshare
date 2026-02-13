interface HomeIndicatorProps {
    dark?: boolean;
}

const HomeIndicator = ({ dark = false }: HomeIndicatorProps) => {
    return (
        <div className={`home-indicator ${dark ? 'dark' : ''}`}>
            <div className="indicator-bar"></div>
        </div>
    );
};

export default HomeIndicator;
