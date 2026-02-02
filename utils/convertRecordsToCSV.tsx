export function convertToCSV(objArray: Array<record>) {
  if (objArray.length === 0) {
    console.error("No data to export");
    return;
  }

  const list_of_fields = {
    company_name: "اسم الشركة",
    receipt_number: "رقم ازن الفحص و الاستلام",
    receipt_type: "نوع الازن",
    supply_order_number: "رقم امر التوريد",
    item: "الصنف",
    technical_opinion: "راى فنى و جودة",
    rejection_reason: "سبب الرفض",
    dispensing_unit: "وحدة الصرف",
    quantity: "كمية",
    Date: "التاريخ",
    Day: "اليوم",
  };

  // 1. Extract Headers (handles missing fields across records)
  const headers = [
    ...new Set(objArray.flatMap((obj) => Object.keys(obj))),
  ] as Array<keyof typeof list_of_fields>;
  const arHeaders = headers.map((i) => list_of_fields[i]);

  // 2. Build CSV Rows
  const csvRows = [arHeaders.join(",")];

  for (const row of objArray) {
    const values = headers.map((header) => {
      const val = row[header] === undefined ? "" : row[header];
      // Format value: escape quotes and wrap in quotes to handle commas
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // 3. Create the Blob (The "Virtual File")
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // 4. Trigger the Download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "airtable_export.csv");

    // Hide the link, add it to the page, click it, then remove it
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL memory
    URL.revokeObjectURL(url);
  }
}
