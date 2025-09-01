import DataTableDemo from "@/components/FinalTable";


export default async function Home() {

  return (
    <div className="p-5">
    <div className="text-4xl font-bold">
      Dashboard
    </div>
    <div>
      <DataTableDemo/>
    </div>
    </div>
  );
}
