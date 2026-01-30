/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";

export async function createCompany(prevState: any, data: { Name: string }) {
  // Simulate a delay for async operation
  try {
    if (!data.Name || data.Name.length < 2) {
      return { success: false };
    }

    const objectData = JSON.stringify({ records: [{ fields: data }] });
    console.log(objectData);
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
