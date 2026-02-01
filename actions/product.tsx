/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { splitIntoTens } from "@/utils/splitArrayToTens";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const data = await fetch(
      "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblS6W5PpafeX1Pln",
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
      },
    );

    let product = (await data.json()) as productsInterface;
    // sort product by createdTime descending
    product = {
      records: product.records.sort((a, b) => {
        return (
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        );
      }),
    };
    return product;
  } catch {
    return { records: [] };
  }
}
export async function getProductsByCompanyName(
  prevState: any,
  company_name: string,
) {
  if (!company_name) return { records: [] };
  try {
    const filterFormula = encodeURIComponent(
      `{company_name}="${company_name}"`,
    );
    const data = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblS6W5PpafeX1Pln?filterByFormula=${filterFormula}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
      },
    );

    let product = (await data.json()) as productsInterface;
    // sort product by createdTime descending
    product = {
      records: product.records.sort((a, b) => {
        return (
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        );
      }),
    };
    return product;
  } catch {
    return { records: [] };
  }
}

export async function createProduct(
  prevState: any,
  data: {
    company_id: string | undefined;
    Name: string;
    company_name: string;
  },
) {
  // console.log(data.Name.trim().split("\n"));
  // console.log(`company name : ${data.company_name}`);
  // console.log(`company id : ${data.company_id}`);

  if (!data.Name || !data.company_id || !data.company_name) {
    return { success: false };
  }

  try {
    const outputs: Array<boolean> = [];

    const tens = splitIntoTens(data.Name.split("\n"));

    for (let i = 0; i < tens.length; i++) {
      let element = tens[i];

      element = element.filter((i) => i != "");

      const fields = element.map((productName) => {
        return {
          fields: {
            Name: productName.trim(),
            company_name: data.company_name,
            company_id: data.company_id,
          },
        };
      });

      const objectData = JSON.stringify({ records: fields });

      const request = await fetch(
        "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblS6W5PpafeX1Pln",
        {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
          },
          body: objectData,
        },
      );
      outputs.push(request.ok);
    }

    // console.log(request);

    if (!outputs.every((i) => i == true)) {
      return { success: false };
    }

    revalidatePath("/product");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteProduct(prevState: any, productID: string) {
  if (!productID) return false;

  try {
    const request = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblS6W5PpafeX1Pln/${productID}`,
      {
        cache: "no-store",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
      },
    );

    const responseState = request.ok;

    if (!responseState) return false;

    revalidatePath("/products");
    return true;
  } catch {
    return false;
  }
}
