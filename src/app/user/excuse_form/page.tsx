import ExcuseFormSpace from './form';
export default function ExcuseForm() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
      <div className="flex flex-col items-center px-6 py-4" style={{ width: '1200px', height: '800px', backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
        <h1 className="mb-4 text-4xl font-bold text-black">Excuse Form</h1>
        <ExcuseFormSpace />
      </div>
    </main>
  );
}