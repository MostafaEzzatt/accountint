// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

// Marks every function in this file as a Server Action

interface formDataInterface {
  company_name: string;
  receipt_number: number;
  receipt_type: string;
  supply_order_number: number;
  item: string;
  technical_opinion: string;
  rejection_reason: string;
  dispensing_unit: string;
  quantity: number;
  Date: string;
}
export async function createInvoice(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: formDataInterface,
) {
  const dayTranslations = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
  };

  const enDay = new Date(formData.Date).toLocaleDateString("en-US", {
    weekday: "long",
  }) as keyof typeof dayTranslations;

  const rawData = {
    ...formData,
    Day: dayTranslations[enDay],
  };

  try {
    const response = await fetch(
      "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
        body: JSON.stringify({ records: [{ fields: rawData }] }),
      },
    );

    if (!response.ok) {
      return false;
    }
    // const result = await response.json();
    return true;
  } catch {
    // throw error;
    return false;
  }
}

type updateData = Partial<formDataInterface> & {
  recordId: string;
};

export async function updateInvoice(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  updatedFields: updateData,
) {
  try {
    const { recordId, ...fields } = updatedFields;

    const cleanedFields: Record<string, string | number> = {};

    for (const key in fields) {
      const typedKey = key as keyof typeof fields;
      const value = fields[typedKey];

      if (
        typedKey === "quantity" ||
        typedKey === "receipt_number" ||
        typedKey === "supply_order_number"
      ) {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          typeof value !== "number"
        ) {
          cleanedFields[typedKey as string] = parseInt(value);
        }
      } else if (typedKey !== undefined && value !== undefined) {
        cleanedFields[typedKey as string] = value;
      }
    }

    const response = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE/${recordId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
        body: JSON.stringify({ fields: cleanedFields }),
      },
    );

    if (!response.ok) {
      return false;
    }

    revalidatePath("/");
    return true;
  } catch {
    return false;
  }
}

export async function deleteInvoice(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: { recordID: string },
) {
  try {
    const recordId = formData.recordID;

    if (!recordId) {
      return false;
    }

    const request = await fetch(
      `https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE/${recordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
        },
      },
    );

    const response = request.ok;

    if (response) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
