import { getPortfolioContent } from "@/lib/portfolio-data";
import CertificatesClient from "@/components/certificates/CertificatesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Certificates & Research Publications | Portfolio",
  description:
    "Official research conference certificates, presentations, and open-source contributions by Pamidi Lakshmi Pavananjali.",
};

export default function CertificatesPage() {
  const content = getPortfolioContent();

  return <CertificatesClient initialContent={content} />;
}
