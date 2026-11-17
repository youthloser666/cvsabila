import { CompanyProfile } from "../models/types";

// SVG representation of the SVK Sabila Multi Kreasindo Logo
export const SVK_DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
  <g fill="%237a7a7a">
    <!-- Stylized 'SVK' -->
    <text x="10" y="70" font-family="-apple-system, system-ui, sans-serif" font-weight="900" font-size="70" letter-spacing="-3" fill="%236e7173">SVK</text>
    <text x="12" y="92" font-family="-apple-system, system-ui, sans-serif" font-weight="700" font-size="14" letter-spacing="1.5" fill="%237a7a7a">SABILA MULTI KREASINDO</text>
    <text x="12" y="108" font-family="-apple-system, system-ui, sans-serif" font-weight="500" font-size="11" letter-spacing="3.5" fill="%238e9295">TRADE WITH ETHIC</text>
  </g>
</svg>`;

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: "profile-cv-sabila",
  companyName: "CV. SABILA MULTI KREASINDO",
  tagline: "TRADE WITH ETHIC",
  logoDataUrl: SVK_DEFAULT_LOGO_SVG,
  address: "Jln Soekarno Hatta No.16 Randugunting, Mungkid",
  cityRegion: "Kab. Magelang, Central Java 56512 - Indonesia",
  email: "sabilamultikreasindo@gmail.com",
  phone: "+62 8562696881",
  defaultBankName: "BANK CENTRAL ASIA",
  defaultBankAccount: "1221544329",
  defaultAccountName: "SYARIF IHSANUDDIN",
  defaultTerms: [
    "This proforma invoice acts as a formal production agreement.",
    "The terms of payment is full payment 100% on finishing process before shipment by T/T.",
  ],
  authorizedSigner: "Syarif Ihsanuddin",
};
