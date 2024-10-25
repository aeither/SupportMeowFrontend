import { createContext } from 'react';
import type { DynamicToastChild } from '../components/Tabs';

export type NotificationState = {
  addNotification?: (arg0: DynamicToastChild) => void;
};

export const NotificationContext = createContext<NotificationState>({});
