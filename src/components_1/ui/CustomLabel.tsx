import React from 'react';

interface CustomLabelProps {
    children: React.ReactNode;
    color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'pink';
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    required?: boolean;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
    children,
    className = '',
}) => {
    return (
        <label className={`flex items-center ${className}`}>
            <span className="block text-sm md:text-lg font-medium md:font-bold text-gray-700 mb-1">
                {children}
            </span>
        </label>
    );
};

export default CustomLabel;