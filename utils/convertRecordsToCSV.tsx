export function convertToCSV(objArray: Array<record>) {
  if (objArray.length === 0) {
    console.error("No data to export");
    return;
  }

  // const list_of_fields = {
  //   company_name: "اسم الشركة",
  //   item: "الصنف",
  //   receipt_number: "رقم ازن الفحص و الاستلام",
  //   receipt_type: "نوع الازن",
  //   supply_order_number: "رقم امر التوريد",
  //   technical_opinion: "راى فنى و جودة",
  //   rejection_reason: "سبب الرفض",
  //   dispensing_unit: "وحدة الصرف",
  //   // quantity: "كمية",
  //   // Date: "التاريخ",
  //   sunday: "الاحد",
  //   monday: "الاثنين",
  //   tuesday: "الثلاثاء",
  //   wensday: "الاربعاء",
  //   thursday: "الخميس",
  //   friday: "الجمعة",
  //   saturday: "السبت",
  // };

  // 1. Extract Headers (handles missing fields across records)
  // const headers = [
  //   ...new Set(objArray.flatMap((obj) => Object.keys(obj))),
  // ] as Array<keyof typeof list_of_fields>;
  // const arHeaders = headers.map((i) => list_of_fields[i]);

  // 2. Build CSV Rows
  const csvRows = [
    [
      "اسم الشركة",
      "الصنف",
      "رقم ازن الفحص و الاستلام",
      "نوع الازن",
      "رقم امر التوريد",
      "راى فنى و جودة",
      "سبب الرفض",
      "وحدة الصرف",
      "الاحد",
      "الاثنين",
      "الثلاثاء",
      "الاربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ].join(","),
  ];

  for (const row of objArray) {
    const values = [];
    values.push(escape_CSV_value(row["company_name"]));
    values.push(escape_CSV_value(row["item"]));
    values.push(escape_CSV_value(row["receipt_number"]));
    values.push(escape_CSV_value(row["receipt_type"]));
    values.push(escape_CSV_value(row["supply_order_number"]));
    values.push(escape_CSV_value(row["technical_opinion"]));
    values.push(escape_CSV_value(row["rejection_reason"] || ""));
    values.push(escape_CSV_value(row["dispensing_unit"]));
    values.push(escape_CSV_value(row["Day"] == "الاحد" ? row["quantity"] : ""));
    values.push(
      escape_CSV_value(row["Day"] == "الاثنين" ? row["quantity"] : ""),
    );
    values.push(
      escape_CSV_value(row["Day"] == "الثلاثاء" ? row["quantity"] : ""),
    );
    values.push(
      escape_CSV_value(row["Day"] == "الاربعاء" ? row["quantity"] : ""),
    );
    values.push(
      escape_CSV_value(row["Day"] == "الخميس" ? row["quantity"] : ""),
    );
    values.push(
      escape_CSV_value(row["Day"] == "الجمعة" ? row["quantity"] : ""),
    );
    values.push(escape_CSV_value(row["Day"] == "السبت" ? row["quantity"] : ""));
    console.log(values);

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

function escape_CSV_value(val: string | number) {
  return ("" + val).replace(/"/g, '""');
}
