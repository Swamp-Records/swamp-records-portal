export default function History() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-4 font-mono">
        <div className="flex max-h-[min(800px,85vh)] w-full max-w-[1200px] flex-col items-center px-3 py-4 sm:px-6 gap-4" style={{ backgroundColor: '#CCCCCC', borderWidth: '10px', borderColor: '#000000', borderRadius: '20px'}}>
          <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl text-black">Attendance History</h1>

          <div className="flex w-full flex-row gap-4">
            <div className = "flex-1">
              <div style={{ backgroundColor: '#EDEDED', aspectRatio: '1/1', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', padding: '10px'}}>
                <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl text-black">Excused Absences</h2>
              </div>
            </div>

            <div className = "flex-1">
              <div style={{ backgroundColor: '#EDEDED', aspectRatio: '1/1', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', padding: '10px'}}>
                <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl text-black">Unexcused Absences</h2>
              </div>
            </div>

            <div className = "flex-1">
              <div style={{ backgroundColor: '#EDEDED', aspectRatio: '1/1', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', padding: '10px'}}>
                <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl text-black">Attended Meetings</h2>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#EDEDED', height: '200px', width: '100%', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px'}}>
            <div className="flex w-full flex-row gap-4">

            </div>
          </div>
        </div>
      </main>
  );
}  