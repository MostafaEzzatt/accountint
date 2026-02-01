import { LucideBotMessageSquare, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TableCell, TableRow } from "./ui/table";
import { TypographyP } from "./ui/TypographyP";

const ProductListItem = ({
  record,
  editingRecordID,
  handleDeleteRecord,
  // handleUpdateRecordName,
  pending,
}: {
  record: fullRecord<productsResponseType>;
  editingRecordID: string;
  handleDeleteRecord: (recordId: string) => void;
  // handleUpdateRecordName: (data: {
  //   recordId: string;
  //   Name: string;
  //   company_name: string;
  // }) => void;
  pending: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.fields.Name);
  const [companyName, setCompanyName] = useState(record.fields.company_name);

  return pending && record.id == editingRecordID ? (
    <TableRow>
      <TableCell colSpan={12} className="text-center text-1xl font-black py-3">
        <div className="flex items-center justify-center gap-2">
          <LucideBotMessageSquare /> Processing ...
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow key={record.id}>
      <TableCell className="text-center">
        <div className="flex justify-around items-center gap-1">
          {/* <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => {
              // handleUpdateRecordName({ recordId: record.id, Name: name });
              setEditing(false);
            }}
            disabled={pending}
          >
            <PencilLine />
          </Button> */}

          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRecord(record.id)}
            disabled={pending}
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>

      {/* <TableCell className="text-center" onClick={() => setEditing(true)}> */}
      <TableCell className="text-center">
        {editing ? (
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <TypographyP txt={record.fields.Name} />
        )}
      </TableCell>

      <TableCell className="text-center">
        {editing ? (
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        ) : (
          <TypographyP txt={record.fields.company_name} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default ProductListItem;
