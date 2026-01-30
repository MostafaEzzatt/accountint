import { getCompanys } from "@/actions/company";
import { getProducts } from "@/actions/product";
import CreateProductForm from "@/components/createProductForm";
import ProductsList from "@/components/ProductsList";
import { TypographyH1 } from "@/components/ui/TypographyH1";

const Product = async () => {
  const companys = await getCompanys();
  const products = await getProducts();
  return (
    <>
      <TypographyH1 txt="الشركات" />

      <CreateProductForm companys={companys} />

      <ProductsList products={products} />
    </>
  );
};

export default Product;
