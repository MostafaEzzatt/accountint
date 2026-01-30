export function TypographyH1({ txt = "" }: { txt?: string }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-4">
      {txt}
    </h1>
  );
}
