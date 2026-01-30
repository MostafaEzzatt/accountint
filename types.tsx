type record = {
  company_name: string;
  receipt_number: number;
  receipt_type: string;
  supply_order_number: number;
  item: string;
  technical_opinion: string;
  rejection_reason: string;
  dispensing_unit: string;
  quantity: number;
  Date: string;
  Day: string;
};

type fullRecord = {
  createdTime: string;
  id: string;
  fields: record;
};
interface responseInterface {
  records: fullRecord[];
}
