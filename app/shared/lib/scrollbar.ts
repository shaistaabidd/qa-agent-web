export const scrollbarClass = [
  '[scrollbar-width:thin] [scrollbar-color:var(--border-color-medium)_transparent]',
  '[&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-[4px]',
  '[&::-webkit-scrollbar-track]:bg-transparent',
  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border-color-medium)]',
].join(' ');

export const scrollbarHiddenClass = [
  '[scrollbar-width:none]',
  '[&::-webkit-scrollbar]:hidden',
].join(' ');
