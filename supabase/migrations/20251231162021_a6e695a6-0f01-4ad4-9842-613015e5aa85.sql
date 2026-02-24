
-- 1. Add unique constraints to child table permit_application_id columns
ALTER TABLE permit_location_details 
  ADD CONSTRAINT uq_permit_location_app UNIQUE (permit_application_id);

ALTER TABLE permit_project_details 
  ADD CONSTRAINT uq_permit_project_app UNIQUE (permit_application_id);

ALTER TABLE permit_classification_details 
  ADD CONSTRAINT uq_permit_classification_app UNIQUE (permit_application_id);

ALTER TABLE permit_fee_details 
  ADD CONSTRAINT uq_permit_fee_app UNIQUE (permit_application_id);

ALTER TABLE permit_consultation_details 
  ADD CONSTRAINT uq_permit_consultation_app UNIQUE (permit_application_id);

ALTER TABLE permit_compliance_details 
  ADD CONSTRAINT uq_permit_compliance_app UNIQUE (permit_application_id);

ALTER TABLE permit_water_waste_details 
  ADD CONSTRAINT uq_permit_water_waste_app UNIQUE (permit_application_id);

ALTER TABLE permit_emission_details 
  ADD CONSTRAINT uq_permit_emission_app UNIQUE (permit_application_id);

ALTER TABLE permit_chemical_details 
  ADD CONSTRAINT uq_permit_chemical_app UNIQUE (permit_application_id);

-- 2. Add missing indexes on intent_registrations
CREATE INDEX idx_intent_reg_status ON intent_registrations(status);
CREATE INDEX idx_intent_reg_user_status ON intent_registrations(user_id, status);
CREATE INDEX idx_intent_reg_entity ON intent_registrations(entity_id);
CREATE INDEX idx_intent_reg_created ON intent_registrations(created_at DESC);
CREATE INDEX idx_intent_reg_province ON intent_registrations(province);

-- 3. Fix column name "registered address" → registered_address
ALTER TABLE entities RENAME COLUMN "registered address" TO registered_address;
