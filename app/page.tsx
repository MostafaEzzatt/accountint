import InvoiceList from "@/components/invoiceList";
import MainForm from "@/components/mainForm";
import { TypographyH1 } from "@/components/ui/TypographyH1";

const Home = () => {
  return (
    <main className="pt-8">
      <TypographyH1 txt="ترصيد" />

      <MainForm />

      <InvoiceList />
    </main>
  );
};

export default Home;
