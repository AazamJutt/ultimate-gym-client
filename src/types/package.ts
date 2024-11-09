export type Package = {
  id: number;
  name: string;
  price: number;
  status: 'active' | 'inactive';
  period: number;
};
