import CompanyList from "@/components/companyList";
import CreateCompanyForm from "@/components/createCompanyForm";
import { TypographyH1 } from "@/components/ui/TypographyH1";

const Company = async () => {
  const data = await fetch(
    "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblCx7i95ZirX0lni",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
      },
    },
  );

  let companys = (await data.json()) as companysInterface;
  // sort companys by createdTime descending
  companys = {
    records: companys.records.sort((a, b) => {
      return (
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      );
    }),
  };

  return (
    <>
      <TypographyH1 txt="الشركات" />

      <CreateCompanyForm />

      <CompanyList companys={companys} />
    </>
  );
};

export default Company;
