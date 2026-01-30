import { getCompanys } from "@/actions/company";
import InvoiceList from "@/components/invoiceList";
import MainForm from "@/components/mainForm";
import { TypographyH1 } from "@/components/ui/TypographyH1";

const Home = async () => {
  const companys = await getCompanys();

  return (
    <main className="pt-8">
      <TypographyH1 txt="ترصيد" />

      <MainForm companys={companys} />

      <InvoiceList companys={companys} />
    </main>
  );
};

export default Home;
