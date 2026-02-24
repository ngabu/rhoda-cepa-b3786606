import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calculator, Clock, ChevronDown } from 'lucide-react';

interface FeeCalculationDisplayProps {
  applicationFee: number;
  compositeFee?: number;
  totalFee: number;
  processingDays: number;
  source?: 'official' | 'estimated';
  showDetails?: boolean;
}

export const FeeCalculationDisplay: React.FC<FeeCalculationDisplayProps> = ({
  applicationFee,
  compositeFee = 0,
  totalFee,
  processingDays,
  source = 'official',
  showDetails = true,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatCurrency = (amount: number) =>
    `PGK ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatCurrencyShort = (amount: number) =>
    `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      {/* Fee Calculation Summary - Flat style matching Details section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Fee Calculation Summary</h4>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Based on prescribed activity
            </Badge>
            <Badge 
              variant={source === 'official' ? 'default' : 'outline'} 
              className={source === 'official' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {source === 'official' ? 'Official' : 'Estimated'}
            </Badge>
          </div>
        </div>
        <div className="p-4 space-y-4 bg-background">
          {/* Main Fee Display */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Application Fee</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrencyShort(totalFee)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  Processing Time
                </div>
                <p className="font-semibold">{processingDays} days</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="text-sm text-amber-800 dark:text-amber-300 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <strong>Note:</strong> All fees must be paid before CEPA undertakes the required assessment work.
          </div>
        </div>
      </div>

      {/* Fee Calculation Details Collapsible */}
      {showDetails && (
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full p-4 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">Fee Calculation Details</h4>
                <Badge variant="outline">Official calculation</Badge>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 space-y-4 bg-background">
                {/* Base Application Fee */}
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">Application Fee</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(applicationFee)}
                  </span>
                </div>

                {/* Composite Fee for Environmental Permit */}
                {compositeFee > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <span className="text-foreground">Composite Fee</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Environmental Permit processing fee
                      </p>
                    </div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      {formatCurrency(compositeFee)}
                    </span>
                  </div>
                )}

                {/* Total Fee */}
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-bold text-foreground">Total Fee Payable</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(totalFee)}
                  </span>
                </div>

                {/* Formula Info */}
                <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/20 rounded">
                  <p>• Application Fee formula: (Annual Recurrent Fee ÷ 365) × Processing Days</p>
                  <p>• Processing days: {processingDays} days</p>
                  {compositeFee > 0 && (
                    <p>• Composite Fee: K2,000 flat rate for Environmental Permit applications</p>
                  )}
                  <p>• Based on official 2018 Environment Act Fees</p>
                  <p>• Level 2.1: 30 days | Level 2.2/2.3/2.4: 60 days | Level 3: 90 days</p>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
    </div>
  );
};
