import { Component } from 'react';

import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

export interface Props {
	chartOptions: ApexOptions;
	chartData?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

export interface State {
	chartOptions: ApexOptions;
	chartData?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

class ColumnChart extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			chartData: [],
			chartOptions: {},
		};
	}

	componentDidMount() {
		const { chartData, chartOptions } = this.props;
		this.setState({
			chartData,
			chartOptions,
		});
	}

	render() {
		const { chartData, chartOptions } = this.state;

		return <Chart options={chartOptions} series={chartData} type="bar" width="100%" height="100%" />;
	}
}

export default ColumnChart;
