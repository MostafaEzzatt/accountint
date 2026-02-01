/* eslint-disable react/no-children-prop */
"use client";
import { createInvoice } from "@/actions/invoice";
import { getProductsByCompanyName } from "@/actions/product";
import {
  getInitialDateFromLocal,
  saveDateToLocal,
} from "@/utils/localstorage_date";
import { formSchema } from "@/zodeSchemas";
import { useForm } from "@tanstack/react-form";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
};

// Walid Data
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

const MainForm = ({ companys }: { companys: companysInterface }) => {
  const defaultValues = {
    company_name: "",
    receipt_number: 0,
    receipt_type: "امر مباشر",
    supply_order_number: 0,
    item: "",
    technical_opinion: "مقبول",
    rejection_reason: "",
    dispensing_unit: "عدد",
    quantity: 0,
    Date: getInitialDateFromLocal(),
  };

  const [InvoiceState, submitInvoice, InvoicePending] = useActionState(
    createInvoice,
    null,
  );
  const [getItemsState, submitGetItems, getItemsPending] = useActionState(
    getProductsByCompanyName,
    null,
  );

  const [isPendingTransition, startTransition] = useTransition();

  function updateItemsList(company_name: string) {
    startTransition(() => {
      submitGetItems(company_name);
    });
  }

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Submit the form data using the server action
      // how to get the submit function value
      startTransition(() => {
        submitInvoice(value);
      });
      saveDateToLocal(value.Date);
    },
  });

  useEffect(() => {
    if (InvoiceState === true && isPendingTransition === false) {
      form.reset();
      toast.success(`تم تحميل الفاتورة بنجاح`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InvoiceState, isPendingTransition]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-2 gap-4 text-right mt-12">
        <div className="col-span-1">
          <form.Field
            name={"receipt_number" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.receipt_number}
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const valueAsNumber = parseInt(e.target.value);
                      field.handleChange(valueAsNumber);
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    className="text-right"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"company_name" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.company_name}
                    </FieldLabel>
                  </div>
                  <Select
                    value={field.state.value as string}
                    disabled={companys.records.length < 1}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      updateItemsList(value);
                    }}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue
                        placeholder={
                          companys.records.length < 1
                            ? "لا يوجد شركات"
                            : "اسم الشركة"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {companys.records.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.fields.Name}
                        >
                          {company.fields.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"supply_order_number" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.supply_order_number}
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const valueAsNumber = parseInt(e.target.value);
                      field.handleChange(valueAsNumber);
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    className="text-right"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"receipt_type" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.receipt_type}
                    </FieldLabel>
                  </div>

                  <Select
                    value={
                      field.state
                        .value as typeof formSchema.shape.receipt_type._output
                    }
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {formSchema.shape.receipt_type.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"technical_opinion" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.technical_opinion}
                    </FieldLabel>
                  </div>

                  <Select
                    value={
                      field.state
                        .value as typeof formSchema.shape.receipt_type._output
                    }
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Theme" />
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"item" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.item}
                    </FieldLabel>
                  </div>

                  <Select
                    disabled={
                      !getItemsState || getItemsState.records.length < 1
                    }
                    value={
                      field.state
                        .value as typeof formSchema.shape.receipt_type._output
                    }
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue
                        placeholder={
                          getItemsState && getItemsState.records.length >= 1
                            ? "أختر النتج"
                            : "لا يوجد و منتجات حاليا"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {getItemsState && getItemsState.records.length >= 1 ? (
                        getItemsState.records.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.fields.Name}
                          >
                            {option.fields.Name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="لا">لا يوجد منتجات حاليا</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"dispensing_unit" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.dispensing_unit}
                    </FieldLabel>
                  </div>

                  <Select
                    value={
                      field.state
                        .value as typeof formSchema.shape.receipt_type._output
                    }
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {formSchema.shape.dispensing_unit.options.map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"rejection_reason" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.rejection_reason}
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    className="text-right"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"quantity" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.quantity}
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const valueAsNumber = parseInt(e.target.value);
                      field.handleChange(valueAsNumber);
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    className="text-right"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <form.Field
            name={"Date" as keyof typeof list_of_fields}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="w-full flex justify-end">
                    <FieldLabel htmlFor={field.name}>
                      {list_of_fields.Date}
                    </FieldLabel>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    className="text-right"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
      </div>

      <div className="flex mt-8 gap-4 justify-end">
        <Button type="button" onClick={() => form.reset()}>
          مسح
        </Button>

        <Button
          type="submit"
          className="bg-white text-black disabled:cursor-not-allowed"
          disabled={InvoicePending || isPendingTransition}
        >
          اضافة
        </Button>
      </div>
    </form>
  );
};

export default MainForm;
