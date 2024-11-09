export interface MembershipFilters {
  status?: '' | 'active' | 'inactive';
  trainer_id?: number | null;
  nutritionist_id?: number | null;
  package_id?: number | null;
}
