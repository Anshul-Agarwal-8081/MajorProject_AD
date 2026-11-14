import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { buildCatalogue, countByStatus, filterCatalogue } from '../utils/beachModel';

export function useCatalogue(filters) {
  const { origin, dataSource, remoteBeaches, remoteAssessments, remoteAlerts } = useApp();
  const catalogue = useMemo(() => buildCatalogue(origin, { dataSource, remoteBeaches, remoteAssessments, remoteAlerts }),
    [origin, dataSource, remoteBeaches, remoteAssessments, remoteAlerts]);
  const filtered = useMemo(() => (filters ? filterCatalogue(catalogue, filters) : catalogue), [catalogue, filters]);
  return { catalogue, filtered, counts: countByStatus(filtered, filters?.activity === 'all' || !filters ? 'swimming' : filters.activity) };
}

export function useBeach(beachId) {
  const { catalogue } = useCatalogue();
  return catalogue.find((beach) => beach.id === beachId) || null;
}
