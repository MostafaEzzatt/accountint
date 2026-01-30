"use server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    console.log(request);
    const responseStatus = request.ok;

    if (!responseStatus) {
      return { success: false };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}
