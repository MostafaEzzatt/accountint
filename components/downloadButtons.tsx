"use client";

import { fetchAllAirtableRecords } from "@/actions/company";
import { convertToCSV } from "@/utils/convertRecordsToCSV";
import { useActionState, useEffect, useTransition } from "react";
import { Button } from "./ui/button";

const DownloadButtons = () => {
  const [status, submit, statusPending] = useActionState(
    fetchAllAirtableRecords,
    null,
  );

  const [transitionPending, startTransition] = useTransition();

  function handleCLick() {
    startTransition(() => {
      submit();
    });
  }

  useEffect(() => {
    if (status && !statusPending && !transitionPending) {
      convertToCSV(status);
    }
  }, [status, statusPending, transitionPending]);

  return (
    <div>
      <Button onClick={handleCLick}>Download Records</Button>
    </div>
  );
};

export default DownloadButtons;
