import React from 'react';
import './Typography.css';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
  align?: 'left' | 'center' | 'right';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  as?: React.ElementType;
  role?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight,
  className = '',
  as,
  role
}) => {
  const getDefaultElement = (variant: string): React.ElementType => {
    const elementMap: Record<string, React.ElementType> = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      body1: 'p',
      body2: 'p',
      caption: 'span',
      overline: 'span'
    };
    return elementMap[variant] || 'p';
  };

  const Component = as || getDefaultElement(variant);

  const typographyClasses = [
    'typography',
    `typography--${variant}`,
    `typography--color-${color}`,
    `typography--align-${align}`,
    weight && `typography--weight-${weight}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={typographyClasses} role={role}>
      {children}
    </Component>
  );
};

export default Typography;