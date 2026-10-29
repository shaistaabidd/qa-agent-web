import { useSearchParams } from 'react-router';

import { SETTINGS_TABS } from '../constants';
import type { AccountTabValue } from '../types';

function isSettingsTab(value: string | null): value is AccountTabValue {
  return SETTINGS_TABS.some((item) => item.value === value);
}

export function useSettingsTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const tab = isSettingsTab(urlTab) ? urlTab : 'account';

  function setTab(next: AccountTabValue) {
    const params = new URLSearchParams(searchParams);

    if (next === 'account') {
      params.delete('tab');
    } else {
      params.set('tab', next);
    }

    setSearchParams(params, { replace: true });
  }

  return { setTab, tab };
}
