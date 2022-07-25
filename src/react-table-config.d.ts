import {
	UseSortByColumnOptions,
	UseSortByColumnProps,
	UseSortByHooks,
	UseSortByInstanceProps,
	UseSortByOptions,
	UseSortByState,
} from 'react-table';

declare module 'react-table' {
	export interface TableOptions<D extends Record<string, unknown>>
		extends UseSortByOptions<D>,
			// note that having Record here allows you to add anything to the options, this matches the spirit of the
			// underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
			// feature set, this is a safe default.
			Record<string, unknown> {}

	export type Hooks<D extends Record<string, unknown> = Record<string, unknown>> = UseSortByHooks<D>;

	export type TableInstance<D extends Record<string, unknown> = Record<string, unknown>> = UseSortByInstanceProps<D>;

	export type TableState<D extends Record<string, unknown> = Record<string, unknown>> = UseSortByState<D>;

	export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>>
		extends UseSortByColumnOptions<D> {
		isNumeric?: boolean;
	}

	export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
		extends UseSortByColumnProps<D> {
		isNumeric?: boolean;
	}
}
