-- Modify ratings table to link to malfunctions instead of interventions
ALTER TABLE ratings 
DROP COLUMN intervention_id,
ADD COLUMN malfunction_id UUID NOT NULL REFERENCES malfunctions(id) ON DELETE CASCADE;

-- Add index for malfunction_id
CREATE INDEX idx_ratings_malfunction ON ratings(malfunction_id);
