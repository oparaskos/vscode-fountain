export * from './bar-chart/bar-chart';
export * from './donut-chart/donut-chart';
export * from './word-cloud/word-cloud';

export type ChartElement = {
	setEntries: (entries: unknown) => void;
	setFormat: (entries: unknown) => void;
}
