/* eslint-disable react/no-children-prop */

"use client";
import { createProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { addProductSchema } from "@/zodeSchemas";
import { useForm } from "@tanstack/react-form";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const list_of_fields = {
  Name: "اسم المنتجات",
  company_name: "اسم الشركة",
};

const CreateProductForm = ({ companys }: { companys: companysInterface }) => {
  const [isPending, startTransition] = useTransition();
  const [createProductState, submitCreateProduct, createProductPending] =
    useActionState(createProduct, null);
  const pending = isPending || createProductPending;
  const form = useForm({
    defaultValues: { Name: "", company_name: "" },
    validators: {
      onSubmit: addProductSchema,
    },
    onSubmit: async ({ value }) => {
      const findCompany = companys.records.find(
        (r) => r.fields.Name == value.company_name,
      )?.id;

      const valueWithCompanyId = {
        ...value,
        company_id: findCompany,
      };
      startTransition(() => {
        submitCreateProduct(valueWithCompanyId);
      });
    },
  });

  useEffect(() => {
    if (createProductState?.success === true) {
      toast.success("تم إضافة المنتجات بنجاح");
      form.reset();
    } else if (createProductState?.success === false) {
      toast.error("حدث خطأ أثناء إضافة المنتجات");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProductState]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name={"company_name"}
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
                  onValueChange={(value) => {
                    field.handleChange(value);
                  }}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="اسم الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companys.records.map((company) => (
                      <SelectItem key={company.id} value={company.fields.Name}>
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

        <form.Field
          name={"Name"}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="w-full flex justify-end">
                  <FieldLabel htmlFor={field.name}>
                    {list_of_fields.Name}
                  </FieldLabel>
                </div>
                <Textarea
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
                  rows={4}
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </div>

      <Button
        type="submit"
        className="mt-4 float-right disabled:cursor-not-allowed "
        variant={"secondary"}
        disabled={pending}
      >
        إضافة المنتجات
      </Button>
      <div className="clear-both"></div>
    </form>
  );
};

export default CreateProductForm;
