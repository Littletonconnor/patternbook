import { Card, Specs } from "../../../src/app/foundations/_parts/Section";
import { ExampleRows } from "../../../src/app/foundations/_parts/StateMatrix";
import { Primitive } from "../ui/Primitive";

export function PrimitiveExample() {
  return (
    <Card title="Primitive">
      <ExampleRows
        rows={[
          { name: "default", use: "Where it is used", example: <Primitive>Primitive</Primitive> },
        ]}
      />
      <Specs rows={[["Status", "Built: src/ui/Primitive.tsx"]]} />
    </Card>
  );
}
