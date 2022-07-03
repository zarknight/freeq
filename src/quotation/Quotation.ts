export default interface Quotation {
  get apiUrl(): string;

  real(codes: string | string[], prefix?: boolean): Record<string, any>;
}
