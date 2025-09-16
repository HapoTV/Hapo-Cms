import React, {useState} from 'react';
import {useTheme} from '../../contexts/ThemeContext';

export interface TabItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    content?: React.ReactNode;
}

export interface TabsProps {
    items: TabItem[];
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (key: string) => void;
    variant?: 'line' | 'card' | 'pill';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
                                              items,
                                              defaultActiveKey,
                                              activeKey: controlledActiveKey,
                                              onChange,
                                              variant = 'line',
                                              size = 'md',
                                              className = '',
                                          }) => {
    const [internalActiveKey, setInternalActiveKey] = useState(
        controlledActiveKey || defaultActiveKey || items[0]?.key
    );

    const {currentTheme} = useTheme();

    const activeKey = controlledActiveKey || internalActiveKey;
    const activeItem = items.find(item => item.key === activeKey);

    const handleTabClick = (key: string) => {
        if (controlledActiveKey === undefined) {
            setInternalActiveKey(key);
        }
        onChange?.(key);
    };

    const getSizeStyles = () => {
        const {spacing, typography} = currentTheme;

        const sizes = {
            sm: {
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.sm,
                gap: spacing.xs,
            },
            md: {
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: typography.fontSize.base,
                gap: spacing.sm,
            },
            lg: {
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.lg,
                gap: spacing.sm,
            },
        };

        return sizes[size];
    };

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            line: {
                container: {
                    borderBottom: `1px solid ${colors.border.primary}`,
                },
                tab: {
                    borderBottom: '2px solid transparent',
                    backgroundColor: 'transparent',
                },
                activeTab: {
                    borderBottomColor: colors.brand.primary,
                    color: colors.brand.primary,
                },
                inactiveTab: {
                    color: colors.text.secondary,
                },
            },
            card: {
                container: {
                    backgroundColor: colors.background.secondary,
                    borderRadius: currentTheme.borderRadius.lg,
                    padding: currentTheme.spacing.xs,
                },
                tab: {
                    borderRadius: currentTheme.borderRadius.md,
                    backgroundColor: 'transparent',
                },
                activeTab: {
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    boxShadow: currentTheme.shadows.sm,
                },
                inactiveTab: {
                    color: colors.text.secondary,
                },
            },
            pill: {
                container: {
                    backgroundColor: colors.background.secondary,
                    borderRadius: currentTheme.borderRadius.full,
                    padding: currentTheme.spacing.xs,
                },
                tab: {
                    borderRadius: currentTheme.borderRadius.full,
                    backgroundColor: 'transparent',
                },
                activeTab: {
                    backgroundColor: colors.brand.primary,
                    color: colors.text.inverse,
                },
                inactiveTab: {
                    color: colors.text.secondary,
                },
            },
        };

        return variants[variant];
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: variant === 'line' ? currentTheme.spacing.lg : currentTheme.spacing.xs,
        fontFamily: currentTheme.typography.fontFamily.sans,
        ...variantStyles.container,
    };

    const tabStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontWeight: currentTheme.typography.fontWeight.medium,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        outline: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...variantStyles.tab,
    };

    const contentStyles: React.CSSProperties = {
        marginTop: currentTheme.spacing.lg,
    };

    return (
        <div className={`ui-tabs ui-tabs--${variant} ${className}`}>
            <div style={containerStyles} className="ui-tabs-nav">
                {items.map((item) => {
                    const isActive = item.key === activeKey;
                    const isDisabled = item.disabled;

                    const currentTabStyles = {
                        ...tabStyles,
                        ...(isActive ? variantStyles.activeTab : variantStyles.inactiveTab),
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                    };

                    return (
                        <button
                            key={item.key}
                            style={currentTabStyles}
                            className={`ui-tab ${isActive ? 'ui-tab--active' : ''} ${isDisabled ? 'ui-tab--disabled' : ''}`}
                            onClick={() => !isDisabled && handleTabClick(item.key)}
                            disabled={isDisabled}
                            onMouseEnter={(e) => {
                                if (!isDisabled && !isActive && variant !== 'pill') {
                                    e.currentTarget.style.color = currentTheme.colors.text.primary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isDisabled && !isActive) {
                                    e.currentTarget.style.color = variantStyles.inactiveTab.color;
                                }
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {activeItem?.content && (
                <div style={contentStyles} className="ui-tabs-content">
                    {activeItem.content}
                </div>
            )}
        </div>
    );
};