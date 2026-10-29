import type { TabPanelProps } from './types';
import { getPanelId, getTabId } from './utils';

export function TabPanel({ tabsId, value, ...props }: TabPanelProps) {
  return (
    <div
      {...props}
      aria-labelledby={getTabId(tabsId, value)}
      id={getPanelId(tabsId, value)}
      role="tabpanel"
      tabIndex={0}
    />
  );
}
