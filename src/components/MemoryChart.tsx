import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { State } from '~/store/types';

import { fetchData } from '../api/memory';
import { useLineChartMemory } from '../hooks/useLineChart';
import {
  chartJSResource,
  chartStyles,
  commonDataSetProps,
  memoryChartOptions,
} from '../misc/chart-memory';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';

const { useMemo } = React;

const chartWrapperStyle = {
  // make chartjs chart responsive
  justifySelf: 'center',
  position: 'relative',
  width: '100%',
  height: '200px',
  borderTop: '1px solid #424242',
};

const mapState = (s: State) => ({
  apiConfig: getClashAPIConfig(s),
  selectedChartStyleIndex: getSelectedChartStyleIndex(s),
});

export default connect(mapState)(MemoryChart);

function MemoryChart({ apiConfig, selectedChartStyleIndex }) {
  const ChartMod = chartJSResource.read();
  const memory = fetchData(apiConfig);
  const { t } = useTranslation();
  const data = useMemo(
    () => ({
      labels: memory.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...memoryChartOptions,
          ...chartStyles[selectedChartStyleIndex].inuse,
          label: t('Memory'),
          data: memory.inuse,
        },
      ],
    }),
    [memory, selectedChartStyleIndex, t]
  );

  useLineChartMemory(ChartMod.Chart, 'MemoryChart', data, memory);

  return (
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ position: string; maxWidth: number; }' is ... Remove this comment to see the full error message
    <div style={chartWrapperStyle}>
      <canvas id="MemoryChart" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
