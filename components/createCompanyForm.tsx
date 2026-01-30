/* eslint-disable react/no-children-prop */

"use client";
import { createCompany } from "@/actions/company";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addCompanySchema } from "@/zodeSchemas";
import { useForm } from "@tanstack/react-form";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

const list_of_fields = {
  name: "اسم الشركة",
};

const CreateCompanyForm = () => {
  const [isPending, startTransition] = useTransition();
  const [createCompanyState, submitCreateCompany, createCompanyPending] =
    useActionState(createCompany, null);
  const pending = isPending || createCompanyPending;
  const form = useForm({
    defaultValues: { Name: "" },
    validators: {
      onSubmit: addCompanySchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(() => {
        submitCreateCompany(value);
      });
    },
  });

  useEffect(() => {
    if (createCompanyState?.success === true) {
      toast.success("تم إضافة الشركة بنجاح");
      form.reset();
    } else if (createCompanyState?.success === false) {
      toast.error("حدث خطأ أثناء إضافة الشركة");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCompanyState]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Field
          name={"Name"}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="w-full flex justify-end">
                  <FieldLabel htmlFor={field.name}>
                    {list_of_fields.name}
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

      <Button
        type="submit"
        className="mt-4 float-right disabled:cursor-not-allowed "
        variant={"secondary"}
        disabled={pending}
      >
        إضافة شركة
      </Button>
    </form>
  );
};

export default CreateCompanyForm;
