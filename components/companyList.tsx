"use client";

import { deleteCompany, updateCompany } from "@/actions/company";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import CompanyListItem from "./companyListItem";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const CompanyList = ({ companys }: { companys: companysInterface }) => {
  const [editingRecordID, setEditingRecordID] = useState("");

  const [isPending, startTransition] = useTransition();
  const [deleteState, deleteAction, deleteIsPending] = useActionState(
    deleteCompany,
    null,
  );

  const [updateState, updateAction, updateIsPending] = useActionState(
    updateCompany,
    null,
  );

  function handleDeleteRecord(recordId: string) {
    setEditingRecordID(recordId);
    startTransition(() => {
      deleteAction(recordId);
    });
  }

  function handleUpdateRecordName(data: { recordId: string; Name: string }) {
    setEditingRecordID(data.recordId);
    startTransition(() => {
      updateAction(data);
    });
  }

  const isAnythingPending = isPending || deleteIsPending || updateIsPending;

  useEffect(() => {
    if (deleteState?.success === true) {
      toast.success("تم مسح الشركة بنجاح");
    } else if (deleteState?.success === false) {
      toast.error("حدث خطأ أثناء مسح الشركة");
    }
  }, [deleteState]);

  useEffect(() => {
    if (updateState?.success === true) {
      toast.success("تم تعديل اسم الشركة بنجاح");
    } else if (updateState?.success === false) {
      toast.error("حدث خطأ أثناء تعديل اسم الشركة");
    }
  }, [updateState]);

  return (
    <Table className="mt-16">
      {companys.records.length === 0 && (
        <TableCaption>لا يوجد شركات</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="text-white text-center">
            مسح | تعديل | حفظ
          </TableHead>
          <TableHead className="text-white text-center">اسم الشركة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companys.records.map((record) => (
          <CompanyListItem
            key={record.id}
            record={record}
            editingRecordID={editingRecordID}
            handleDeleteRecord={handleDeleteRecord}
            handleUpdateRecordName={handleUpdateRecordName}
            pending={isAnythingPending}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default CompanyList;
