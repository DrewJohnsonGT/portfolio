import { useState, useEffect } from 'react';

export const useScroll = () => {
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

    function getScrollPosition() {
        return { x: window.pageXOffset, y: window.pageYOffset };
    }

    useEffect(() => {
        function handleScroll() {
            setScrollPosition(getScrollPosition());
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return scrollPosition;
};

export const useDarkMode = () => {
    const [theme, setTheme] = useState('dark');

    const setMode = (mode) => {
        window.localStorage.setItem('theme', mode);
        setTheme(mode);
    };

    const themeToggler = () => {
        theme === 'light' ? setMode('dark') : setMode('light');
    };

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        localTheme && setTheme(localTheme);
    }, []);
    return [theme, themeToggler];
};

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
};