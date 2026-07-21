export interface TaxCompanyLocation {
  name_vi: string;
  code?: string;
  slug?: string;
}

export interface TaxCompanyIndustry {
  code: string;
  name_vi: string;
}

export interface TaxCompanyResponse {
  mst: string;
  name_vi: string;
  name_en: string;
  legal_form: string;
  registered_at: string;
  status: string;
  charter_capital_vnd: string;

  address_full: string;
  legal_rep_name: string;

  is_listed: boolean;
  listed_exchange: string | null;
  listed_ticker: string | null;

  province: TaxCompanyLocation;
  district: TaxCompanyLocation;

  industry: TaxCompanyIndustry;
}
