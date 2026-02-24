// React hook for fetching and managing permit details from child tables

import { useState, useEffect, useCallback } from 'react';
import {
  fetchPermitAllDetails,
  fetchPermitDetailsFlatteneed,
  savePermitDetailsFromFlat,
  PermitAllDetails,
  PermitDetailsFlatteneed,
} from '@/services/permitDetails';

interface UsePermitDetailsResult {
  details: PermitDetailsFlatteneed | null;
  allDetails: PermitAllDetails | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  saveDetails: (details: Partial<PermitDetailsFlatteneed>) => Promise<void>;
  saving: boolean;
}

/**
 * Hook to fetch and manage permit details from normalized child tables
 * Provides flattened details for backward compatibility with existing UI
 */
export function usePermitDetails(permitApplicationId: string | undefined | null): UsePermitDetailsResult {
  const [details, setDetails] = useState<PermitDetailsFlatteneed | null>(null);
  const [allDetails, setAllDetails] = useState<PermitAllDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!permitApplicationId) {
      setDetails(null);
      setAllDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [flattened, all] = await Promise.all([
        fetchPermitDetailsFlatteneed(permitApplicationId),
        fetchPermitAllDetails(permitApplicationId),
      ]);
      
      setDetails(flattened);
      setAllDetails(all);
    } catch (err) {
      console.error('Error fetching permit details:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch permit details'));
    } finally {
      setLoading(false);
    }
  }, [permitApplicationId]);

  const saveDetails = useCallback(async (newDetails: Partial<PermitDetailsFlatteneed>) => {
    if (!permitApplicationId) {
      throw new Error('No permit application ID provided');
    }

    setSaving(true);
    setError(null);

    try {
      await savePermitDetailsFromFlat(permitApplicationId, newDetails);
      // Refetch to get updated data
      await fetchDetails();
    } catch (err) {
      console.error('Error saving permit details:', err);
      setError(err instanceof Error ? err : new Error('Failed to save permit details'));
      throw err;
    } finally {
      setSaving(false);
    }
  }, [permitApplicationId, fetchDetails]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    details,
    allDetails,
    loading,
    error,
    refetch: fetchDetails,
    saveDetails,
    saving,
  };
}
