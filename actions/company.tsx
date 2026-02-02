/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";

export async function getCompanys() {
  try {
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
    return companys;
  } catch {
    return { records: [] };
  }
}

export async function createCompany(prevState: any, data: { Name: string }) {
  // Simulate a delay for async operation
  try {
    if (!data.Name || data.Name.length < 2) {
      return { success: false };
    }

    const objectData = JSON.stringify({ records: [{ fields: data }] });

    const request = await fetch(
      "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblCx7i95ZirX0lni",
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

    const responseStatus = request.ok;

    if (!responseStatus) {
      return { success: false };
    }

    revalidatePath("/company");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteCompany(prevState: any, recordId: string) {
  try {
    if (!recordId) {
      return { success: false };
    }

    const request = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblCx7i95ZirX0lni/${recordId}`,
      {
        cache: "no-store",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
      },
    );

    const responseStatus = request.ok;

    if (!responseStatus) {
      return { success: false };
    }

    revalidatePath("/company");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function updateCompany(
  prevState: any,
  data: { recordId: string; Name: string },
) {
  try {
    if (!data.recordId || !data.Name || data.Name.length < 2) {
      return { success: false };
    }

    const objectData = JSON.stringify({
      fields: { Name: data.Name },
    });

    const request = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblCx7i95ZirX0lni/${data.recordId}`,
      {
        cache: "no-store",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
        body: objectData,
      },
    );

    const responseStatus = request.ok;

    if (!responseStatus) {
      return { success: false };
    }

    revalidatePath("/company");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function fetchAllAirtableRecords(prevStatus: any) {
  let allRecords: Array<record> = [];
  let offset: null | string = null;
  const baseUrl = `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE/`;

  try {
    do {
      // Build URL with offset if it exists
      const url: string = offset ? `${baseUrl}?offset=${offset}` : baseUrl;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Airtable Error: ${JSON.stringify(errorData)}`);
      }

      const data = (await response.json()) as responseInterface & {
        offset?: string;
      };

      // Extract the fields and add to our master list
      const pageRecords = data.records.map((record) => record.fields);
      allRecords = allRecords.concat(pageRecords);

      // Get the next offset
      offset = data.offset || null;

      // Wait 200ms to stay within 5 requests per second limit
      if (offset) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } while (offset);

    return allRecords;
  } catch {
    console.error("Fetch failed: Happend While Trying To Request Data");
  }
}
