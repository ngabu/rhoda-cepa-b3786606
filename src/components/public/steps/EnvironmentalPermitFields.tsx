import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Droplets, Trash2 } from 'lucide-react';

interface EnvironmentalPermitFieldsProps {
  data: any;
  onChange: (data: any) => void;
}

export function EnvironmentalPermitFields({ data, onChange }: EnvironmentalPermitFieldsProps) {
  const handleFieldChange = (field: string, value: string) => {
    const updatedData = { 
      ...data.permit_type_specific_data, 
      [field]: value 
    };
    onChange({ permit_type_specific_data: updatedData });
  };

  const getValue = (field: string) => data.permit_type_specific_data?.[field] || '';

  return (
    <div className="space-y-4">
      <Tabs defaultValue="water-extraction" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="water-extraction" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Water Extraction
          </TabsTrigger>
          <TabsTrigger value="waste-discharge" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Waste Discharge
          </TabsTrigger>
        </TabsList>

        {/* Water Extraction Tab */}
        <TabsContent value="water-extraction" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Water Extraction Details
              </CardTitle>
              <CardDescription>
                Provide details about the water source and extraction requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1: Water Source Details */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">1. Water Source Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="we_water_source_description">Description of water source</Label>
                    <Textarea 
                      id="we_water_source_description"
                      value={getValue('we_water_source_description')}
                      onChange={(e) => handleFieldChange('we_water_source_description', e.target.value)}
                      placeholder="Describe the water source..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_map_easting">Map Coordinate (Easting)</Label>
                    <Input 
                      id="we_map_easting"
                      value={getValue('we_map_easting')}
                      onChange={(e) => handleFieldChange('we_map_easting', e.target.value)}
                      placeholder="Enter Easting coordinate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_map_northing">Map Coordinate (Northing)</Label>
                    <Input 
                      id="we_map_northing"
                      value={getValue('we_map_northing')}
                      onChange={(e) => handleFieldChange('we_map_northing', e.target.value)}
                      placeholder="Enter Northing coordinate"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground col-span-full">
                    Note: Include diagram as attachment in the Documents tab
                  </p>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="we_legal_description">Legal description of land involved (customary/alienated)</Label>
                    <Textarea 
                      id="we_legal_description"
                      value={getValue('we_legal_description')}
                      onChange={(e) => handleFieldChange('we_legal_description', e.target.value)}
                      placeholder="Describe the legal status of the land..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_owner_name">Name of owner</Label>
                    <Input 
                      id="we_owner_name"
                      value={getValue('we_owner_name')}
                      onChange={(e) => handleFieldChange('we_owner_name', e.target.value)}
                      placeholder="Enter owner name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_tenure">Tenure</Label>
                    <Input 
                      id="we_tenure"
                      value={getValue('we_tenure')}
                      onChange={(e) => handleFieldChange('we_tenure', e.target.value)}
                      placeholder="Enter tenure details"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Adjacent Land Details */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">2. Description of Adjacent Land</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="we_adjacent_owner_name">Name of owner</Label>
                    <Input 
                      id="we_adjacent_owner_name"
                      value={getValue('we_adjacent_owner_name')}
                      onChange={(e) => handleFieldChange('we_adjacent_owner_name', e.target.value)}
                      placeholder="Enter adjacent land owner name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_adjacent_address">Address</Label>
                    <Input 
                      id="we_adjacent_address"
                      value={getValue('we_adjacent_address')}
                      onChange={(e) => handleFieldChange('we_adjacent_address', e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="we_structure_plan">Plan of structure(s) for taking, damming or diverting water</Label>
                    <Textarea 
                      id="we_structure_plan"
                      value={getValue('we_structure_plan')}
                      onChange={(e) => handleFieldChange('we_structure_plan', e.target.value)}
                      placeholder="Describe the plan for structures..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="we_other_details">Other relevant details</Label>
                    <Textarea 
                      id="we_other_details"
                      value={getValue('we_other_details')}
                      onChange={(e) => handleFieldChange('we_other_details', e.target.value)}
                      placeholder="Enter any other relevant details..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Hydrological Data */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">3. Hydrological Data on Water Source</h4>
                
                {/* Estimated Annual Flow */}
                <div className="space-y-2">
                  <Label className="font-medium">Estimated annual flow (L/hr)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="we_annual_flow_min" className="text-xs text-muted-foreground">Minimum</Label>
                      <Input 
                        id="we_annual_flow_min"
                        type="number"
                        value={getValue('we_annual_flow_min')}
                        onChange={(e) => handleFieldChange('we_annual_flow_min', e.target.value)}
                        placeholder="Min L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_annual_flow_max" className="text-xs text-muted-foreground">Maximum</Label>
                      <Input 
                        id="we_annual_flow_max"
                        type="number"
                        value={getValue('we_annual_flow_max')}
                        onChange={(e) => handleFieldChange('we_annual_flow_max', e.target.value)}
                        placeholder="Max L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_annual_flow_mean" className="text-xs text-muted-foreground">Mean</Label>
                      <Input 
                        id="we_annual_flow_mean"
                        type="number"
                        value={getValue('we_annual_flow_mean')}
                        onChange={(e) => handleFieldChange('we_annual_flow_mean', e.target.value)}
                        placeholder="Mean L/hr"
                      />
                    </div>
                  </div>
                </div>

                {/* Estimated Dry Weather Flow */}
                <div className="space-y-2">
                  <Label className="font-medium">Estimated dry weather or low flow (L/hr)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="we_dry_flow_min" className="text-xs text-muted-foreground">Minimum</Label>
                      <Input 
                        id="we_dry_flow_min"
                        type="number"
                        value={getValue('we_dry_flow_min')}
                        onChange={(e) => handleFieldChange('we_dry_flow_min', e.target.value)}
                        placeholder="Min L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_dry_flow_max" className="text-xs text-muted-foreground">Maximum</Label>
                      <Input 
                        id="we_dry_flow_max"
                        type="number"
                        value={getValue('we_dry_flow_max')}
                        onChange={(e) => handleFieldChange('we_dry_flow_max', e.target.value)}
                        placeholder="Max L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_dry_flow_mean" className="text-xs text-muted-foreground">Mean</Label>
                      <Input 
                        id="we_dry_flow_mean"
                        type="number"
                        value={getValue('we_dry_flow_mean')}
                        onChange={(e) => handleFieldChange('we_dry_flow_mean', e.target.value)}
                        placeholder="Mean L/hr"
                      />
                    </div>
                  </div>
                </div>

                {/* Estimated Wet Weather Flow */}
                <div className="space-y-2">
                  <Label className="font-medium">Estimated wet weather or high flow (L/hr)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="we_wet_flow_min" className="text-xs text-muted-foreground">Minimum</Label>
                      <Input 
                        id="we_wet_flow_min"
                        type="number"
                        value={getValue('we_wet_flow_min')}
                        onChange={(e) => handleFieldChange('we_wet_flow_min', e.target.value)}
                        placeholder="Min L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_wet_flow_max" className="text-xs text-muted-foreground">Maximum</Label>
                      <Input 
                        id="we_wet_flow_max"
                        type="number"
                        value={getValue('we_wet_flow_max')}
                        onChange={(e) => handleFieldChange('we_wet_flow_max', e.target.value)}
                        placeholder="Max L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_wet_flow_mean" className="text-xs text-muted-foreground">Mean</Label>
                      <Input 
                        id="we_wet_flow_mean"
                        type="number"
                        value={getValue('we_wet_flow_mean')}
                        onChange={(e) => handleFieldChange('we_wet_flow_mean', e.target.value)}
                        placeholder="Mean L/hr"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Environmental Values */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">4. Environmental Values 1km Downstream</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Indicate environmental values 1km downstream of proposed site that may be affected
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="we_env_aquatic_ecosystem">Aquatic ecosystem</Label>
                    <Input 
                      id="we_env_aquatic_ecosystem"
                      value={getValue('we_env_aquatic_ecosystem')}
                      onChange={(e) => handleFieldChange('we_env_aquatic_ecosystem', e.target.value)}
                      placeholder="Describe impact on aquatic ecosystem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_env_drinking_water">Drinking water</Label>
                    <Input 
                      id="we_env_drinking_water"
                      value={getValue('we_env_drinking_water')}
                      onChange={(e) => handleFieldChange('we_env_drinking_water', e.target.value)}
                      placeholder="Describe impact on drinking water"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_env_recreational">Recreational</Label>
                    <Input 
                      id="we_env_recreational"
                      value={getValue('we_env_recreational')}
                      onChange={(e) => handleFieldChange('we_env_recreational', e.target.value)}
                      placeholder="Describe recreational impact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_env_aesthetic">Aesthetic</Label>
                    <Input 
                      id="we_env_aesthetic"
                      value={getValue('we_env_aesthetic')}
                      onChange={(e) => handleFieldChange('we_env_aesthetic', e.target.value)}
                      placeholder="Describe aesthetic impact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_env_transportation">Transportation</Label>
                    <Input 
                      id="we_env_transportation"
                      value={getValue('we_env_transportation')}
                      onChange={(e) => handleFieldChange('we_env_transportation', e.target.value)}
                      placeholder="Describe transportation impact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="we_env_cultural">Cultural</Label>
                    <Input 
                      id="we_env_cultural"
                      value={getValue('we_env_cultural')}
                      onChange={(e) => handleFieldChange('we_env_cultural', e.target.value)}
                      placeholder="Describe cultural impact"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="we_env_others">Others (specify)</Label>
                    <Textarea 
                      id="we_env_others"
                      value={getValue('we_env_others')}
                      onChange={(e) => handleFieldChange('we_env_others', e.target.value)}
                      placeholder="Specify any other environmental values that may be affected..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Proposed Volume */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">5. Proposed Volume of Water to be Used</h4>
                
                {/* Estimated Quantity */}
                <div className="space-y-2">
                  <Label className="font-medium">Estimated quantity</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="we_est_litres_per_hour" className="text-xs text-muted-foreground">Litres per hour</Label>
                      <Input 
                        id="we_est_litres_per_hour"
                        type="number"
                        value={getValue('we_est_litres_per_hour')}
                        onChange={(e) => handleFieldChange('we_est_litres_per_hour', e.target.value)}
                        placeholder="L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_est_hours_per_day" className="text-xs text-muted-foreground">Hours per day</Label>
                      <Input 
                        id="we_est_hours_per_day"
                        type="number"
                        value={getValue('we_est_hours_per_day')}
                        onChange={(e) => handleFieldChange('we_est_hours_per_day', e.target.value)}
                        placeholder="hrs/day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_est_days_per_month" className="text-xs text-muted-foreground">Days per month</Label>
                      <Input 
                        id="we_est_days_per_month"
                        type="number"
                        value={getValue('we_est_days_per_month')}
                        onChange={(e) => handleFieldChange('we_est_days_per_month', e.target.value)}
                        placeholder="days/month"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_est_months_per_year" className="text-xs text-muted-foreground">Months per year</Label>
                      <Input 
                        id="we_est_months_per_year"
                        type="number"
                        value={getValue('we_est_months_per_year')}
                        onChange={(e) => handleFieldChange('we_est_months_per_year', e.target.value)}
                        placeholder="months/year"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="we_max_rate">Maximum rate in litres per hour</Label>
                  <Input 
                    id="we_max_rate"
                    type="number"
                    value={getValue('we_max_rate')}
                    onChange={(e) => handleFieldChange('we_max_rate', e.target.value)}
                    placeholder="Enter maximum rate L/hr"
                  />
                </div>

                {/* Water to be returned */}
                <div className="space-y-2">
                  <Label className="font-medium">Estimated quantity of water to be returned to water source</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="we_return_litres_per_hour" className="text-xs text-muted-foreground">Litres per hour</Label>
                      <Input 
                        id="we_return_litres_per_hour"
                        type="number"
                        value={getValue('we_return_litres_per_hour')}
                        onChange={(e) => handleFieldChange('we_return_litres_per_hour', e.target.value)}
                        placeholder="L/hr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_return_hours_per_day" className="text-xs text-muted-foreground">Hours per day</Label>
                      <Input 
                        id="we_return_hours_per_day"
                        type="number"
                        value={getValue('we_return_hours_per_day')}
                        onChange={(e) => handleFieldChange('we_return_hours_per_day', e.target.value)}
                        placeholder="hrs/day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_return_days_per_month" className="text-xs text-muted-foreground">Days per month</Label>
                      <Input 
                        id="we_return_days_per_month"
                        type="number"
                        value={getValue('we_return_days_per_month')}
                        onChange={(e) => handleFieldChange('we_return_days_per_month', e.target.value)}
                        placeholder="days/month"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="we_return_months_per_year" className="text-xs text-muted-foreground">Months per year</Label>
                      <Input 
                        id="we_return_months_per_year"
                        type="number"
                        value={getValue('we_return_months_per_year')}
                        onChange={(e) => handleFieldChange('we_return_months_per_year', e.target.value)}
                        placeholder="months/year"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Permit Period */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">6. Period for Which Permit is Required</h4>
                <div className="space-y-2">
                  <Label htmlFor="we_permit_period">Permit period</Label>
                  <Input 
                    id="we_permit_period"
                    value={getValue('we_permit_period')}
                    onChange={(e) => handleFieldChange('we_permit_period', e.target.value)}
                    placeholder="Enter the period for which permit is required"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Discharge Tab */}
        <TabsContent value="waste-discharge" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-primary" />
                Waste Discharge Details
              </CardTitle>
              <CardDescription>
                Provide details about waste discharge and environmental segments affected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1: Adjacent Land Details */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">1. Description of Adjacent Land</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wd_adjacent_owner_name">(a) Name of owner</Label>
                    <Input 
                      id="wd_adjacent_owner_name"
                      value={getValue('wd_adjacent_owner_name')}
                      onChange={(e) => handleFieldChange('wd_adjacent_owner_name', e.target.value)}
                      placeholder="Enter adjacent land owner name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_adjacent_address">(b) Address</Label>
                    <Input 
                      id="wd_adjacent_address"
                      value={getValue('wd_adjacent_address')}
                      onChange={(e) => handleFieldChange('wd_adjacent_address', e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Segments of Environment */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">2. Segments of the Environment Where Wastes Will be Discharged</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Indicate the segments of the environment where wastes will be discharged
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_air">(a) Air</Label>
                    <Input 
                      id="wd_segment_air"
                      value={getValue('wd_segment_air')}
                      onChange={(e) => handleFieldChange('wd_segment_air', e.target.value)}
                      placeholder="Describe air discharge details"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_land">(b) Land</Label>
                    <Input 
                      id="wd_segment_land"
                      value={getValue('wd_segment_land')}
                      onChange={(e) => handleFieldChange('wd_segment_land', e.target.value)}
                      placeholder="Describe land discharge details"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_water">(c) Water</Label>
                    <Input 
                      id="wd_segment_water"
                      value={getValue('wd_segment_water')}
                      onChange={(e) => handleFieldChange('wd_segment_water', e.target.value)}
                      placeholder="Describe water discharge details"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_noise">(d) Noise emission</Label>
                    <Input 
                      id="wd_segment_noise"
                      value={getValue('wd_segment_noise')}
                      onChange={(e) => handleFieldChange('wd_segment_noise', e.target.value)}
                      placeholder="Describe noise emission details"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_no_discharge">(e) No discharge</Label>
                    <Input 
                      id="wd_segment_no_discharge"
                      value={getValue('wd_segment_no_discharge')}
                      onChange={(e) => handleFieldChange('wd_segment_no_discharge', e.target.value)}
                      placeholder="Indicate if no discharge"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd_segment_treatment_facility">(f) Waste treatment/storage facility</Label>
                    <Input 
                      id="wd_segment_treatment_facility"
                      value={getValue('wd_segment_treatment_facility')}
                      onChange={(e) => handleFieldChange('wd_segment_treatment_facility', e.target.value)}
                      placeholder="Describe waste treatment/storage facility"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Permit Period */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">3. Period for Which Permit is Required</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Period not exceeding 25 years
                </p>
                <div className="space-y-2">
                  <Label htmlFor="wd_permit_period">Permit period</Label>
                  <Input 
                    id="wd_permit_period"
                    value={getValue('wd_permit_period')}
                    onChange={(e) => handleFieldChange('wd_permit_period', e.target.value)}
                    placeholder="Enter the period for which permit is required (max 25 years)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
