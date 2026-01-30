import { getCompanys } from "@/actions/company";
import CompanyList from "@/components/companyList";
import CreateCompanyForm from "@/components/createCompanyForm";
import { TypographyH1 } from "@/components/ui/TypographyH1";

const Company = async () => {
  const companys = await getCompanys();

  return (
    <>
      <TypographyH1 txt="الشركات" />

      <CreateCompanyForm />

      <CompanyList companys={companys} />
    </>
  );
};

export default Company;
