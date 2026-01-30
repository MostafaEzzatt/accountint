"use client";
import { deleteInvoice, updateInvoice } from "@/actions/invoice";
import { formSchema } from "@/zodeSchemas";
import { LucideBotMessageSquare, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TableCell, TableRow } from "./ui/table";

const InvoiceListItem = ({ record }: { record: fullRecord }) => {
  const [updateField, setUpdateField] = useState("");
  const [currentValue, setCurrentValue] = useState<string | number | null>(
    null,
  );

  const [pauseComp, setPauseComp] = useState(false);

  const [transitionPending, startTransition] = useTransition();
  const [updateInvoiceState, submitUpdateInvoice, updateInvoicePending] =
    useActionState(updateInvoice, null);

  const [deleteTransitionPending, startDeleteTransition] = useTransition();
  const [deleteInvoiceState, submitDeleteInvoice, deleteInvoicePending] =
    useActionState(deleteInvoice, null);
  const router = useRouter();

  function handleUpdate() {
    // Implement the update logic here
    startTransition(() => {
      submitUpdateInvoice({
        [updateField]: currentValue,
        recordId: record.id,
      });
    });

    setUpdateField("");
    setCurrentValue(null);
  }

  function handleDelete() {
    setPauseComp(true);
    startDeleteTransition(() => {
      submitDeleteInvoice({ recordID: record.id });
    });
  }

  useEffect(() => {
    // Check if the action was successful and we haven't shown the toast yet
    if (updateInvoiceState) {
      toast.success("Invoice updated successfully!");
    }
  }, [updateInvoiceState]);

  useEffect(() => {
    if (deleteInvoiceState) {
      toast.success("Invoice deleted successfully!");
      setTimeout(() => {
        router.refresh();
      }, 500);
    } else {
      setPauseComp(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteInvoiceState]);

  return (
    <>
      {pauseComp ? (
        <TableRow key={record.id}>
          <TableCell
            colSpan={12}
            className="text-center text-1xl font-black py-3"
          >
            <div className="flex items-center justify-center gap-2">
              <LucideBotMessageSquare /> Processing ...
            </div>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow key={record.id}>
          <TableCell className="text-right">
            <div className="flex justify-around items-center gap-1">
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="sm"
                onClick={handleUpdate}
                disabled={
                  transitionPending ||
                  updateInvoicePending ||
                  deleteInvoicePending ||
                  deleteTransitionPending
                }
              >
                <PencilLine />
              </Button>
              <Button
                className="cursor-pointer"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={
                  transitionPending ||
                  updateInvoicePending ||
                  deleteInvoicePending ||
                  deleteTransitionPending
                }
              >
                <Trash2 />
              </Button>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("day");
                setCurrentValue(record.fields.Day);
              }}
            >
              {updateField == "day" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.Day
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("date");
                setCurrentValue(record.fields.Date);
              }}
            >
              {updateField == "date" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.Date
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("quantity");
                setCurrentValue(record.fields.quantity);
              }}
            >
              {updateField == "quantity" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.quantity
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("dispensing_unit");
                setCurrentValue(record.fields.dispensing_unit);
              }}
            >
              {updateField == "dispensing_unit" ? (
                <Select
                  value={currentValue ? currentValue.toString() : ""}
                  onValueChange={(e) => setCurrentValue(e)}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue
                      placeholder={record.fields.dispensing_unit}
                      className="placeholder:text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.receipt_type.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                record.fields.dispensing_unit
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              className="w-full min-h-4"
              onClick={() => {
                setUpdateField("rejection_reason");
                setCurrentValue(record.fields.rejection_reason);
              }}
            >
              {updateField == "rejection_reason" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.rejection_reason
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("technical_opinion");
                setCurrentValue(record.fields.technical_opinion);
              }}
            >
              {updateField == "technical_opinion" ? (
                <Select
                  value={currentValue ? currentValue.toString() : ""}
                  onValueChange={(e) => setCurrentValue(e)}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue
                      placeholder={record.fields.dispensing_unit}
                      className="placeholder:text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.technical_opinion.options.map(
                      (option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              ) : (
                record.fields.technical_opinion
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("item");
                setCurrentValue(record.fields.item || "");
              }}
            >
              {updateField == "item" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.item
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("supply_order_number");
                setCurrentValue(record.fields.supply_order_number);
              }}
            >
              {updateField == "supply_order_number" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || 0}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.supply_order_number
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("receipt_type");
                setCurrentValue(record.fields.receipt_type);
              }}
            >
              {updateField == "receipt_type" ? (
                <Select
                  value={currentValue ? currentValue.toString() : ""}
                  onValueChange={(e) => setCurrentValue(e)}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue
                      placeholder={record.fields.dispensing_unit}
                      className="placeholder:text-white text-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.receipt_type.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                record.fields.receipt_type
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("receipt_number");
                setCurrentValue(record.fields.receipt_number);
              }}
            >
              {updateField == "receipt_number" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || 0}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.receipt_number
              )}
            </p>
          </TableCell>
          <TableCell className="text-right">
            <p
              onClick={() => {
                setUpdateField("company_name");
                setCurrentValue(record.fields.company_name);
              }}
            >
              {updateField == "company_name" ? (
                <Input
                  autoFocus
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              ) : (
                record.fields.company_name
              )}
            </p>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default InvoiceListItem;
