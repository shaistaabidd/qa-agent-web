import { useMemo, useState } from 'react';

import { parseIsoDate, toIsoDate } from '@/shared/lib/dates';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerFooterActions,
  DrawerHeader,
  DrawerHeaderText,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';
import { Label } from '@/shared/ui/label';

import { EMAIL_LOG_STATUS_OPTIONS } from '../constants';

type EmailLogsFilterDrawerProps = {
  endDate: string;
  onApply: (next: { endDate: string; startDate: string; status: string }) => void;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  open: boolean;
  startDate: string;
  status: string;
};

export function EmailLogsFilterDrawer({
  endDate,
  onApply,
  onOpenChange,
  onReset,
  open,
  startDate,
  status,
}: EmailLogsFilterDrawerProps) {
  const [tempStatus, setTempStatus] = useState(status || 'all');
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const today = useMemo(() => new Date(), []);

  function handleStartChange(value: Date | undefined) {
    const nextStart = toIsoDate(value);
    setTempStartDate(nextStart);

    if (!nextStart || (tempEndDate && tempEndDate < nextStart)) {
      setTempEndDate('');
    }
  }

  function handleReset() {
    setTempStatus('all');
    setTempStartDate('');
    setTempEndDate('');
    onReset();
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="right">
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-[8px]">
            <Label>Status</Label>
            <Dropdown
              aria-label="Status"
              onValueChange={setTempStatus}
              placeholder="Select"
              size="md"
              value={tempStatus}
            >
              {EMAIL_LOG_STATUS_OPTIONS.map((option) => (
                <DropdownItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
          <div className="flex flex-col gap-[8px]">
            <Label>Start date</Label>
            <DatePicker
              maxDate={today}
              onValueChange={handleStartChange}
              placeholder="Start date"
              size="md"
              value={parseIsoDate(tempStartDate)}
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <Label>End date</Label>
            <DatePicker
              disabled={!tempStartDate}
              maxDate={today}
              minDate={parseIsoDate(tempStartDate)}
              onValueChange={(value) => setTempEndDate(toIsoDate(value))}
              placeholder="End date"
              size="md"
              value={parseIsoDate(tempEndDate)}
            />
          </div>
        </DrawerBody>
        <DrawerFooter sticky>
          <DrawerFooterActions>
            <Button onClick={handleReset} size="md" type="button" variant="outline">
              Reset all
            </Button>
          </DrawerFooterActions>
          <DrawerFooterActions>
            <Button
              onClick={() => {
                onApply({
                  endDate: tempEndDate,
                  startDate: tempStartDate,
                  status: tempStatus,
                });
                onOpenChange(false);
              }}
              size="md"
              type="button"
            >
              Apply
            </Button>
          </DrawerFooterActions>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
