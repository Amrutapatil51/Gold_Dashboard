import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('INR');
    const [exchangeRate] = useState(83.50); // 1 USD = 83.50 INR (Fixed for stability)

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'INR' ? 'USD' : 'INR');
    };

    const formatValue = (value) => {
        if (currency === 'USD') {
            const usdValue = value / exchangeRate;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(usdValue);
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const getSymbol = () => currency === 'INR' ? '₹' : '$';

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, formatValue, getSymbol, exchangeRate }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
