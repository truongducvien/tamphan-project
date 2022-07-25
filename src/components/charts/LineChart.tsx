import React from 'react';

import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

export interface Props {
	chartOptions: ApexOptions;
	chartData?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

export interface State {
	chartOptions: ApexOptions;
	chartData?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

class LineChart extends React.Component<Props, State> {
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
		return <ReactApexChart options={chartOptions} series={chartData} type="line" width="100%" height="100%" />;
	}
}

export default LineChart;
