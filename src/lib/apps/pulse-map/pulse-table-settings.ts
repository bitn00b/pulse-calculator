import type {ColumnSettings, TableSettings} from "@a-luna/svelte-simple-tables/types";
import type {ChartData} from "./pulse-map-utils.ts";

export const tableSettings: TableSettings<ChartData> = {
  tableId: 'pulse-data',
  themeName: 'darker',
  sortBy: 'value',
  sortDir: 'desc',
  showHeader: true,
  header: 'Pulse Data',
  showSortDescription: true,
  tableWrapper: true,
  expandToContainerWidth: true,
  paginated: true,
  pageSize: 30,
  pageSizeOptions: [30, 50, 100],
  pageRangeFormat: 'compact',
  pageNavFormat: 'compact',
  rowType: '',
};

export const columnSettings: ColumnSettings<ChartData>[] = [
  {
    propName: 'walletShort',
    tooltip: 'Wallet',
  },
  {
    propName: 'isElite',
    colValue: (data): string => (data.isElite ? '✅' : '❌'),
  },
  {
    propName: 'isVIP',
    colValue: (data): string => (data.isVIP ? '✅' : '❌'),
  },
  {
    propName: 'value',
    classList: ['text-center'],
  },
];
