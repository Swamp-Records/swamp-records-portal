import { useState } from "react";


function showExcuseForm(visible: boolean, setVisible: (visible: boolean) => void) {
    if (visible) {
        return(
            <div className="flex flex-col items-center gap-4 border-t-2 border-dashed border-black px-6 py-4">
                <div className="child"
        )
    }
}
export default function FormSpace() {
    const [isFormVisible, setIsFormVisible] = useState(true);
    return (
        <>
            <div className="shrink-0 py-2" style={{ width: '100%', backgroundColor: '#EDEDED', borderWidth: '5px', borderColor: '#000000', borderRadius: '20px', marginBottom: '10px'}}>
            <showExcuseForm visible={isFormVisible} setVisible={setIsFormVisible} />
            </div>
        </>
    )
}