import { FC } from 'react';
import { icons } from 'lucide-react-native';

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  color?: string;
  className?: string;
  size?: number | string;
}

export const Icon: FC<IconProps> = ({ name, className, color, size }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} className={className} size={size} />;
};
