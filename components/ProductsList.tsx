"use client";
import { deleteProduct } from "@/actions/product";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import ProductListItem from "./productListItem";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const ProductsList = ({ products }: { products: productsInterface }) => {
  const [editingRecordID, seteditingRecordID] = useState("");
  const [transitionIsPending, startTransition] = useTransition();
  const [deleteProductState, submitDeleteProduct, deleteProductIsPending] =
    useActionState(deleteProduct, null);

  const pending = transitionIsPending || deleteProductIsPending;

  function handleDeleteRecord(recordId: string) {
    if (!recordId) return;
    seteditingRecordID(recordId);

    startTransition(() => {
      submitDeleteProduct(recordId);
    });
  }
  // function handleUpdateRecordName(data: {
  //   recordId: string;
  //   Name: string;
  //   company_name: string;
  // }) {}

  useEffect(() => {
    if (deleteProductState && !pending) {
      toast.success("Product deleted succesfuly");
    } else if (deleteProductState === false && !pending) {
      toast.error("Error while deleting the product ");
    }
  }, [deleteProductState, pending]);

  return (
    <Table className="mt-8">
      {products.records.length === 0 && (
        <TableCaption>لا يوجد منتجات</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="text-white text-center">
            مسح | تعديل | حفظ
          </TableHead>
          <TableHead className="text-white text-center">اسم المنتج</TableHead>
          <TableHead className="text-white text-center">اسم الشركة</TableHead>
          <TableHead className="text-white text-center">#</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.records.map((record, idx) => (
          <ProductListItem
            key={record.id}
            record={record}
            idx={idx + 1}
            editingRecordID={editingRecordID}
            handleDeleteRecord={handleDeleteRecord}
            // handleUpdateRecordName={handleUpdateRecordName}
            pending={pending}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsList;
