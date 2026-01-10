export interface KPIItem {
  title: string;
  description: string;
  current_performance_status: string;
  target_value: string;
  expected_completion_date: string;
  measure_unit: string;
  goal_weight: string;
  is_qualitative: boolean;
}

export const getInitialKPIItems = (): KPIItem[] => [
  {
    title: '',
    description: '',
    current_performance_status: '',
    target_value: '',
    expected_completion_date: '',
    measure_unit: '',
    goal_weight: '',
    is_qualitative: false,
  },
];

/**
 * Calculate total goal weight from KPI items (only quantitative items)
 */
export const calculateTotalGoalWeight = (items: KPIItem[]): number => {
  const validItems = items.filter(item => item.title?.trim() && item.description?.trim());
  // Only count quantitative items
  const quantitativeItems = validItems.filter(item => !item.is_qualitative);
  
  const total = quantitativeItems.reduce((sum, item) => {
    const weight = parseFloat(item.goal_weight?.replace('%', '') || '0');
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);
  
  return Math.round(total * 100) / 100;
};

/**
 * Get valid KPI items (with title and description)
 */
export const getValidKPIItems = (items: KPIItem[]): KPIItem[] => {
  return items.filter(
    item => item.title && item.title.trim() !== '' && 
            item.description && item.description.trim() !== ''
  );
};

/**
 * Validate template form - MATCHES KPI SETTING LOGIC
 */
export const validateTemplateForm = (
  templateName: string,
  validItems: KPIItem[],
  totalGoalWeight: number
): { valid: boolean; error?: string; needsConfirmation?: boolean } => {
  if (!templateName || templateName.trim() === '') {
    return { valid: false, error: 'Template name is required' };
  }

  if (validItems.length === 0) {
    return { valid: false, error: 'Please add at least one KPI item with title and description' };
  }

  // Check goal weights for quantitative items only
  const quantitativeItems = validItems.filter(item => !item.is_qualitative);
  
  if (quantitativeItems.length > 0) {
    // Check if any quantitative items have weights
    const hasAnyWeights = quantitativeItems.some(item => {
      const weight = item.goal_weight?.trim();
      return weight && weight !== '' && weight !== '0';
    });

    if (hasAnyWeights) {
      // If some quantitative items have weights, all should have weights
      const allHaveWeights = quantitativeItems.every(item => {
        const weight = parseFloat(item.goal_weight?.replace('%', '') || '0');
        return !isNaN(weight) && weight > 0;
      });

      if (!allHaveWeights) {
        return {
          valid: false,
          error: 'Some quantitative items have goal weights while others do not. Please either fill in all weights or leave all blank.'
        };
      }

      // Check if total is exactly 100%
      const roundedTotal = Math.round(totalGoalWeight * 100) / 100;
      if (Math.abs(roundedTotal - 100) > 0.01) { // Allow small floating point errors
        return {
          valid: false,
          error: `Total Goal Weight for quantitative items must be exactly 100%. Current total is ${roundedTotal.toFixed(2)}%.`
        };
      }
    } else {
      // No weights entered - ask for confirmation
      return {
        valid: true,
        needsConfirmation: true
      };
    }
  }

  return { valid: true };
};