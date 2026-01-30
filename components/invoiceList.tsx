import InvoiceListItem from "./invoiceListItem";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const InvoiceList = async () => {
  const data = await fetch(
    "https://api.airtable.com/v0/app7Ujb6Iegx1EKAS/tblx9ZNNf4whALlrE",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.AIR_TABLE_TOKKEN}`,
      },
    },
  );

  const posts = (await data.json()) as responseInterface;

  return (
    <Table className="mt-16">
      {posts.records.length === 0 && (
        <TableCaption>لا يوجد فواتير</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="text-white text-right">#</TableHead>
          <TableHead className="text-white text-right">اليوم</TableHead>
          <TableHead className="text-white text-right">التاريخ</TableHead>
          <TableHead className="text-white text-right">الكمية</TableHead>
          <TableHead className="text-white text-right">وحدة الصرف</TableHead>
          <TableHead className="text-white text-right">سبب الرفض</TableHead>
          <TableHead className="text-white text-right">
            راى فنى و جودة
          </TableHead>
          <TableHead className="text-white text-right">الصنف</TableHead>
          <TableHead className="text-white text-right">
            رقم امر التوريد
          </TableHead>
          <TableHead className="text-white text-right">نوع الازن</TableHead>
          <TableHead className="text-white text-right">
            رقم ازن الفحص و الاستلام
          </TableHead>
          <TableHead className="text-white text-right">اسم الشركة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.records.map((record) => (
          <InvoiceListItem key={record.id} record={record} />
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
