export interface ClientFilters {
  archived?: boolean;
  status?: '' | 'active' | 'inactive';
  trainer?: 'assigned' | 'unassigned';
  membership?: boolean;
}
