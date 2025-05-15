
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

interface OrderNotesProps {
  remarks: string;
}

const OrderNotes = ({ remarks }: OrderNotesProps) => {
  if (!remarks) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{remarks}</p>
      </CardContent>
    </Card>
  );
};

export default OrderNotes;
