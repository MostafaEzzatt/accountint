import InvoiceListItem from "./invoiceListItem";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const InvoiceList = async ({ companys }: { companys: companysInterface }) => {
  const data = await fetch(
    "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
      },
    },
  );

  let posts = (await data.json()) as responseInterface;
  // sort by receipt_number descending
  posts = {
    records: posts.records.sort((a, b) => {
      return b.fields.receipt_number - a.fields.receipt_number;
    }),
  };

  return (
    <Table className="mt-16">
      {posts.records.length === 0 && (
        <TableCaption>لا يوجد فواتير</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="text-white text-center">
            مسح | تعديل | حفظ
          </TableHead>
          <TableHead className="text-white text-center">اليوم</TableHead>
          <TableHead className="text-white text-center">التاريخ</TableHead>
          <TableHead className="text-white text-center">الكمية</TableHead>
          <TableHead className="text-white text-center">وحدة الصرف</TableHead>
          <TableHead className="text-white text-center">سبب الرفض</TableHead>
          <TableHead className="text-white text-center">
            راى فنى و جودة
          </TableHead>
          <TableHead className="text-white text-center">
            رقم امر التوريد
          </TableHead>
          <TableHead className="text-white text-center">نوع الازن</TableHead>
          <TableHead className="text-white text-center">
            رقم ازن الفحص و الاستلام
          </TableHead>
          <TableHead className="text-white text-center">الصنف</TableHead>
          <TableHead className="text-white text-center">اسم الشركة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.records.map((record) => (
          <InvoiceListItem
            key={record.id}
            record={record}
            companys={companys}
          />
        ))}
      </TableBody>
    </Table>
  );
};
// {
// مسلسل -
// اسم الشركة - company_name
// رقم ازن الفحص و الاستلام - receipt_number
// نوع الازن - receipt_type
// رقم امر التوريد - supply_order_number
// الصنف - item
// راى فنى و جودة - technical_opinion
// سبب الرفض - rejection_reason
// وحدة الصرف - dispensing_unit
// كمية - quantity
// التاريخ
// اليوم
// }
export default InvoiceList;
