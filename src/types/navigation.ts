export type NavView =
  | 'dashboard'
  | 'owasp'
  | 'regression'
  | 'trace'
  | 'firewall'
  | 'mutator'
  | 'quarantine'
  | 'permissions';

export interface NavSection {
  title: string;
  items: {
    id: NavView;
    label: string;
    badge?: string;
  }[];
}
