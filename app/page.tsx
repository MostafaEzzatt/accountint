import InvoiceList from "@/components/invoiceList";
import MainForm from "@/components/mainForm";

const Home = () => {
  return (
    <main className="pt-8">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        تحميل الفواتير
      </h1>

      <MainForm />

      <InvoiceList />
    </main>
  );
};

export default Home;
